
import Ticket from "../models/ticket.js"
import User from "../models/user.js"
import {inngest} from "../inngest/client.js"
import Message from "../models/message.js"
import mongoose from "mongoose"

export const createTicket = async(req,res)=>{
    try{
        const {title,description}=req.body
        if(!title || !description)
        {
            return res.status(400).json({message:"Title and description are required"})
        }
        const newTicket=await Ticket.create({
            title,
            description,
            createdBy:req.user._id.toString(),
            isCompleted:false
        })
        await inngest.send({
            name:"ticket/created",
            data:{
                ticketId:(newTicket)._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        });

        
        return res.status(201).json({
            message:"Ticket created and processing started",
            ticket:newTicket
        })
    }
    catch(error){
        console.error("Error creating Ticket",error.message)
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const messageFeature=async(req,res)=>{
    try{
        const {message,senderid,recieverid,ticketid,recieveridAdmin}=req.body;
        await inngest.send({
            name:'user/storemessage',
            data:{
                message,
                senderid,
                recieverid,
                ticketid,
                recieveridAdmin
            }
        })
        res.status(201).json({success:true});
    }
    catch(error){
        console.error("Error fetching Tickets",error.message)
        return res.status(500).json({message:"Internal Server Error"});
}
}


export const getTickets = async(req,res) => {
    try{
        const user=req.user
        let tickets=[]
         if(user.role!=="user"){
            if(user.role==="admin")
           {tickets = await Ticket.find({}).populate("assignedTo",["email","_id"]).sort({createdAt:-1})}
            else{
                tickets= await Ticket.find({assignedTo:req.user._id,isCompleted:false})
            }
       } 
       else{
        tickets=await Ticket.find({createdBy:user._id}).sort({createdAt:-1})
       }
       return res.status(201).json({tickets}) 

    }
    catch(error){
        console.error("Error fetching Tickets",error.message)
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const getTicket=async(req,res) =>{
    try{
        const user = req.user;
        let ticket;
        if(user.role !== "user")
        {
            ticket=await Ticket.findById(req.params.id).populate("assignedTo",["email","_id"])
        }
        else{
            ticket=await Ticket.findOne({
                createdBy:user._id,
                _id:req.params.id
            })
        }

        if(!ticket)
        {
            return res.status(404).json({message:"Ticket not found"})
        }
        return res.status(200).json({ticket})
    }
    catch(error){
        console.error("Error fetching Ticket",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const closeTicket=async(req,res)=>{
    try{
        const user=req.user;
        if(user.role==="user")
        {
            return res.status(401).json({message:"Unauthorized Access"});
        }
        const {id}=req.body;
        const updatedTicket=Ticket.findByIdAndUpdate(id,{isCompleted:true})
        return res.status(200).json({success:true});
    }
    catch{
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const loadTicket=async(req,res)=>{
    try{
    const {ticketId}=req.body;
    //console.log(typeof(ticketId));
    const messages=await Message.find({ticketId:new mongoose.Types.ObjectId(ticketId)}).sort({createdAt:1});
    return res.status(200).json({messages})
    }
    catch{
        return res.status(500).json({message:"Internal Server Error"});
    }
}





