import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
    const {selectedUser} = useContext(ChatContext)
    const [showRightSidebar, setShowRightSidebar] = useState(false);

    const isMobile = window.innerWidth < 768;

  return (
    <div className='border w-full h-screen items-center justify-center sm:px-[15%] sm:py-[5%]'>
        <div className={`w-full h-full backdrop-blur-xl border-2 border-gray-600 rounded-2xl grid grid-cols-1 overflow-hidden relative 
        ${selectedUser 
          ? (showRightSidebar 
                      ? 'md:grid-cols-[1fr_1.5fr_1fr]' 
                      : 'md:grid-cols-[1fr_1.7fr]') 
          : 'md:grid-cols-2'}`}>

            {isMobile ? (
              <>
                {/* Mobile Layout */}
                {!selectedUser && <Sidebar />}
                {selectedUser && !showRightSidebar && (
                  <ChatContainer className="pt-5" onToggleSidebar={() => setShowRightSidebar(true)} />
                )}
                {selectedUser && showRightSidebar && (
                  <RightSidebar onBack={() => setShowRightSidebar(false)} />
                )}
              </>
            ) : (
              <>
                {/* Desktop Layout */}
                <Sidebar />
                <ChatContainer onToggleSidebar={() => setShowRightSidebar(prev => !prev)} />
                {showRightSidebar && <RightSidebar />}
              </>
            )}
        </div>
    </div>
  )
}

export default HomePage