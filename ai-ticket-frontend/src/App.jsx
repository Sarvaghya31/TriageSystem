
import CustomToaster from './components/Toaster.jsx'
import Header from './components/Header.jsx'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login } from './store/authslice.js'
import { useState } from 'react'
import { connectSocket } from './utils/socket.js'
function App() {
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false);
  const getCurrentUser=async ()=>{
    try{
    const res=await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/getCurrentUser`, {
        method: "GET",
        headers:{
              "Content-Type":"application/json"
          },
        credentials:"include"
      });
    
    if(res.status==200)
    {
      const data=await res.json();
      dispatch(login(data))
      connectSocket();
    }
  }
  catch(err){
    toast.error("Something went wrong");
  }
  finally{
    setLoading(true)
  }
  }
  useEffect(()=>{
   getCurrentUser();
  },[])

  return (
   <>
    {loading && (<div className='flex flex-col'>
      <CustomToaster/>
        <Header/>
        <main>
        <Outlet/>
        </main>
    </div>)}
    </>
  )
}

export default App