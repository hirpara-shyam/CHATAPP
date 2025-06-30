import React, { useContext, useEffect, useState, useRef } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
    const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext);
    const {onlineUsers, axios, authUser, logout} = useContext(AuthContext);
    
    // For getting request with status accepted for the Sidebar Users list
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [acceptedUsers, setAcceptedUsers] = useState([]);

    const getRequests = async () => {
        const { data } = await axios.get("/api/chat-requests");
        if (data.success) {
            setReceived(data.received);
            setSent(data.sent);
        }
    };

    useEffect(()=>{
        getRequests();
    }, []);

    const [input, setInput] = useState(false)

    //Handle Menu
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    //For navigation
    const navigate = useNavigate();

    const myId = authUser._id;

    useEffect(()=>{
        setAcceptedUsers(users.filter((user) => {
            const userId = user._id;

            const isAccepted = sent.some(r => 
                ((r.receiverId._id || r.receiverId) === userId) &&
                ((r.senderId._id || r.senderId) === myId) &&
                r.status === "accepted"
            ) || received.some(r => 
                ((r.senderId._id || r.senderId) === userId) &&
                ((r.receiverId._id || r.receiverId) === myId) &&
                r.status === "accepted"
            );

            return isAccepted;
        }));
    }, [sent, received]);

    const filteredUsers = input ? acceptedUsers.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : acceptedUsers;
    
    useEffect(()=>{
        getUsers();
    }, [onlineUsers])

    return (
        <div className={`h-full bg-[#8185B2]/10 p-5 rounded-r-xl overflow-auto text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
            <div className="h-full flex flex-col">
                {/* Top section - fixed */}
                <div className='pb-3'>
                    <div className='flex justify-between items-center'>
                        <img src={assets.logo} alt='logo' className='max-w-40'/>
                        <div ref={menuRef} className='relative py-2 group'>
                            <img src={assets.menu_icon} alt='Menu' onClick={() => setMenuOpen(prev => !prev)} className='max-h-5 cursor-pointer z-30 relative'/>
                            <div className={`absolute top-full right-0 z-20 w-33 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 ${menuOpen ? 'block' : 'hidden'} group-hover:block `}>
                                <p onClick={()=>navigate('/chat-requests')} className='cursor-pointer text-sm whitespace-nowrap'>Chat Requests</p> 
                                <hr className='my-2 border-t border-gray-500'/>
                                <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                                <hr className='my-2 border-t border-gray-500'/>
                                <p onClick={()=>logout()} className='cursor-pointer text-sm'>Logout</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                        <img src={assets.search_icon} alt='Search' className='w-3' />
                        <input onChange={(e)=>setInput(e.target.value)} type='text' className='bg-transparent border-none outline-none text-white text-xs
                        placeholder-[#c8c8c8] flex-1' placeholder='Search User...'/>
                    </div>

                    <div onClick={() => navigate('/chat-requests?tab=all')}
                    className="cursor-pointer p-2 text-center text-sm font-medium text-white bg-white/10 backdrop-blur-md rounded-xl mx-2 my-3 hover:bg-white/20 transition" >
                        Find New Friends
                    </div>

                </div>

                {/* Scrollable users list */}
                <div className='flex-1 overflow-auto custom-scrollbar px-2 pb-2 pr-1'>
                    {filteredUsers.length === 0 ? (
                        <div className='text-center text-gray-400 py-10 text-sm'>No users found.</div>
                    ):(
                        filteredUsers?.map((user, index) => {
                            return (
                                <div onClick={()=>{setSelectedUser(user); setUnseenMessages(0);}}
                                    key={index}
                                    className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm border-b border-b-emerald-800
                                        ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}
                                    >
                                    <img src={user?.profilePic || assets.avatar_icon} alt='' className='w-[35px] aspect-[1/1] rounded-full' />
                                    <div className='flex flex-col leading-5 flex-1'>
                                        <p>{user.fullName}</p>
                                        {onlineUsers.includes(user._id)
                                        ? <span className='text-green-400 text-xs'>Online</span>
                                        : <span className='text-neutral-400 text-xs'>Offline</span>}
                                    </div>

                                    {/* If chat is accepted, allow selecting */}
                                    {
                                        unseenMessages[user._id] > 0 && (
                                        <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                                            {unseenMessages[user._id]}
                                        </p>
                                        )
                                    }
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar