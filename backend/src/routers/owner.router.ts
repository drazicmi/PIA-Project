import express from "express";
import multer from 'multer';
import { OwnerController } from "../controllers/owner.controller";

const upload = multer();

const ownerRouter = express.Router();

ownerRouter.post("/grabDecoratorsCount", (req, res) => new OwnerController().grabAvailableDecorators(req, res));
ownerRouter.post("/createAppointment", upload.none(), (req, res) => new OwnerController().createAppointment(req, res));
ownerRouter.post("/grabAllAppointments", upload.none(), (req, res) => new OwnerController().grabAllAppointments(req, res));
ownerRouter.post("/grabAllAppointmentsForOwner", upload.none(), (req, res) => new OwnerController().grabAllAppointmentsForOwner(req, res));
ownerRouter.post("/scheduleMaintenance", upload.none(), (req, res) => new OwnerController().scheduleMaintenance(req, res));
ownerRouter.post("/grabAllMaintenenceForOwner", upload.none(), (req, res) => new OwnerController().grabAllMaintenenceForOwner(req, res));



export default ownerRouter;