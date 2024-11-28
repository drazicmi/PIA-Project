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
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const fs_1 = __importDefault(require("fs"));
const requests_1 = __importDefault(require("../models/requests"));
const firms_1 = __importDefault(require("../models/firms"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appointment_1 = __importDefault(require("../models/appointment"));
class UserController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default
                .findOne({ username: username })
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (user && user.password) {
                        const match = yield bcryptjs_1.default.compare(password, user.password);
                        if (match) {
                            console;
                            res.json(user);
                        }
                        else {
                            res.json("");
                        }
                    }
                    else {
                        res.json("");
                    }
                }
                catch (err) {
                    console.log(err);
                    res.json("");
                }
            }))
                .catch((err) => console.log(err));
        });
        this.tryChangePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let password = req.body.password;
            let newPassword = req.body.newPassword;
            const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10); // 10 is the salt rounds
            user_1.default
                .findOneAndUpdate({ username: username }, { $set: { password: hashedNewPassword } })
                .then((user) => {
                if (user) {
                    res.json("");
                }
                else {
                    res.json("User with given credentials doesn't exist");
                }
            })
                .catch((err) => {
                console.log(err);
            });
        });
        this.getUserByUsername = (req, res) => {
            // Grab data
            let username = req.body.username;
            user_1.default
                .findOne({ username: username })
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
            });
        };
        this.grabUserByEmail = (req, res) => {
            // Grab data
            let email = req.body.email;
            user_1.default
                .findOne({ email: email })
                .then((data) => {
                if (data) {
                    res.json(data);
                }
                else {
                    requests_1.default.findOne({ "user.email": email }).then((data) => {
                        if (data) {
                            res.json(data);
                        }
                        else {
                            res.json("");
                        }
                    });
                }
            })
                .catch((err) => {
                console.log(err);
            });
        };
        this.registerUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            // Handle file upload and form data
            const formData = req.body;
            const hashedNewPassword = yield bcryptjs_1.default.hash(formData.password, 10); // 10 is the salt rounds
            if (file) {
                // Create a new user instance with profilePicture.filename if available
                let newUser = new user_1.default({
                    username: formData.username,
                    password: hashedNewPassword,
                    type: "owner",
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    gender: formData.gender,
                    isApproved: "pending",
                    address: formData.address,
                    contactPhone: parseInt(formData.phoneNumber),
                    email: formData.email,
                    creditCardNumber: parseInt(formData.creditCardNumber),
                    profilePicture: fs_1.default.readFileSync(file.path),
                    profilePictureType: file.mimetype,
                });
                // Create a new request instance
                const newRequest = new requests_1.default({
                    user: newUser,
                    approved: false,
                });
                // Save the request to MongoDB
                newRequest
                    .save()
                    .then(() => {
                    fs_1.default.unlinkSync(file.path);
                    res.json("Request for registration is created.");
                })
                    .catch((err) => {
                    console.error("Error creating request for registration:", err);
                    res.status(500).json("Error creating request for registration.");
                });
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            const formData = req.body;
            const hashedNewPassword = yield bcryptjs_1.default.hash(formData.password, 10); // 10 is the salt rounds
            // Build the updated data object
            let updatedData = {
                username: formData.username,
                password: hashedNewPassword, // Ensure you're hashing the password if necessary
                type: formData.type, // Modify this according to your logic
                firstname: formData.firstname,
                lastname: formData.lastname,
                gender: formData.gender,
                isApproved: 'true', // Modify based on your approval logic
                address: formData.address,
                contactPhone: parseInt(formData.phoneNumber),
                email: formData.email,
                creditCardNumber: parseInt(formData.creditCardNumber),
                firmName: formData.firmName
            };
            // If a file (profile picture) is uploaded, add it to the updatedData
            if (file) {
                updatedData.profilePicture = fs_1.default.readFileSync(file.path);
                updatedData.profilePictureType = file.mimetype;
            }
            // Update the user in the database and return the updated user info
            user_1.default
                .findOneAndUpdate({ username: formData.username }, { $set: updatedData }, { new: true })
                .then((updatedUser) => {
                // Optionally remove the uploaded file after saving it in the database
                if (file) {
                    fs_1.default.unlinkSync(file.path);
                }
                // Return the updated user information
                res.json(updatedUser);
            })
                .catch((err) => {
                res.json("");
            });
        });
        this.grabAllDecorators = (req, res) => {
            user_1.default
                .find({ type: "decorator", firmName: "" })
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
            });
        };
        this.addFirm = (req, res) => {
            // Grab data
            let name = req.body.name;
            let address = req.body.address;
            let services = req.body.services;
            let service_prices = req.body.service_prices;
            let longitude = req.body.longitude;
            let latitude = req.body.latitude;
            let decorator_list = req.body.decorator_list;
            let vacation_start = req.body.vacation_start;
            let vacation_end = req.body.vacation_end;
            let contactNumber = req.body.contactNumber;
            // Create a new instance of the Firms model
            const newFirm = new firms_1.default({
                name: name,
                address: address,
                services: services,
                service_prices: service_prices,
                longitude: longitude,
                latitude: latitude,
                decorator_list: decorator_list,
                vacation_start: new Date(vacation_start),
                vacation_end: new Date(vacation_end),
                contactNumber: contactNumber
            });
            let decorator_split_name = [];
            let decorator_split_username = [];
            decorator_list.forEach((decorator) => {
                let tmp_split = decorator.split("#");
                decorator_split_name.push(tmp_split[0]);
                decorator_split_username.push(tmp_split[1]);
            });
            newFirm.decorator_list = decorator_split_name;
            // Save the new firm to the database
            newFirm.save().then((data) => {
                user_1.default.updateMany({ username: { $in: decorator_split_username } }, { $set: { firmName: newFirm.name } })
                    .then(() => {
                    res.json("All decorators successfully updated");
                })
                    .catch((err) => {
                    console.error("Error updating decorators:", err);
                    res.status(500).json("Error updating decorators");
                });
            });
        };
        this.getAllFirms = (req, res) => {
            firms_1.default
                .find()
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
            });
        };
        this.registerDecorator = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            // Handle file upload and form data
            const formData = req.body;
            const hashedNewPassword = yield bcryptjs_1.default.hash(formData.password, 10); // 10 is the salt rounds
            if (file) {
                // Create a new user instance with profilePicture.filename if available
                let newUser = new user_1.default({
                    username: formData.username,
                    password: hashedNewPassword,
                    type: formData.type,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    gender: formData.gender,
                    isApproved: "approved",
                    address: formData.address,
                    contactPhone: parseInt(formData.phoneNumber),
                    email: formData.email,
                    creditCardNumber: parseInt(formData.creditCardNumber),
                    profilePicture: fs_1.default.readFileSync(file.path),
                    profilePictureType: file.mimetype,
                    firmName: formData.firmName,
                    busy: false
                });
                // Save the request to MongoDB
                newUser
                    .save()
                    .then(() => {
                    fs_1.default.unlinkSync(file.path);
                    res.json("Decorator created");
                })
                    .catch((err) => {
                    res.status(500).json("");
                });
            }
        });
        this.grabAllRequests = (req, res) => {
            requests_1.default
                .find({ approved: false })
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
            });
        };
        this.approveRequest = (req, res) => {
            const user_grabbed = req.body.user;
            const approved = req.body.approved;
            const newUser = new user_1.default({
                username: user_grabbed.username,
                password: user_grabbed.password, // Assuming the password is already hashed
                firstname: user_grabbed.firstname,
                lastname: user_grabbed.lastname,
                email: user_grabbed.email,
                type: user_grabbed.type,
                contactPhone: user_grabbed.contactPhone,
                gender: user_grabbed.gender,
                address: user_grabbed.address,
                creditCardNumber: user_grabbed.creditCardNumber,
                profilePicture: user_grabbed.profilePicture,
                profilePictureType: user_grabbed.profilePictureType,
                isApproved: user_grabbed.isApproved, // Set the approval status
            });
            newUser.save().then(() => {
                requests_1.default
                    .updateOne({ "user.username": user_grabbed.username }, { $set: { user: user_grabbed, approved: approved } })
                    .then(() => {
                    res.json("request approved");
                })
                    .catch((err) => {
                    console.log(err);
                });
            });
        };
        this.rejectRequest = (req, res) => {
            const user_grabbed = req.body.user;
            const approved = req.body.approved;
            requests_1.default
                .updateOne({ "user.username": user_grabbed.username }, { $set: { user: user_grabbed, approved: approved } })
                .then(() => {
                res.json("request denied");
            })
                .catch((err) => {
                console.log(err);
            });
        };
        this.grabOwnersCount = (req, res) => {
            user_1.default
                .find({ type: "owner" })
                .count()
                .then((data) => {
                if (data) {
                    res.json(data);
                }
            })
                .catch((err) => {
                console.log(err);
            });
        };
        this.grabDecoratorsCount = (req, res) => {
            user_1.default
                .find({ type: "decorator" })
                .count()
                .then((data) => {
                if (data) {
                    res.json(data);
                }
            })
                .catch((err) => {
                console.log(err);
            });
        };
        this.grabDecoratedGardensCount = (req, res) => {
            appointment_1.default.find().count().then(data => { if (data)
                res.json(data); }).catch(err => { console.log(err); res.json(0); });
        };
        this.grabSchedualedGardensCount1 = (req, res) => {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
            appointment_1.default
                .find({
                schedulingDate: { $gte: twentyFourHoursAgo }
            })
                .countDocuments()
                .then(data => {
                if (data)
                    res.json(data);
                else
                    res.json(0);
            })
                .catch(err => {
                console.log(err);
                res.json(0);
            });
        };
        this.grabSchedualedGardensCount7 = (req, res) => {
            // 7 days is 168h
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setHours(sevenDaysAgo.getHours() - 168);
            appointment_1.default
                .find({
                schedulingDate: { $gte: sevenDaysAgo }
            })
                .countDocuments()
                .then(data => {
                if (data)
                    res.json(data);
                else
                    res.json(0);
            })
                .catch(err => {
                console.log(err);
                res.json(0);
            });
        };
        this.grabSchedualedGardensCount30 = (req, res) => {
            // 7 days is 720h
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setHours(thirtyDaysAgo.getHours() - 720);
            appointment_1.default
                .find({
                schedulingDate: { $gte: thirtyDaysAgo }
            })
                .countDocuments()
                .then(data => {
                if (data)
                    res.json(data);
                else
                    res.json(0);
            })
                .catch(err => {
                console.log(err);
                res.json(0);
            });
        };
        this.grabAllDecoratorsAdminProfile = (req, res) => {
            user_1.default.find({ type: 'decorator' }).then((data) => {
                if (data)
                    res.json(data);
            }).catch((err) => {
                console.log(err);
                res.json("");
            });
        };
        this.grabAllOwnersAdminProfile = (req, res) => {
            user_1.default.find({ type: 'owner' }).then((data) => {
                if (data)
                    res.json(data);
            }).catch((err) => {
                console.log(err);
                res.json("");
            });
        };
        this.grabAllFirmsAdminProfile = (req, res) => {
            firms_1.default.find().then((data) => { if (data)
                res.json(data); }).catch((err) => { console.log(err); res.json(""); });
        };
        this.checkForFinishedAppointments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decoratorID = req.body.decoratorID;
                // Step 1: Fetch all confirmed appointments by the decorator
                const result = yield appointment_1.default.updateMany({
                    decorator_id: decoratorID,
                    decoratorDecision: 'confirmed',
                    date: { $lt: new Date() }
                }, {
                    $set: { decoratorDecision: 'maintenanceWaiting' }
                });
                res.json("");
            }
            catch (err) {
                console.error('Error updating finished appointments:', err);
                res.status(500).json({ success: false, message: 'Error updating appointments.' });
            }
        });
    }
}
exports.UserController = UserController;
