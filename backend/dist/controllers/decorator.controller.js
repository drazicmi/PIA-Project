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
exports.DecoratorController = void 0;
const user_1 = __importDefault(require("../models/user"));
const firms_1 = __importDefault(require("../models/firms"));
const appointment_1 = __importDefault(require("../models/appointment"));
const appointment_archive_1 = __importDefault(require("../models/appointment_archive"));
const mongoose_1 = __importDefault(require("mongoose"));
class DecoratorController {
    constructor() {
        this.grabAllAppointmentsForDecorator = (req, res) => {
            let firm = req.body.firmName;
            firms_1.default.findOne({ name: firm }).then((data) => {
                if (data) {
                    appointment_1.default.find({ 'firm._id': data._id, decoratorDecision: 'pending' }).then((data) => {
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
        this.confirmAppointment = (req, res) => {
            let appointment_id = req.body.appointment_id;
            let decorator_id = req.body.decorator_id;
            appointment_1.default.updateOne({ _id: appointment_id }, { $set: { decorator_id: decorator_id, decoratorDecision: 'confirmed' } })
                .then((data) => {
                res.json(data);
            })
                .catch((err) => {
                console.log(err);
                res.json("");
            });
        };
        this.rejectAppointment = (req, res) => {
            let appointment_id = req.body.appointment_id;
            let rejectionComment = req.body.rejectionComment;
            appointment_1.default.updateOne({ _id: appointment_id }, { $set: { rejectionComment: rejectionComment, decoratorDecision: 'denied' } })
                .then((data) => {
                res.json(data);
            })
                .catch((err) => {
                console.log(err);
                res.json("");
            });
        };
        this.grabAllMaintenenceForDecorator = (req, res) => {
            let firm = req.body.firmName;
            firms_1.default.findOne({ name: firm }).then((data) => {
                if (data) {
                    appointment_1.default.find({ 'firm._id': data._id, decoratorDecision: 'maintenenceWaiting' }).then((data) => {
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
        this.confirmMaintenance = (req, res) => {
            let appointmentId = req.body.appointmentId;
            let date = req.body.date;
            let time = req.body.time;
            appointment_1.default.findByIdAndUpdate(appointmentId, { $set: { date: date, time: time, decoratorDecision: 'confirmed' } }).then((data) => {
                if (data) {
                    res.json("success");
                }
            }).catch(err => { console.log(err); res.json(""); });
        };
        this.getJobsPerMonth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const decoratorID = req.body.decoratorID;
            try {
                const appointmentsQuery = appointment_1.default.aggregate([
                    { $match: { decorator_id: new mongoose_1.default.Types.ObjectId(decoratorID) } },
                    {
                        $group: {
                            _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                            jobCount: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ]);
                const appointmentsArchiveQuery = appointment_archive_1.default.aggregate([
                    { $match: { decorator_id: new mongoose_1.default.Types.ObjectId(decoratorID) } },
                    {
                        $group: {
                            _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                            jobCount: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ]);
                // Execute both queries in parallel
                const [appointmentsData, appointmentsArchiveData] = yield Promise.all([
                    appointmentsQuery,
                    appointmentsArchiveQuery
                ]);
                // Merge the results
                const combinedData = [...appointmentsData, ...appointmentsArchiveData];
                // Group the results by year and month and aggregate job counts
                const groupedData = combinedData.reduce((acc, current) => {
                    const key = `${current._id.year}-${current._id.month}`;
                    if (!acc[key]) {
                        acc[key] = Object.assign(Object.assign({}, current._id), { jobCount: current.jobCount });
                    }
                    else {
                        acc[key].jobCount += current.jobCount;
                    }
                    return acc;
                }, {});
                // Convert the grouped data to an array
                const result = Object.values(groupedData);
                // Transform result into months and jobCount arrays
                const months = result.map((item) => `${item.month}-${item.year}`);
                const jobsCount = result.map((item) => item.jobCount);
                // Send the transformed data
                res.json({ months, jobsCount });
            }
            catch (err) {
                console.error(err);
                res.json();
            }
        });
        this.getJobDistributionForFirm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const firmName = req.body.firmName;
            try {
                // Step 1: Fetch the decorators for the firm (assuming 'User' model contains decorators with `firstname` and `lastname`)
                const decorators = yield user_1.default.find({ firmName }, '_id firstname lastname');
                if (!decorators.length) {
                    return res.json({ decoratorNames: [], jobCounts: [] });
                }
                // Step 2: Create a map of fullName to decorator ID
                const decoratorMap = decorators.reduce((acc, decorator) => {
                    const fullName = `${decorator.firstname || 'Unknown'} ${decorator.lastname || 'Unknown'}`;
                    acc[fullName] = decorator._id;
                    return acc;
                }, {});
                // Step 3: Extract decorator names and IDs
                const decoratorNames = Object.keys(decoratorMap); // List of decorator names
                const decoratorIDs = Object.values(decoratorMap); // List of decorator IDs
                // Step 4: Query appointments and appointments_archive for job counts per decorator
                const appointmentsQuery = appointment_1.default.aggregate([
                    { $match: { decorator_id: { $in: decoratorIDs } } }, // Match by decorator IDs
                    { $group: { _id: "$decorator_id", jobCount: { $sum: 1 } } }
                ]);
                const appointmentsArchiveQuery = appointment_archive_1.default.aggregate([
                    { $match: { decorator_id: { $in: decoratorIDs } } }, // Match by decorator IDs
                    { $group: { _id: "$decorator_id", jobCount: { $sum: 1 } } }
                ]);
                // Step 5: Execute both queries in parallel
                const [appointmentsData, appointmentsArchiveData] = yield Promise.all([appointmentsQuery, appointmentsArchiveQuery]);
                // Step 6: Combine data from both collections
                const combinedData = [...appointmentsData, ...appointmentsArchiveData];
                // Step 7: Group by decorator ID and sum job counts
                const jobCountsMap = combinedData.reduce((acc, current) => {
                    const decoratorID = current._id.toString(); // Convert ObjectId to string
                    acc[decoratorID] = (acc[decoratorID] || 0) + current.jobCount; // Sum job counts
                    return acc;
                }, {});
                // Step 8: Map job counts to decorator names
                const jobCounts = decoratorNames.map(name => { var _a; return jobCountsMap[(_a = decoratorMap[name]) === null || _a === void 0 ? void 0 : _a.toString()] || 0; });
                // Step 9: Send the result to the client
                res.json({ decoratorNames, jobCounts });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
        this.getAverageJobsPerDay = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const decoratorID = req.body.decoratorID;
            try {
                // Group by day of the week and count the jobs
                const appointmentsQuery = appointment_1.default.aggregate([
                    { $match: { decorator_id: new mongoose_1.default.Types.ObjectId(decoratorID) } },
                    {
                        $group: {
                            _id: { dayOfWeek: { $dayOfWeek: "$date" } }, // Group by day of the week
                            jobCount: { $sum: 1 }
                        }
                    }
                ]);
                const appointmentsArchiveQuery = appointment_archive_1.default.aggregate([
                    { $match: { decorator_id: new mongoose_1.default.Types.ObjectId(decoratorID) } },
                    {
                        $group: {
                            _id: { dayOfWeek: { $dayOfWeek: "$date" } }, // Group by day of the week
                            jobCount: { $sum: 1 }
                        }
                    }
                ]);
                // Execute both queries in parallel
                const [appointmentsData, appointmentsArchiveData] = yield Promise.all([
                    appointmentsQuery,
                    appointmentsArchiveQuery
                ]);
                // Combine the results
                const combinedData = [...appointmentsData, ...appointmentsArchiveData];
                // Group the data by day of the week and calculate the total job counts
                const groupedData = combinedData.reduce((acc, current) => {
                    const dayOfWeek = current._id.dayOfWeek;
                    if (!acc[dayOfWeek]) {
                        acc[dayOfWeek] = { dayOfWeek, jobCount: current.jobCount };
                    }
                    else {
                        acc[dayOfWeek].jobCount += current.jobCount;
                    }
                    return acc;
                }, {});
                // Calculate the average jobs per day of the week over 24 months
                const averageData = Object.values(groupedData).map((day) => ({
                    dayOfWeek: day.dayOfWeek,
                    averageJobCount: day.jobCount / 24 // Divide the total job count by 24 months
                }));
                res.json(averageData);
            }
            catch (err) {
                console.error(err);
                res.json([]);
            }
        });
    }
}
exports.DecoratorController = DecoratorController;
