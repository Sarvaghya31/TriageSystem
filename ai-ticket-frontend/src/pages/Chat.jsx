import React, { useEffect, useState } from 'react'
import {useParams,useLocation} from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';
import { addToChat, refreshChat } from '../store/chatSlice';
import { getSocket } from '../utils/socket';
import toast from 'react-hot-toast'
function Chat() {
  const {id}=useParams();
  const dispatch=useDispatch();
  const chatDetails=useSelector(state=>state.chat.messages);
  const location=useLocation()
  const [loading,setLoading]=useState(false)
  const [inputMessage,setInputMessage]=useState('');
  const [ticketInfo,setTicketInfo]=useState(null);
  const senderid=useSelector(state=>state.auth.loginData._id)
  const user=useSelector(state=>state.auth.loginData.role)
  const socket=getSocket()
  const sendMessage=async (e)=>{
    e.preventDefault();
    try{
       const res=await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/sendMessage`,{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body: JSON.stringify({message:inputMessage,ticketid:id,senderid,recieverid:ticketInfo.assignedTo===senderid?ticketInfo.createdBy:ticketInfo.assignedTo,recieveridAdmin:ticketInfo.assignedToAdmin}),
          credentials:'include'
        })
        const recieverID=(ticketInfo.assignedTo===senderid || ticketInfo.assignedToAdmin===senderid)?ticketInfo.createdBy:ticketInfo.assignedTo || ticketInfo.assignedToAdmin;
        socket.emit("message",{message:inputMessage,recieverid:recieverID,ticketId:id});
        dispatch(addToChat({message:inputMessage,sender:senderid}))
    }
    catch(err){
      console.log(err)
       toast.error("Error Sending the message,send again")
    }
  }

  const fetchData=async ()=>{
    try{
      const res=await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/loadChat`,{
        method:"POST",
        headers:{
              "Content-Type":"application/json"
        },
        body: JSON.stringify({ticketId:id}),
        credentials:'include'

      })
      if(res.ok)
      {
        const resData=await res.json();
        //console.log(resData);
        //console.log(senderid);
        dispatch(refreshChat({messages:resData.messages,ticketId:id}));
        setLoading(true);
      }
    }
    catch{
        toast.error("Unable to fetch the chats");
    }
  }

  const getTicketDetails=async ()=>{
    try{
     const res=await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,{
      method:"GET",
      headers:{
          "Content-Type":"application/json"
        },
        credentials:'include'
     })
     const ticketData=await res.json();
     setTicketInfo(ticketData.ticket)
     console.log(ticketData)
    }
    catch{
       toast.error("Unable to get ticket details")
    }
  }

  useEffect(()=>{
    getTicketDetails()
    setLoading(false);
   fetchData()
  },[location.search,id])

  return (
    <div>
      {loading? <div> 
        {
          chatDetails.map((message,i)=>(
            <div key={i}
            className={`px-4 py-2 rounded-lg max-w-xs my-2 mr-2 ml-2 ${
      message.sender === senderid
        ? "bg-blue-800 ml-auto text-right" // 
        : "bg-gray-200 mr-auto text-left text-black" 
    }`}
            >
              {message.message}
            </div>
          ))
        }
        <div className='fixed bottom-0 left-0 right-0 mb-4 ml-2 p-4'>
        <form onSubmit={sendMessage} className='space-x-2 space-between'>
        <input
        type='text'
        name='message'
        placeholder="Type your message"
        className={user==='admin'?"input input-bordered w-20/24":"input input-bordered w-22/24 rounded-2xl"}
        onChange={(e)=>{
          setInputMessage(e.target.value)
        }}
        required
        >
        </input>
        <button
        type="submit"
        className="btn btn-primary w-1/24">
          Send
        </button>
         {user==='admin'? <button
        className="btn btn-primary w-1/24 bg-green-400">
          Close Ticket
        </button>:''}
        </form>
        </div>
      </div> : <div className='m-auto'>
        <div className='m-auto'>
         Loading Chats
        </div>
      </div>
      }

    </div>
  )
}

export default Chat