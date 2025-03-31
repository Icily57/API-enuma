import { Context } from "hono";
import { paymentService, getPaymentService, createPaymentService, updatePaymentService, deletePaymentService, getMorePaymentInfoService, UpdateCheckoutPaymentService, getPaymentsByUserIdService } from "./payment.service";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
import {CLIENT_URL} from "../utils";

const  stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {apiVersion: '2024-06-20'});

export const listPayment = async (c: Context) => {
    try {
     
        const data = await paymentService();
        if (data == null ) {
            return c.json({msg:"No payments found"}, 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getPayment = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const payment = await getPaymentService(id);
    if (payment == undefined) {
        return c.text("payment not found", 404);
    }
    return c.json(payment, 200);
}
export const createPayment = async (c: Context) => {
    try {
        const payment = await c.req.json();
        const createdpayment = await createPaymentService(payment);


        if (!createdpayment) return c.text("payment not created", 404);
        return c.json({ msg: createdpayment }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updatePayment = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const payment = await c.req.json();
    try {
        // search for the payment
        const searchedpayment = await getPaymentService(id);
        if (searchedpayment == undefined) return c.text("payment not found", 404);
        // get the data and update it
        const res = await updatePaymentService(id, payment);
        // return a success message
        if (!res) return c.text("payment not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deletePayment = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the payment
        const payment = await getPaymentService(id);
        if (payment == undefined) return c.text("payment not found", 404);
        //deleting the payment
        const res = await deletePaymentService(id);
        if (!res) return c.text("payment not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

//get payments by user id
export const getPaymentsByUserId = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    const payments = await getPaymentsByUserIdService(user_id);
    if (payments == null) {
        return c.text("payment not found", 404);
    }
    return c.json(payments, 200);
}

export const getMorePaymentInfo = async(c:Context) => {
    const paymentInfo = await getMorePaymentInfoService();
    if (paymentInfo == undefined) {
        return c.text("paymentInfo not found", 404);
    }
    return c.json(paymentInfo, 200);
}

export const checkoutPayment = async(c:Context) => {
    let booking;
    try{
        booking = await c.req.json();
    }catch(error){
        return c.json("Invalid request body", 400)
    }
    try {
        if(!booking.id || !booking.total_amount){
            return c.json("Missing ID or Total Amount", 400)
        }

        const convervionRate = 0.007;
        const totalAmountInUSD = booking.total_amount * convervionRate;
        const line_items : Stripe.Checkout.SessionCreateParams.LineItem[]= [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Booking ID: ${booking.id}`,
                    },
                    unit_amount: Math.round(totalAmountInUSD * 100),
                },
                quantity: 1,
            }];
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: `${CLIENT_URL}/dashboard`,
                cancel_url: `${CLIENT_URL}/dashboard`,
            });

            const paymentDetails = {
                booking_id: booking.id,
                user_id: booking.user_id,
                amount: totalAmountInUSD,
                payment_method: 'card',
                transaction_id: session.id,
            }
            const createdPayment = await createPaymentService({
              ...paymentDetails,
              amount: totalAmountInUSD.toString(),
            });

            return c.json({id: session.id , createdPayment}, 200);
        
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)   
        
    }   
}

export const handleStripeWebhook = async (c: Context) => {
        const sig = c.req.header('stripe-signature')
        const rawBody = await c.req.text();
        if (!sig) return c.text('No stripe signature', 400);

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
        } catch (error) {
            return c.text('Invalid stripe signature', 400);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                //update payment status
                try {
                  const session_id = session.id;
                  const res = await UpdateCheckoutPaymentService(session_id);  
                  return c.json({ res }, 201);
                } catch (error) {
                    return c.json({ error: error }, 400)
                }

                default:
                    return c.json({ 'status': 'not_handled' }, 200);
            }
}
export default handleStripeWebhook