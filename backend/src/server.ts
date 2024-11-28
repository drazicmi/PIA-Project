import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";
import ownerRouter from "./routers/owner.router";
import decoratorRouter from "./routers/decorator.router";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/pia_project_august");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

const router = express.Router();
router.use("/users", userRouter);
router.use("/owner", ownerRouter);
router.use("/decorator", decoratorRouter);

app.use("/", router);

app.listen(4000, () => console.log(`Express server running on port 4000`));
