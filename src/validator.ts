import { z } from 'zod'


export const userSchema = z.object({
    full_name: z.string(),
    email: z.string(),
    contact_phone: z.string(),
    address: z.string(),
    user_type: z.string()
})

export const vehicleSchema = z.object({
    rental_rate: z.number().multipleOf(0.01),
    vehicleSpec_id: z.number(),
    availability: z.boolean()
})

export const vehicleSpecSchema = z.object({
    
    manufacturer: z.string(),
    model: z.string(),
    year: z.string(),
    fuel_type: z.string(),
    engine_capacity: z.string(),
    transmission: z.string(),
    seating_capacity: z.string(), 
    color: z.string(),
    features: z.string(),
    imageUrl: z.string()
})

export const bookingSchema = z.object({
    user_id: z.number(),
    vehicle_id: z.number(),
    location_name: z.string(),
    booking_date: z.string(),
    return_date: z.string(),
    total_amount: z.number()
    
})

export const paymentsSchema = z.object({
    booking_id: z.number(),
    amount: z.number().multipleOf(0.01),
    payment_status: z.string(),
    payment_method: z.string(),
    transaction_id: z.string()
})
export const customerSupportTicketSchema = z.object({
    user_id: z.number(),
    subject: z.string(),
    description: z.string()
})

export const locationSchema = z.object({
    name: z.string(),
    address: z.string(),
    contact_phone: z.string()
})

export const fleetSchema = z.object({
    vehicle_id: z.number(),
    depreciation_rate: z.number(),
    current_value: z.number(),
    maintenance_cost: z.number(),
    status: z.string()
})

export const loginUserSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const registerUserSchema = z.object({
    full_name: z.string(),
    email: z.string(),
    contact_phone: z.string(),
    address: z.string(),
    password: z.string()
})