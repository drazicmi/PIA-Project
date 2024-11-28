"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const decorator_controller_1 = require("../controllers/decorator.controller");
const decoratorRouter = express_1.default.Router();
decoratorRouter.post("/grabAllAppointmentsForDecorator", (req, res) => new decorator_controller_1.DecoratorController().grabAllAppointmentsForDecorator(req, res));
decoratorRouter.post("/confirmAppointment", (req, res) => new decorator_controller_1.DecoratorController().confirmAppointment(req, res));
decoratorRouter.post("/rejectAppointment", (req, res) => new decorator_controller_1.DecoratorController().rejectAppointment(req, res));
decoratorRouter.post("/grabAllMaintenenceForDecorator", (req, res) => new decorator_controller_1.DecoratorController().grabAllMaintenenceForDecorator(req, res));
decoratorRouter.post("/confirmMaintenance", (req, res) => new decorator_controller_1.DecoratorController().confirmMaintenance(req, res));
decoratorRouter.post("/getJobsPerMonth", (req, res) => new decorator_controller_1.DecoratorController().getJobsPerMonth(req, res));
decoratorRouter.post("/getJobDistributionForFirm", (req, res) => new decorator_controller_1.DecoratorController().getJobDistributionForFirm(req, res));
decoratorRouter.post("/getAverageJobsPerDay", (req, res) => new decorator_controller_1.DecoratorController().getAverageJobsPerDay(req, res));
exports.default = decoratorRouter;
