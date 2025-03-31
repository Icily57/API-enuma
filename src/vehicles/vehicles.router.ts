import { Hono } from "hono";
import { listVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, getMoreVehicleInfo, getVehicleInfo } from "./vehicles.controller"
import { zValidator } from "@hono/zod-validator";
import { vehicleSchema } from "../validator";
import { adminRoleAuth,bothRoleAuth,userRoleAuth } from "../Middleware/bearAuth";
export const vehicleRouter = new Hono();

//get all vehicles      api/vehicles
vehicleRouter.get("/vehicle", listVehicles);
//get a single vehicle    api/vehicles/1
vehicleRouter.get("/vehicle/:id", getVehicle)
// create a vehicle 
vehicleRouter.post("/vehicle", createVehicle)
//update a vehicle
vehicleRouter.put("/vehicle/:id",updateVehicle)

vehicleRouter.delete("/vehicle/:id",deleteVehicle)
// vehicleRouter.get("/vehicleInfo/:id", filterVehicleInfo)

//get all vehicles with thier specs
vehicleRouter.get("/vehicleswithdetails", getMoreVehicleInfo)

//get one vehicle with its specs
vehicleRouter.get("/vehicle-with-specs/:id", getVehicleInfo)
