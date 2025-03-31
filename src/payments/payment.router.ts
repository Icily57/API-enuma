import { Hono } from "hono";
import { listPayment, getPayment, createPayment, updatePayment, deletePayment, getMorePaymentInfo, checkoutPayment, getPaymentsByUserId} from "./payment.controller"
import { zValidator } from "@hono/zod-validator";
import { paymentsSchema } from "../validator";
import { adminRoleAuth,bothRoleAuth } from '../Middleware/bearAuth'
export const paymentRouter = new Hono();

//get all payment      api/payment
paymentRouter.get("/payment", listPayment);
//get a single Payment    api/payment/1
paymentRouter.get("/payment/:id", getPayment)
// create a Payment 
paymentRouter.post("/payment", createPayment)
//update a Payment
paymentRouter.put("/payment/:id", updatePayment)

paymentRouter.delete("/payment/:id",deletePayment)
// PaymentRouter.get("/activepayments",userOrAdminRoleAuth, listActivepayments)
paymentRouter.get("/PaymentInfo", getMorePaymentInfo)

//checkoutpayment
paymentRouter.post("/checkout-session",checkoutPayment)

//get payments by user id
paymentRouter.get("/payment-by-id/:user_id", getPaymentsByUserId)