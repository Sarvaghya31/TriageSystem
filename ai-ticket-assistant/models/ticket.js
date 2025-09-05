import mongoose from "mongoose";
const ticketSchema = new mongoose.Schema({
    title:String,
    description:String,
    status:{type:String,default:"TODO"},
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ModeratorAndEndUser",
        default:null
    },
    assignedToAdmin:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       default:null
    },
    isCompleted:{
        type:Boolean,
        required:true
    },
    priority:String,
    deadLine:Date,
    helpfulNotes:String,
    relatedSkills:[String],
    createdAt:{type:Date,default:Date.now}

})

export default mongoose.model("Ticket",ticketSchema)