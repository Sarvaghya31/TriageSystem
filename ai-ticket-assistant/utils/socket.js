import cookie from "cookie";
import jwt from "jsonwebtoken"
import {inngest} from "../inngest/client.js"
const userSocketMap = {}; // Private map

export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

export default function configureSocket(io) {
  io.use((socket,next)=>{
    const cookies=cookie.parse(socket.handshake.headers.cookie || "");
    const token=cookies.accessToken;
    if(!token){
      return next(new Error("No Token"))
    }
    try{
      const user= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      socket.user=user
      next();
    }
    catch(err){
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.user._id;
    if (userId) userSocketMap[userId] = socket.id;

    

    socket.on("message", ({ recieverid, message,ticketId}) => {
      const receiverSocketId = userSocketMap[recieverid];
      const senderid=socket.id;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("recieve-message",{message,senderId:socket.user._id,ticketId});
      }
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      delete userSocketMap[userId];
    });
  });
}

