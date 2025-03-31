import { Context } from "hono";
import { bookingService, getBookingService, createBookingService, updateBookingService, deleteBookingService, getMoreBookingInfoService, getUserBookingsService, approveBookingService } from "./booking.service";
import { TIBooking, TSBooking } from "../drizzle/schema";

export const listBooking = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const data = await bookingService(limit);
        if (data == null || data.length == 0) {
            return c.text("Booking not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const getBookings = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const booking = await getBookingService(id);
    if (booking == undefined) {
        return c.text("Booking not found", 404);
    }
    return c.json(booking, 200);
}

export const createBooking = async (c: Context) => {
    try {
        const booking: TIBooking = await c.req.json();
        const createdBooking = await createBookingService(booking);
        if (!createdBooking) return c.text("Booking not created", 404);
        return c.json({ msg: createdBooking }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const updateBooking = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const booking: TIBooking = await c.req.json();
    try {
        const searchedBooking = await getBookingService(id);
        if (searchedBooking == undefined) return c.text("Booking not found", 404);
        const res = await updateBookingService(id, booking);
        if (!res) return c.text("Booking not updated", 404);
        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const deleteBooking = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const booking = await getBookingService(id);
        if (!booking) return c.text("Booking not found", 404);
        const res = await deleteBookingService(id);
        if (!res) return c.text("Booking not deleted", 404);
        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const getMoreBookingInfo = async (c: Context) => {
    const bookingsInfo = await getMoreBookingInfoService();
    if (!bookingsInfo) {
        return c.text("Bookings info not found", 404);
    }
    return c.json(bookingsInfo, 200);
}

export const getAllBookingsByUserId = async (c: Context) => {
   const user_id = parseInt(c.req.param("user_id"));
    try {
        if (isNaN(user_id)) return c.json({msg:"Invalid ID"}, 400);
        const booking = await getUserBookingsService(user_id);
        if (booking === null) {
            return c.json({msg:"Booking not found"}, 404);
        }
        return c.json(booking, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
        
    }
}


//Approve booking using the booking id
export const approveBooking = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const booking: TIBooking = await c.req.json();
    try {
        const searchedBooking = await approveBookingService(id);
        if (searchedBooking == undefined) return c.text("Booking not found", 404);
        const res = await updateBookingService(id, booking);
        if (!res) return c.text("Booking not updated", 404);
        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}