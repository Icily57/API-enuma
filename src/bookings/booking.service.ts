import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIBooking, TSBooking, BookingsTable } from "../drizzle/schema";

export const bookingService = async (limit?: number): Promise<TSBooking[] | null> => {
    if (limit) {
        return await db.query.BookingsTable.findMany({
            limit: limit
        }) as TSBooking[];
    }
    return await db.query.BookingsTable.findMany() as TSBooking[];
}

export const getBookingService = async (id: number): Promise<TIBooking | undefined> => {
    return await db.query.BookingsTable.findFirst({
        where: eq(BookingsTable.id, id)
    }) as TIBooking | undefined;
}

export const createBookingService = async (Booking: TIBooking): Promise<string> => {
    await db.insert(BookingsTable).values(Booking);
    return "Booking created successfully";
}

export const updateBookingService = async (id: number, Booking: TIBooking): Promise<string> => {
    await db.update(BookingsTable).set(Booking).where(eq(BookingsTable.id, id));
    return "Booking updated successfully";
}

export const deleteBookingService = async (id: number): Promise<string> => {
    await db.delete(BookingsTable).where(eq(BookingsTable.id, id));
    return "Booking deleted successfully";
}

export const getMoreBookingInfoService = async (): Promise<any[]> => {
    return await db.query.BookingsTable.findMany({
        columns: {
            
            vehicle_id: true,
            user_id: true,
            booking_date: true,
            booking_status: true
        },
        with: {
            locationBranch: {
                columns: {
                    id: true,
                    address: true,
                }
            },
            
            vehicle: {
                columns: {
                    id: true,
                    availability: true,
                    rental_rate: true,
                }
            },
        }
    }) as any[];
}

//get all bookings for one user using the id
export const getUserBookingsService = async (user_id: number)=> {
    return await db.query.BookingsTable.findMany({
        where: eq(BookingsTable.user_id, user_id),
        columns: {
            id: true,
            user_id: true,
            vehicle_id: true,
            booking_date: true,
            return_date: true,
            booking_status: true,
            total_amount: true
        },
       
    });
}

//approve booking using the id
export const approveBookingService = async (id: number): Promise<string> => {
    await db.update(BookingsTable).set({ booking_status: "Approved" }).where(eq(BookingsTable.id, id));
    return "Booking approved successfully";
}