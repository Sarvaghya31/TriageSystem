import React from 'react'
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
function CheckAuth({children,protectedRoute=false}) {
  //console.log(protectedRoute);
  const navigate=useNavigate();
  const [loading,setLoading]=useState(true)
  const token=useSelector((state)=>state.auth.status)
  useEffect(()=>{
    //console.log("hi");
   if(protectedRoute){
    if(!token)
    {
        navigate("/login")
    }
    else{
        setLoading(false)
    }
   }
   else{
    if(token){
        navigate("/")
    }
    else{
        setLoading(false);
    }
   }
  },[navigate,protectedRoute,token]);
  if(loading){
    return <div>loading...</div>
  }
  return children;
}

export default CheckAuth