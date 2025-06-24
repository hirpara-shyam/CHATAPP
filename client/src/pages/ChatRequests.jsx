import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ChatRequests = () => {
  const { axios, authUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getRequests = async () => {
    const { data } = await axios.get("/api/chat-requests");
    if (data.success) {
      setReceived(data.received);
      setSent(data.sent);
    }
  };

  const getAllUsers = async () => {
    const { data } = await axios.get("/api/messages/users");
    
    if (data.success) {
      const filtered = data.users.filter((user) => user._id !== authUser._id);
      setAllUsers(filtered);
    }
  };

  const handleSendRequest = async (receiverId) => {
    const alreadySent = sent.find(r => r.receiverId._id === receiverId);
    const alreadyReceived = received.find(r => r.senderId._id === receiverId);

    if (alreadySent && alreadySent.status === "pending") {
      return toast.error("You’ve already sent a request to this user.");
    }

    if (alreadyReceived && alreadyReceived.status === "pending") {
      return toast.error("This user has already sent you a request.");
    }

    try {
      const res = await axios.post("/api/chat-requests/send", { receiverId });
      if (res.data.success) {
        toast.success("Chat Request Sent.");
        getRequests();
      } else {
        toast.error(res.data.message || "Could not send request.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send request.");
    }
  };

  const handleAccept = async (id) => {
    await axios.put(`/api/chat-requests/accept/${id}`);
    getRequests();
  };

  const handleReject = async (id) => {
    await axios.put(`/api/chat-requests/reject/${id}`);
    getRequests();
  };

  useEffect(() => {
    getRequests();
    getAllUsers();
  }, []);

  const renderRequests = (requests, type) => {
    requests = requests.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    return requests.map((req) => {
      const user = type === "received" ? req.senderId : req.receiverId;
      const time = new Date(req.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      return (
        <div key={req._id} className="flex justify-between items-center p-4 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <img src={user.profilePic || assets.avatar_icon} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-white font-medium">{user.fullName}</p>
              <p className="text-white text-sm font-extralight">Bio: {user.bio}</p>
              <p className="text-xs text-gray-400">{time}</p>
            </div>
          </div>
          <div className="text-sm">
            {req.status === "pending" && type === "received" ? (
              <div className="flex gap-2">
                <button onClick={() => handleAccept(req._id)} className="bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 rounded-md text-white">Accept</button>
                <button onClick={() => handleReject(req._id)} className="bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1 rounded-md text-white">Reject</button>
              </div>
            ) : (
              <span
                className={`px-3 py-1 rounded-md text-white ${req.status === "accepted" ? "bg-green-700" : req.status === "rejected" ? "bg-red-700" : "bg-yellow-600"}`}
              >
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            )}
          </div>
        </div>
      );
    });
  };

  const renderUserList = () => {
    const filteredUsers = allUsers.filter(user => user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!filteredUsers.length) {
      return <p className="text-center text-gray-400 py-6">No users found.</p>;
    }

    return filteredUsers.map((user) => {
      const userId = user._id;
      const myId = authUser._id;

      const sentReq = sent.find(r => (r.receiverId._id || r.receiverId) === userId);
      const receivedReq = received.find(r => (r.senderId._id || r.senderId) === userId);

      // ✅ Check if any request exists between current user and user, and is accepted
      const isAccepted = sent.some(r => 
        ((r.receiverId._id || r.receiverId) === userId) &&
        ((r.senderId._id || r.senderId) === myId) &&
        r.status === "accepted"
      ) || received.some(r => 
        ((r.senderId._id || r.senderId) === userId) &&
        ((r.receiverId._id || r.receiverId) === myId) &&
        r.status === "accepted"
      );

      if (isAccepted) console.log("Already connected with", user.fullName);

      // if (receivedReq && receivedReq.status === "pending" && (receivedReq.senderId._id || receivedReq.senderId) === user._id) {
      if (receivedReq?.status === "pending") {
        return (
          <div key={user._id} className="flex justify-between items-center p-4 border-b border-gray-600">
            <div className="flex items-center gap-3">
              <img src={user.profilePic || assets.avatar_icon} className="w-10 h-10 rounded-full" />
              <p className="text-white font-medium">{user.fullName}</p>
              <p className="text-white text-sm font-extralight">Bio: {user.bio}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleAccept(receivedReq._id)} className="bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 rounded-md text-white">Accept</button>
              <button onClick={() => handleReject(receivedReq._id)} className="bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1 rounded-md text-white">Reject</button>
            </div>
          </div>
        );
      }

      let label = "Send Request";
      let disabled = false;

      if (isAccepted) {
        label = "Connected";
        disabled = true;
      } else if (
        sentReq?.status === "pending" ||
        receivedReq?.status === "pending"
      ) {
        label = "Pending";
        disabled = true;
      }

      return (
        <div key={user._id} className="flex justify-between items-center p-4 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <img src={user.profilePic || assets.avatar_icon} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-white font-medium">{user.fullName}</p>
              <p className="text-white text-sm font-extralight">Bio: {user.bio}</p>
            </div>
          </div>
          <button disabled={disabled} onClick={() => handleSendRequest(user._id)}
            className={`text-sm px-3 py-1 rounded-md ${disabled ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-violet-600 text-white"}`}
          >
            {label}
          </button>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center px-5 py-10 sm:px-[15%]">
      <div className="w-5/6 max-w-2xl h-[80vh] text-gray-300 rounded-lg overflow-hidden border-2 border-gray-600 shadow-xl backdrop-blur-2xl items-center justify-between max-sm:flex-col-reverse">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-600">
          {/* <img src={assets.back_arrow_icon} onClick={() => navigate("/")} className="w-5 cursor-pointer" /> */}
          <span onClick={() => navigate("/")} className="cursor-pointer text-lg font-semibold">&#8592;</span>
          <h2 className="text-xl font-semibold">QuickChat</h2>
        </div>

        <div className="flex justify-center gap-10 border-b border-gray-600 py-3">
          <button onClick={() => setActiveTab("received")} className={`text-lg pb-1 ${activeTab === "received" ? "border-b-2 border-white" : "text-gray-400"}`}>
            Received
          </button>
          <button onClick={() => setActiveTab("sent")} className={`text-lg pb-1 ${activeTab === "sent" ? "border-b-2 border-white" : "text-gray-400"}`}>
            Sent
          </button>
          <button onClick={() => setActiveTab("all")} className={`text-sm pb-1 ${activeTab === "all" ? "border-b-2 border-white" : "text-gray-400"}`}>
            All Users
          </button>
        </div>

        {activeTab === "all" && (
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 mb-3 rounded-md bg-[#1e1e2f] text-white outline-none border border-gray-500"
            />
          </div>
        )}

        <div className="overflow-y-auto h-[calc(100%-130px)] custom-scrollbar">
          {activeTab === "received" 
          ? renderRequests(received, "received") 
          : activeTab === "sent" 
          ? renderRequests(sent, "sent")
          : renderUserList()}
        </div>
      </div>
    </div>
  );
};

export default ChatRequests;