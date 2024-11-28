import express from "express";
import { UserController } from "../controllers/user.controllers";
import multer from "multer";



const userRouter = express.Router();
const upload = multer({ dest: 'uploads/' }); // Define Multer upload instance with destination

// Define routes using user controller methods
userRouter.post("/loginUser", (req, res) => new UserController().login(req, res));
userRouter.post("/tryChangePassword", (req, res) => new UserController().tryChangePassword(req, res));
userRouter.post("/getUserByUsername", (req, res) => new UserController().getUserByUsername(req, res));
userRouter.post("/grabUserByEmail", (req, res) => new UserController().grabUserByEmail(req, res));
userRouter.post("/registerUser", upload.single('profilePicture'), (req, res) => new UserController().registerUser(req, res));
userRouter.post("/updateUser", upload.single('profilePicture'), (req, res) => new UserController().updateUser(req, res));
userRouter.get("/grabAllDecorators", (req, res) => new UserController().grabAllDecorators(req, res));
userRouter.post("/addFirm", (req, res) => new UserController().addFirm(req, res));
userRouter.get("/getAllFirms", (req, res) => new UserController().getAllFirms(req, res));
userRouter.post("/registerDecorator", upload.single('profilePicture'), (req, res) => new UserController().registerDecorator(req, res));
userRouter.get("/grabAllRequests", (req, res) => new UserController().grabAllRequests(req, res));
userRouter.post("/approveRequest", (req, res) => new UserController().approveRequest(req, res));
userRouter.post("/rejectRequest", (req, res) => new UserController().rejectRequest(req, res));
userRouter.get("/grabOwnersCount", (req, res) => new UserController().grabOwnersCount(req, res));
userRouter.get("/grabDecoratorsCount", (req, res) => new UserController().grabDecoratorsCount(req, res));
userRouter.get("/grabSchedualedGardensCount1", (req, res) => new UserController().grabSchedualedGardensCount1(req, res));
userRouter.get("/grabSchedualedGardensCount7", (req, res) => new UserController().grabSchedualedGardensCount7(req, res));
userRouter.get("/grabSchedualedGardensCount30", (req, res) => new UserController().grabSchedualedGardensCount30(req, res));
userRouter.get("/grabDecoratedGardensCount", (req, res) => new UserController().grabDecoratedGardensCount(req, res));

userRouter.get("/grabAllDecoratorsAdminProfile", (req, res) => new UserController().grabAllDecoratorsAdminProfile(req, res));
userRouter.get("/grabAllOwnersAdminProfile", (req, res) => new UserController().grabAllOwnersAdminProfile(req, res));
userRouter.get("/grabAllFirmsAdminProfile", (req, res) => new UserController().grabAllFirmsAdminProfile(req, res));

userRouter.post("/checkForFinishedAppointments", (req, res) => new UserController().checkForFinishedAppointments(req, res));




export default userRouter;