import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js"
import { NonRetriableError } from "inngest";
import Moderatorandenduser from "../../models/moderatorAndEndUser.js";
import User from "../../models/user.js";
import Message from "../../models/message.js";
import analyzeTicket from "../../utils/ai.js";
import { sendMail } from "../../utils/mailer.js";
export const onTicketCreated = inngest.createFunction(
    {id:"on-ticket-created",retries:2},
    {event:"ticket/created"},
    async({event,step})=>{
        try{
            const {ticketId}=event.data
            //fetch ticket from db

            const ticket=await step.run("fetch-ticket",async()=>{
            const ticketObject=await Ticket.findById(ticketId)
            if(!ticketObject){
                throw new NonRetriableError("Ticket not found");
            }
            return ticketObject
            })
            await step.run("update-ticket-status",async()=>{
                await Ticket.findByIdAndUpdate(ticket._id,{status:"TODO"})
            })
            const aiResponse=await analyzeTicket(ticket)

            const relatedSkills=await step.run("ai-processing",async()=>{
                let skills=[]
                if(aiResponse){
                    await Ticket.findByIdAndUpdate(ticket._id,{
                        priority:["low","medium","high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                        helpfulNotes:aiResponse.helpfulNotes,
                        status:"IN_PROGRESS",
                        relatedSkills:aiResponse.relatedSkills
                    })
                    skills=aiResponse.relatedSkills
                }
                return skills
            })

            const moderator = await step.run("assign-moderator",async()=>{
                let user=await Moderatorandenduser.findOne({role:"moderator",
                    skills:{
                        $elemMatch:{
                            $regex:relatedSkills.join("|"),
                            $options:"i"
                        }
                    }
                })
                if(!user)
                {
                    user=await User.findOne({
                        role:"admin"
                    })
                
                await Ticket.findByIdAndUpdate(ticket._id,{
                    assignedToAdmin:user?._id || null
                })
                }
                return user
            });

            await step.run("set-message",async()=>{
                const updatedTicket=await Ticket.findById(ticket._id);
                const message=await Message.create({
                    message:updatedTicket.description,
                    sender:updatedTicket.createdBy,
                    reciever:updatedTicket.assignedTo,
                    recieverAdmin:updatedTicket.assignedToAdmin,
                    ticketId:updatedTicket._id
                });
            });

            await step.run("send-email-notification",async()=>{
                if(moderator){
                    const finalTicket=await Ticket.findById(ticket._id)
                    await sendMail(
                        moderator.email,
                        "Ticket Assigned",
                        `A new ticket is assigned to you ${finalTicket.title}`
                    )
                }
            })
            return {success:true}

        }
        catch(err){
           console.error("Error running the step",err.message)
           return {success:false}
        }
    }
 )