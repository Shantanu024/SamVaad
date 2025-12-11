import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { login, checkAuth, signup, updateProfile } from "../controllers/userController.js";

const userRouter = express.Router();

// ADDED: Wrapper function to catch async errors and pass to error handler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

userRouter.post("/SignUp", asyncHandler(signup));
userRouter.post("/login", asyncHandler(login));
userRouter.put("/updated-profile", protectRoute, asyncHandler(updateProfile));
userRouter.get("/check", protectRoute, asyncHandler(checkAuth));

export default userRouter;