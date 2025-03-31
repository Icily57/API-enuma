import { Hono } from "hono";
import { listVehicleSpecifications, getVehicleSpecifications, createVehicleSpecifications, updateVehicleSpecifications, deleteVehicleSpecifications, } from "./vehicleSpec.controller"
import { zValidator } from "@hono/zod-validator";
import { vehicleSpecSchema } from "../validator";
import { adminRoleAuth } from "../Middleware/bearAuth";
export const vehicleSpecRouter = new Hono();

//get all vehicleSpec      api/vehicleSpec
vehicleSpecRouter.get("/vehicleSpecs", listVehicleSpecifications);
//get a single vehicleSpec    api/vehicleSpec/1
vehicleSpecRouter.get("/vehicleSpecs/:id", getVehicleSpecifications)
// create a vehicleSpec 
vehicleSpecRouter.post("/vehicleSpecs", createVehicleSpecifications)
//update a vehicleSpec
vehicleSpecRouter.put("/vehicleSpecs/:id", updateVehicleSpecifications)

vehicleSpecRouter.delete("/vehicleSpecs/:id",deleteVehicleSpecifications)
// vehicleSpecRouter.get("/vehicleSpecsInfo/:id", getMoreVehicleSpecificationsInfo)
