import express from "express";
import { loginUser,registerUser } from "../controllers/userController.js";

//Instead of writing all routes directly in your app.js (main file), 
// you put user-related routes in userRouter.
const userRouter=express.Router()

userRouter.post("/register", registerUser);
userRouter.post("/login",loginUser);

export default userRouter;