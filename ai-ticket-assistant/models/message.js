import mongoose, { Mongoose } from 'mongoose'
import jwt from 'jsonwebtoken'
const messageSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'ModeratorAndEnduser'
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ModeratorAndEndUser'
    },
    recieverAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isSeen:{
        type:Boolean,
        default:false
    },
    ticketId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Ticket'
    },
    createdAt:{type:Date,default:Date.now}
})

export default mongoose.model('Message',messageSchema)