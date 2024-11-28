"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const multer_1 = __importDefault(require("multer"));
const userRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Define Multer upload instance with destination
// Define routes using user controller methods
userRouter.post("/loginUser", (req, res) => new user_controllers_1.UserController().login(req, res));
userRouter.post("/tryChangePassword", (req, res) => new user_controllers_1.UserController().tryChangePassword(req, res));
userRouter.post("/getUserByUsername", (req, res) => new user_controllers_1.UserController().getUserByUsername(req, res));
userRouter.post("/grabUserByEmail", (req, res) => new user_controllers_1.UserController().grabUserByEmail(req, res));
userRouter.post("/registerUser", upload.single('profilePicture'), (req, res) => new user_controllers_1.UserController().registerUser(req, res));
userRouter.post("/updateUser", upload.single('profilePicture'), (req, res) => new user_controllers_1.UserController().updateUser(req, res));
userRouter.get("/grabAllDecorators", (req, res) => new user_controllers_1.UserController().grabAllDecorators(req, res));
userRouter.post("/addFirm", (req, res) => new user_controllers_1.UserController().addFirm(req, res));
userRouter.get("/getAllFirms", (req, res) => new user_controllers_1.UserController().getAllFirms(req, res));
userRouter.post("/registerDecorator", upload.single('profilePicture'), (req, res) => new user_controllers_1.UserController().registerDecorator(req, res));
userRouter.get("/grabAllRequests", (req, res) => new user_controllers_1.UserController().grabAllRequests(req, res));
userRouter.post("/approveRequest", (req, res) => new user_controllers_1.UserController().approveRequest(req, res));
userRouter.post("/rejectRequest", (req, res) => new user_controllers_1.UserController().rejectRequest(req, res));
userRouter.get("/grabOwnersCount", (req, res) => new user_controllers_1.UserController().grabOwnersCount(req, res));
userRouter.get("/grabDecoratorsCount", (req, res) => new user_controllers_1.UserController().grabDecoratorsCount(req, res));
userRouter.get("/grabSchedualedGardensCount1", (req, res) => new user_controllers_1.UserController().grabSchedualedGardensCount1(req, res));
userRouter.get("/grabSchedualedGardensCount7", (req, res) => new user_controllers_1.UserController().grabSchedualedGardensCount7(req, res));
userRouter.get("/grabSchedualedGardensCount30", (req, res) => new user_controllers_1.UserController().grabSchedualedGardensCount30(req, res));
userRouter.get("/grabDecoratedGardensCount", (req, res) => new user_controllers_1.UserController().grabDecoratedGardensCount(req, res));
userRouter.get("/grabAllDecoratorsAdminProfile", (req, res) => new user_controllers_1.UserController().grabAllDecoratorsAdminProfile(req, res));
userRouter.get("/grabAllOwnersAdminProfile", (req, res) => new user_controllers_1.UserController().grabAllOwnersAdminProfile(req, res));
userRouter.get("/grabAllFirmsAdminProfile", (req, res) => new user_controllers_1.UserController().grabAllFirmsAdminProfile(req, res));
userRouter.post("/checkForFinishedAppointments", (req, res) => new user_controllers_1.UserController().checkForFinishedAppointments(req, res));
exports.default = userRouter;
