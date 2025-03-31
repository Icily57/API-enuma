import {pgTable,pgEnum, serial, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm'

export const roleEnum = pgEnum("user_type", ['member', 'admin']);


export const UsersTable = pgTable("UsersTable", {
    id: serial('id').primaryKey(),
    full_name: varchar('full_name', {length: 100}).notNull(),
    email: varchar("email", {length: 100}).unique().notNull(),
    password: varchar('password', { length: 255}).notNull(),
    contact_phone: varchar('contact_phone', {length: 20}),
    address: varchar('address', {length: 255}),
    user_type: roleEnum("user_type").default('member'),
    role: varchar("role", { length: 255 }).notNull().default("user"), 
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(), 
})

export const VehiclesTable = pgTable("vehicles", {
    id: serial('id').primaryKey(),
    vehicleSpec_id: integer('vehicleSpec_id').notNull().references(() => VehicleSpecificationsTable.id, { onDelete: "cascade" }),
    rental_rate: decimal('rental_rate', { precision: 10, scale: 2 }).notNull(),
    availability: boolean('availability').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(), 
})

export const  VehicleSpecificationsTable = pgTable("vehicleSpec", {
    id: serial('id').primaryKey(),
    manufacturer: varchar("manufacturer", {length: 100}).notNull(),
    model: varchar('model', {length: 100}),
    year: varchar('year'),
    fuel_type: varchar('fuel_type', {length: 50}).default('user'),
    engine_capacity: varchar('engine_capacity', {length: 50}),
    transmission: varchar('transmission', {length: 50}), 
    seating_capacity: varchar('seating_capacity'), 
    color: varchar('color', {length: 50}), 
    features: text('features'),
    imageUrl: varchar('imageUrl'),
})

export const  BookingsTable = pgTable("booking", {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => UsersTable.id, { onDelete: "cascade" }),
    vehicle_id: integer('vehicle_id').notNull().references(() => VehiclesTable.id, { onDelete: "cascade" }),
    location_name: varchar('location_name').notNull(),
    booking_date: varchar('booking_date'),
    return_date: varchar('return_date'),
   total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    booking_status: varchar('booking_status', {length: 20}).default('pending'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(), 
})

export const  PaymentsTable = pgTable("payments", {
    id: serial('id').primaryKey(),
    booking_id: integer('booking_id').notNull().references(() => BookingsTable.id, { onDelete: "cascade" }),
    user_id: integer('user_id').notNull().references(() => UsersTable.id, { onDelete: "cascade" }),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    payment_status: varchar('payment_status', {length: 20}).default('pending'),
    payment_date: timestamp('payment_date').defaultNow(),
    payment_method: varchar('payment_method', {length: 50}),
    transaction_id: varchar('transaction_id', {length: 100}),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(), 
})
  
export const  CustomerSupportTicketsTable = pgTable("customerSupportTickets", {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => UsersTable.id, { onDelete: "cascade" }),
    subject: varchar('subject', { length: 255}).notNull(),
    description: text('description').notNull(),
    status: varchar('status', {length: 20}).default("open"),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(), 
})

export const  LocationBranchTable = pgTable("LocationBranch", {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100}).notNull(),
    address: varchar('address', { length: 255}).notNull(),
    contact_phone: varchar('contact_phone', { length: 20}).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(), 
})

export const  FleetTable = pgTable("fleet", {
    id: serial('id').primaryKey(),
    vehicle_id: integer('vehicle_id').notNull().references(() => VehiclesTable.id, { onDelete: "cascade" }),
    acquisition_date: timestamp('acquisition_date').defaultNow(),
    depreciation_rate:  decimal('depreciation_rate', { precision: 5, scale: 2 }),
    current_value:  decimal('current_value', { precision: 10, scale: 2 }),
    maintenance_cost: decimal('maintenance_cost',{ precision: 10, scale: 2 }),
    status: varchar('status', { length: 10}).default('active').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(), 
})

// export const CarCheckoutTable = pgTable("car_checkout", {
//     id: serial('id').primaryKey(),
//     user_id: integer('user_id').notNull().references(() => UsersTable.id, { onDelete: "cascade" }),
//     vehicle_id: integer('vehicle_id').notNull().references(() => VehiclesTable.id, { onDelete: "cascade" }),
//     checkout_date: timestamp('checkout_date').defaultNow().notNull(),
//     expected_return_date: timestamp('expected_return_date').notNull(),
//     created_at: timestamp('created_at').defaultNow(),
//     updated_at: timestamp('updated_at').defaultNow(),
// });

// export const CarCheckinTable = pgTable("car_checkin", {
//     id: serial('id').primaryKey(),
//     checkout_id: integer('checkout_id').notNull().references(() => CarCheckoutTable.id, { onDelete: "cascade" }),
//     checkin_date: timestamp('checkin_date').defaultNow().notNull(),
//     condition: varchar('condition', { length: 255 }).notNull(),
//     created_at: timestamp('created_at').defaultNow(),
//     updated_at: timestamp('updated_at').defaultNow(),
// });


// Relations
export const userRelations = relations(UsersTable, ({ one,many }) => ({
    // auth: one(AuthTable, {
    //     fields: [UsersTable.id],
    //     references: [AuthTable.user_id]
    // }),
    booking: many(BookingsTable),
    customerSupportTicket: many(CustomerSupportTicketsTable)
    
}))
// export const authRelations = relations(AuthTable, ({ many }) => ({
//     user: many(UsersTable)
// }))

export const vehiclesRelations = relations(VehiclesTable, ({ one,many }) => ({
    vehicleSpecs: one(VehicleSpecificationsTable, {
        fields: [VehiclesTable.vehicleSpec_id],
        references: [VehicleSpecificationsTable.id]
    }),
    fleet: one(FleetTable, {
        fields: [VehiclesTable.id],
        references: [FleetTable.vehicle_id]
    }),
    booking: many(BookingsTable)
}))

export const vehiclesSpecRelations = relations(VehicleSpecificationsTable, ({ one,many }) => ({
    vehicles: many(VehiclesTable)
}))

export const vehiclesSpecificationRelations = relations(VehicleSpecificationsTable, ({ one,many }) => ({
    vehicle: one(VehiclesTable,{
fields: [VehicleSpecificationsTable.id],
references: [VehiclesTable.id]
    })
}))

export const fleetRelations = relations(FleetTable, ({ many }) => ({
    vehicles: many(VehiclesTable)
}))

export const bookingRelations = relations(BookingsTable, ({ one,many }) => ({
    payment: one(PaymentsTable, {
        fields: [BookingsTable.id],
        references: [PaymentsTable.booking_id]
    }),
    user: many(UsersTable),
    vehicle: many(VehiclesTable),
    locationBranch: many(LocationBranchTable)
}))

export const paymentRelations = relations(LocationBranchTable, ({ many }) => ({
    booking: many(BookingsTable)
}))

export const customerSupportTicketRelations = relations(CustomerSupportTicketsTable, ({ many }) => ({
    user: many(UsersTable)
}))


// export const carCheckoutRelations = relations(CarCheckoutTable, ({ one, many }) => ({
//     user: one(UsersTable, {
//         fields: [CarCheckoutTable.user_id],
//         references: [UsersTable.id],
//     }),
//     vehicle: one(VehiclesTable, {
//         fields: [CarCheckoutTable.vehicle_id],
//         references: [VehiclesTable.id],
//     }),
//     checkin: one(CarCheckinTable, {
//         fields: [CarCheckinTable.checkout_id],
//         references: [CarCheckoutTable.id],
//     }),
// }));

// export const carCheckinRelations = relations(CarCheckinTable, ({ one }) => ({
//     checkout: one(CarCheckoutTable, {
//         fields: [CarCheckinTable.checkout_id],
//         references: [CarCheckoutTable.id],
//     }),
// }));

export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

// export type TIAuthOnUser = typeof AuthTable.$inferInsert;
// export type TSAuthOnUser = typeof AuthTable.$inferSelect;

export type TIVehicle = typeof VehiclesTable.$inferInsert;
export type TSVehicle = typeof VehiclesTable.$inferSelect;

export type TIVehicleSpec = typeof VehicleSpecificationsTable.$inferInsert;
export type TSVehicleSpec = typeof VehicleSpecificationsTable.$inferSelect;

export type TIBooking = typeof BookingsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;

export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;

export type TICustomerSupportTicket = typeof CustomerSupportTicketsTable.$inferInsert;
export type TSCustomerSupportTicket = typeof CustomerSupportTicketsTable.$inferSelect;

export type TILocationBranch = typeof LocationBranchTable.$inferInsert;
export type TSLocationBranch = typeof LocationBranchTable.$inferSelect;

export type TIFleet = typeof FleetTable.$inferInsert;
export type TSFleet = typeof FleetTable.$inferSelect;

