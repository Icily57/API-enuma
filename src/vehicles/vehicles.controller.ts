import { Context } from "hono";
import { vehicleService, getVehicleService, createVehicleService, updateVehicleService, deleteVehicleService, getMoreVehicleInfoService, getVehicleInfoService, } from "./vehicles.service";

export const listVehicles = async (c: Context) => {
    try {
        const vehicle = await vehicleService();
        if (!vehicle) {
            return c.json({msg:"Vehicle not found"}, 404)
        }
        return c.json(vehicle, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getVehicle = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const Vehicle = await getVehicleService(id);
    if (Vehicle == undefined) {
        return c.text("Vehicle not found", 404);
    }
    return c.json(Vehicle, 200);
}
export const createVehicle = async (c: Context) => {
    try {
        const Vehicle = await c.req.json();
        const createdVehicle = await createVehicleService(Vehicle);


        if (!createdVehicle) return c.text("Vehicle not created", 404);
        return c.json({ msg: createdVehicle }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateVehicle = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const Vehicle = await c.req.json();
    try {
        // search for the Vehicle
        const searchedVehicle = await getVehicleService(id);
        if (searchedVehicle == undefined) return c.text("Vehicle not found", 404);
        // get the data and update it
        const res = await updateVehicleService(id, Vehicle);
        // return a success message
        if (!res) return c.text("Vehicle not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deleteVehicle = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the Vehicle
        const Vehicle = await getVehicleService(id);
        if (Vehicle == undefined) return c.text("Vehicle not found", 404);
        //deleting the Vehicle
        const res = await deleteVehicleService(id);
        if (!res) return c.text("Vehicle not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

// export const filterVehicleInfo = async(c:Context) => {
//     const id = parseInt(c.req.param("id"));
//     if (isNaN(id)) return c.text("Invalid ID", 400);

//     const VehicleInfo = await filterVehicleService(id);
//     if (VehicleInfo == undefined) {
//         return c.text("Order not found", 404);
//     }
//     return c.json(VehicleInfo, 200);
// }

//get all vehicles with thier specs
export const getMoreVehicleInfo = async(c:Context) => {
    const VehicleInfo = await getMoreVehicleInfoService();
    if (VehicleInfo == undefined) {
        return c.text("Specs not found", 404);
    }
    return c.json(VehicleInfo, 200);
}

//get one vehicle with its specs as an object
export const getVehicleInfo = async(c:Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const VehicleInfo = await getVehicleInfoService(id);
    if (VehicleInfo == undefined) {
        return c.text("Specs not found", 404);
    }
    return c.json(VehicleInfo, 200);
}