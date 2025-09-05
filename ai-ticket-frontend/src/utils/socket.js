import { io } from "socket.io-client";
import store from "../store/store.js";
import { addToChat } from "../store/chatSlice.js";
import { useSelector } from "react-redux";
let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // Attach message listener only once
    socket.on("recieve-message", ({message,senderId,ticketId}) => {
      const state=store.getState();
      if(state.chat.ticketId===ticketId)
      {  
         store.dispatch(addToChat({message,sender:senderId})); // Use store.dispatch instead of useDispatch
      }
    });
  }
  return socket;
};


export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};