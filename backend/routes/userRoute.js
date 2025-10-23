import {loginUser, registerUser} from "../controllers/userController.js";
import express from "express";
const userRouter = express.Router();
userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
export default userRouter;