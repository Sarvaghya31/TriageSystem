import express from "express";

import {authenticate} from "../middlewares/auth.js"
import { createTicket, getTicket, getTickets,closeTicket,loadTicket,messageFeature } from "../controllers/ticket.js"
const router = express.Router();
router.get("/",authenticate,getTickets)
router.get("/:id",authenticate,getTicket)
router.post("/",authenticate,createTicket)
router.post("/closeTicket",authenticate,closeTicket)
router.post("/loadChat",authenticate,loadTicket)
router.post("/sendMessage",authenticate,messageFeature)

export default router;
