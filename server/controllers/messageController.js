import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

//Get all users accept logged in user
export const getUsersForSidebar = async (req, res)=>{
    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        //Count of not seen messages
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId:user._id, receiverId:userId, seen:false})

            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true, users:filteredUsers, unseenMessages})
    } catch(error){
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

//Get all messages for selected users
export const getMessages = async (req, res)=>{
    try{
        const {id:selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId:myId, receiverId:selectedUserId},
                {senderId:selectedUserId, receiverId:myId},
            ]
        })

        await Message.updateMany({senderId:selectedUserId, receiverId:myId}, {seen:true})

        res.json({success:true, messages})
    }catch(error){
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

//Api to mark message as seen using message Id
export const markMessageAsSeen = async (req, res)=>{
    try{
        const {id} = req.params.id;
        const updatedMsg = await Message.findByIdAndUpdate(id, {seen:true});

        if (!updatedMessage) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        res.json({success:true, message: "Marked as seen"})
    } catch(error){
        console.log("Error marking message seen:", error.message);
        res.json({success:false, message:error.message})
    }
}

//Send message to selected users
export const sendMessage = async (req, res) => {
     try{
        const {text, image, message} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        const savedMessage = await newMessage.save(); 

        //Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", savedMessage)
        }

        res.json({success:true, newMessage: savedMessage});
     } catch(error){
        console.log(error.message);
        res.json({success:false, message:error.message})
     }
}