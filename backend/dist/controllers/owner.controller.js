"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerController = void 0;
const user_1 = __importDefault(require("../models/user"));
const appointment_1 = __importDefault(require("../models/appointment"));
const appointment_archive_1 = __importDefault(require("../models/appointment_archive"));
class OwnerController {
    constructor() {
        this.grabAvailableDecorators = (req, res) => {
            let firmName = req.body.firmName;
            user_1.default
                .find({ firmName: firmName, busy: false })
                .then((data) => {
                if (data) {
                    res.json(data);
                }
                else {
                    res.json("");
                }
            })
                .catch((err) => {
                console.log(err);
                res.json("");
            });
        };
        // Controller function to create an appointment
        this.createAppointment = (req, res) => {
            // Step 1: Extract the form data from the request
            const appointmentDetails = req.body;
            // Step 2: Parse any fields that were converted to strings in the FormData
            const servicesArray = JSON.parse(appointmentDetails.services);
            const firmObject = JSON.parse(appointmentDetails.firm);
            const ownerObject = JSON.parse(appointmentDetails.owner);
            const gardenObject = JSON.parse(appointmentDetails.gardenLayout);
            const firmFormatted = {
                _id: firmObject._id, // Correct ObjectId field
                name: firmObject.name
            };
            const ownerFormatted = {
                _id: ownerObject._id, // Correct ObjectId field
                name: ownerObject.firstname + ' ' + ownerObject.lastname
            };
            // Create a new instance of the Appointment model
            const newAppointment = new appointment_1.default({
                schedulingDate: new Date(appointmentDetails.schedulingDate) || new Date(),
                date: new Date(appointmentDetails.date),
                time: appointmentDetails.time,
                squareFootage: parseFloat(appointmentDetails.squareFootage),
                gardenType: appointmentDetails.gardenType,
                services: servicesArray, // The parsed services array
                additionalDescription: appointmentDetails.additionalDescription || '',
                firm: firmFormatted, // The corrected firm object
                totalSquareFootage: parseFloat(appointmentDetails.totalSquareFootage),
                poolSquareFootage: parseFloat(appointmentDetails.poolSquareFootage) || 0,
                greenerySquareFootage: parseFloat(appointmentDetails.greenerySquareFootage) || 0,
                sunbedsSquareFootage: parseFloat(appointmentDetails.sunbedsSquareFootage) || 0,
                fountainSquareFootage: parseFloat(appointmentDetails.fountainSquareFootage) || 0,
                tableCount: parseInt(appointmentDetails.tableCount, 10) || 0,
                chairCount: parseInt(appointmentDetails.chairCount, 10) || 0,
                owner: ownerFormatted,
                decoratorDecision: 'pending',
                gardenLayout: gardenObject.elements
            });
            // Step 4: Save the appointment to the database
            newAppointment
                .save()
                .then((savedAppointment) => {
                res.json("success");
            })
                .catch((err) => {
                res.json("");
            });
        };
        this.grabAllAppointments = (req, res) => {
            let owner = req.body.ownerUsername;
            user_1.default.findOne({ username: owner }).then((data) => {
                if (data) {
                    appointment_1.default.find({ 'owner._id': data._id }).then((data) => {
                        if (data) {
                            res.json(data);
                        }
                        else {
                            res.json("");
                        }
                    })
                        .catch((err) => {
                        console.log(err);
                        res.json("");
                    });
                }
                else {
                    res.json("");
                }
            }).catch((err) => {
                console.log(err);
                res.json("");
            });
        };
        this.grabAllAppointmentsForOwner = (req, res) => {
            let owner_id = req.body.owner_id;
            appointment_1.default.find({ 'owner._id': owner_id, date: { $lte: new Date() }, decoratorDecision: { $nin: ['maintenenceWaiting'] } }).then((data) => {
                if (data) {
                    res.json(data);
                }
            })
                .catch((err) => {
                console.log(err);
            });
        };
        this.grabAllMaintenenceForOwner = (req, res) => {
            let owner_id = req.body.owner_id;
            appointment_1.default.find({ 'owner._id': owner_id, decoratorDecision: 'maintenenceWaiting' }).then((data) => {
                if (data) {
                    res.json(data);
                }
            })
                .catch((err) => {
                console.log(err);
            });
        };
    }
    scheduleMaintenance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let appointmentDetails = req.body;
            const servicesArray = JSON.parse(appointmentDetails.services);
            const firmObject = JSON.parse(appointmentDetails.firm);
            const ownerObject = JSON.parse(appointmentDetails.owner);
            const gardenObject = JSON.parse(appointmentDetails.gardenLayout);
            const firmFormatted = {
                _id: firmObject._id,
                name: firmObject.name
            };
            const ownerFormatted = {
                _id: ownerObject._id,
                name: ownerObject.name
            };
            const newAppointmentArchive = new appointment_archive_1.default({
                schedulingDate: appointmentDetails.schedulingDate,
                date: appointmentDetails.date,
                time: appointmentDetails.time,
                squareFootage: parseFloat(appointmentDetails.squareFootage),
                gardenType: appointmentDetails.gardenType,
                services: servicesArray,
                additionalDescription: appointmentDetails.additionalDescription || '',
                firm: firmFormatted,
                totalSquareFootage: parseFloat(appointmentDetails.totalSquareFootage),
                poolSquareFootage: parseFloat(appointmentDetails.poolSquareFootage) || 0,
                greenerySquareFootage: parseFloat(appointmentDetails.greenerySquareFootage) || 0,
                sunbedsSquareFootage: parseFloat(appointmentDetails.sunbedsSquareFootage) || 0,
                fountainSquareFootage: parseFloat(appointmentDetails.fountainSquareFootage) || 0,
                tableCount: parseInt(appointmentDetails.tableCount, 10) || 0,
                chairCount: parseInt(appointmentDetails.chairCount, 10) || 0,
                owner: ownerFormatted,
                decoratorDecision: appointmentDetails.decoratorDecision,
                gardenLayout: gardenObject
            });
            try {
                const archiveResult = yield newAppointmentArchive.save();
                if (archiveResult) {
                    const updatedAppointment = yield appointment_1.default.findOneAndUpdate({ _id: appointmentDetails._id }, { $set: { date: 0, time: 0, decoratorDecision: 'maintenenceWaiting' } }, { new: true });
                    if (updatedAppointment) {
                        res.json("success");
                    }
                    else {
                        res.json("");
                    }
                }
            }
            catch (err) {
                console.log(err);
                res.json("");
            }
        });
    }
}
exports.OwnerController = OwnerController;
