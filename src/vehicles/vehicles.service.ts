import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIVehicle, TSVehicle, VehiclesTable } from "../drizzle/schema";

export const vehicleService = async (limit?: number): Promise<TSVehicle[] | null> => {
     return await db.query.VehiclesTable.findMany();
}

export const getVehicleService = async (id: number): Promise<TIVehicle | undefined> => {
    return await db.query.VehiclesTable.findFirst({
        where: eq(VehiclesTable.id, id)
    })
}

export const createVehicleService = async (Vehicle: TIVehicle) => {
    await db.insert(VehiclesTable).values(Vehicle)
    return "Vehicle created successfully";
}

export const updateVehicleService = async (id: number, Vehicle: TIVehicle) => {
    await db.update(VehiclesTable).set(Vehicle).where(eq(VehiclesTable.id, id))
    return "Vehicle updated successfully";
}

export const deleteVehicleService = async (id: number) => {
    await db.delete(VehiclesTable).where(eq(VehiclesTable.id, id))
    return "Vehicle deleted successfully";
}


// export const filterVehicleService = async (id: number) => {
//     return await db.select({
//         VehicleName: VehiclesTable.name,
//         MenuItem: MenuItemsTable.description
//     }).from(VehiclesTable).rightJoin(MenuItemsTable, eq(VehiclesTable.id, MenuItemsTable.Vehicle_id))
// }

//get all vehicles with thier specs
export const getMoreVehicleInfoService = async () => {
    return await db.query.VehiclesTable.findMany({
        with: {
            vehicleSpecs: {
                columns: {
                    id: true,
                    manufacturer: true,
                    model: true,
                    year: true,
                    color: true,
                    imageUrl: true,                    
                    fuel_type: true,
                    transmission: true,
                    engine_capacity: true,
                    seating_capacity: true,
                    features: true,
                }
            }
        }
    })
}

//get one vehicle with its specs and return as an object
export const getVehicleInfoService = async (id: number) => {
    return await db.query.VehiclesTable.findFirst({
        where: eq(VehiclesTable.id, id),
        with: {
            vehicleSpecs: {
                columns: {
                    id: true,
                    manufacturer: true,
                    model: true,
                    year: true,
                    color: true,
                    fuel_type: true,
                    imageUrl: true,
                    transmission: true,
                    engine_capacity: true,
                    seating_capacity: true,
                    features: true,
                }
            }
        }
    })
}