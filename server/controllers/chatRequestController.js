import ChatRequest from "../models/ChatRequest.js";
import User from "../models/User.js";

export const sendChatRequest = async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.body;

  try {
    const existing = await ChatRequest.findOne({ senderId, receiverId });
    const existingReverse = await ChatRequest.findOne({ senderId: receiverId, receiverId: senderId });

    if (existingReverse && existingReverse.status === 'pending') {
      return res.status(409).json({
        success: false,
        message: 'This user has already sent you a chat request. Please check in received chat requests.',
      });
    }

    //if (existing) return res.json({ success: false, message: "Already requested ago." });

    if (existing) {
      // If accepted, already chatting
      if (existing.status === 'accepted') {
        return res.status(200).json({ success: false, message: 'You are already connected.' });
      }

      // If pending, prevent duplicate
      if (existing.status === 'accepted') {
        return res.status(409).json({ success: false, message: 'Chat request already sent.' });
      }

      // If rejected, allow sending again 
      const request = await ChatRequest.create({ senderId, receiverId });
      return res.status(200).json({ success: true, request, message: 'Chat request re-sent.' });
    }

    const request = await ChatRequest.create({ senderId, receiverId });
    res.json({ success: true, request, message:'Chat request sent.' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getChatRequests = async (req, res) => {
  const userId = req.user._id;

  try {
    const received = await ChatRequest.find({ receiverId: userId }).populate("senderId", "-password");
    const sent = await ChatRequest.find({ senderId: userId }).populate("receiverId", "-password");
    res.json({ success: true, received, sent });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const acceptChatRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    await ChatRequest.findByIdAndUpdate(requestId, { status: "accepted" });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const rejectChatRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    await ChatRequest.findByIdAndUpdate(requestId, { status: "rejected" });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};