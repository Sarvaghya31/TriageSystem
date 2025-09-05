
import { Server } from "socket.io";
import {createServer} from "http";
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import {serve} from "inngest/express"
import userRoutes from "./routes/user.js"
import ticketRoutes from "./routes/ticket.js"
import {inngest} from "./inngest/client.js"
import {onUserSignup} from "./inngest/functions/on-signup.js"
import {onTicketCreated} from "./inngest/functions/on-ticket-create.js"
import { onMessageSend } from "./inngest/functions/on-message-send.js";
import configureSocket from "./utils/socket.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true                
}));
app.use(express.json())
app.use(cookieParser())

const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST'],
        credentials:true
    }
});
configureSocket(io)

app.use("/api/auth",userRoutes)
app.use("/api/tickets",ticketRoutes)
app.use("/api/inngest",serve({
    client:inngest,
    functions:[onUserSignup,onTicketCreated,onMessageSend]
})); // configuring the inngest middlewares




app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const errorResponse = {
    statusCode,
    data: null,
    message: err.message || "Internal Server Error",
    success: false,
    errors: err.errors || [],
  }

  res.status(statusCode).json(errorResponse);
});

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB connected");
    server.listen(PORT,()=>
        console.log(`Server at http://localhost:${PORT}`)
    )
}).catch((err)=> console.error("MongoDB error: ",err))