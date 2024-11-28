"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const owner_controller_1 = require("../controllers/owner.controller");
const upload = (0, multer_1.default)();
const ownerRouter = express_1.default.Router();
ownerRouter.post("/grabDecoratorsCount", (req, res) => new owner_controller_1.OwnerController().grabAvailableDecorators(req, res));
ownerRouter.post("/createAppointment", upload.none(), (req, res) => new owner_controller_1.OwnerController().createAppointment(req, res));
ownerRouter.post("/grabAllAppointments", upload.none(), (req, res) => new owner_controller_1.OwnerController().grabAllAppointments(req, res));
ownerRouter.post("/grabAllAppointmentsForOwner", upload.none(), (req, res) => new owner_controller_1.OwnerController().grabAllAppointmentsForOwner(req, res));
ownerRouter.post("/scheduleMaintenance", upload.none(), (req, res) => new owner_controller_1.OwnerController().scheduleMaintenance(req, res));
ownerRouter.post("/grabAllMaintenenceForOwner", upload.none(), (req, res) => new owner_controller_1.OwnerController().grabAllMaintenenceForOwner(req, res));
exports.default = ownerRouter;
