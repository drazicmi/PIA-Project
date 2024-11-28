import express from "express";
import { DecoratorController } from "../controllers/decorator.controller";



const decoratorRouter = express.Router();

decoratorRouter.post("/grabAllAppointmentsForDecorator", (req, res) => new DecoratorController().grabAllAppointmentsForDecorator(req, res));
decoratorRouter.post("/confirmAppointment", (req, res) => new DecoratorController().confirmAppointment(req, res));
decoratorRouter.post("/rejectAppointment", (req, res) => new DecoratorController().rejectAppointment(req, res));
decoratorRouter.post("/grabAllMaintenenceForDecorator", (req, res) => new DecoratorController().grabAllMaintenenceForDecorator(req, res));
decoratorRouter.post("/confirmMaintenance", (req, res) => new DecoratorController().confirmMaintenance(req, res));

decoratorRouter.post("/getJobsPerMonth", (req, res) => new DecoratorController().getJobsPerMonth(req, res));
decoratorRouter.post("/getJobDistributionForFirm", (req, res) => new DecoratorController().getJobDistributionForFirm(req, res));
decoratorRouter.post("/getAverageJobsPerDay", (req, res) => new DecoratorController().getAverageJobsPerDay(req, res));


export default decoratorRouter;