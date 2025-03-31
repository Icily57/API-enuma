import { Hono } from "hono";
import { listCustomerSupportTicket, getCustomerSupportTicket , createCustomerSupportTicket , updateCustomerSupportTicket , deleteCustomerSupportTicket , getMoreCustomerSupportTicketInfo, getUserTicketsByUserId } from "./customerSupportTickets.controller"
import { zValidator } from "@hono/zod-validator";
import { customerSupportTicketSchema } from "../validator";
import { adminRoleAuth } from '../Middleware/bearAuth'
export const customerSupportTicketRouter = new Hono();

//get all CustomerSupportTicket       api/CustomerSupportTicket 
customerSupportTicketRouter.get("/customerSupportTickets", listCustomerSupportTicket);
//get a single CustomerSupportTicket     api/CustomerSupportTicket /1
customerSupportTicketRouter.get("/customerSupportTickets/:id", getCustomerSupportTicket )
// create a CustomerSupportTicket  
customerSupportTicketRouter.post("/customerSupportTickets", createCustomerSupportTicket )
//update a CustomerSupportTicket 
customerSupportTicketRouter.put("/customerSupportTickets/:id",updateCustomerSupportTicket )

customerSupportTicketRouter.delete("/customerSupportTickets/:id", deleteCustomerSupportTicket )
customerSupportTicketRouter.get("/customerSupportTicketsInfo/:id", getMoreCustomerSupportTicketInfo)
// get all tickets for one user using id
customerSupportTicketRouter.get("/tickets-by-user/:id", getUserTicketsByUserId)

