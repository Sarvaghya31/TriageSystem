import { inngest } from "../client.js";
import Message from "../../models/message.js";
import { NonRetriableError } from "inngest";
export const onMessageSend=inngest.createFunction(
    {id:"on-message-send",retries:2},
    {event:"user/storemessage"},
    async({event,step})=>{
    try{
     const {senderid,recieverid,message,ticketid}=event.data
     const savedMessage=await step.run("save-in-db",async()=>{
        const save=await Message.create({message,sender:senderid,reciever:recieverid,ticketId:ticketid});
        if(!save){
            throw new NonRetriableError("User no longer exist in our database")
        }
        return save;
     })
     if(!savedMessage)
     {throw new NonRetriableError("User no longer exist in our database")}
     return savedMessage
    }
    catch(error){
    console.error("Error running step",error.message)
    return {success:false}
    }
    }
)