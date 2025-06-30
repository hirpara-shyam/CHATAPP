import React, { useContext, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'
import ChatRequests from './pages/ChatRequests'

const App = () => {
  const {authUser, loading} = useContext(AuthContext)
  const location = useLocation();

  useEffect(() => {
      // console.log("authUser updated:", authUser);
  }, [authUser]);

  if (loading) return null;

  return (
    <div className='bg-[url("/bgWallPaper.webp")] bg-contain'>
      <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to={"/login"} replace/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to={location.pathname === '/login' ? '/' : location.pathname} replace/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to={"/login"} replace/>}/>
        <Route path="/chat-requests" element={authUser ? <ChatRequests /> : <Navigate to={"/login"} replace/>} />
      </Routes>
    </div>
  )
}

export default App