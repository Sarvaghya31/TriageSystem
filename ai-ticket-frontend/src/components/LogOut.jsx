import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/authslice'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import { disconnectSocket } from '../utils/socket';
function LogOut() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const logoutHandler=async()=>{
        try{
          const res=await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`,{
            method:'POST',
            headers:{
              "Content-Type":"application/json"
            },
            credentials:'include'
          })
          dispatch(logout());
          disconnectSocket();
          toast.success("Logout successful");
          navigate('/login')
        }
        catch{
            toast.error("Logout Failed")
        }
    }

  return (
    <div>
        <button onClick={logoutHandler} className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
            Logout
        </button>
        </div>
  )
}

export default LogOut