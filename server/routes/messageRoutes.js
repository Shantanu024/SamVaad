import { protectRoute } from "../middleware/auth.js";
import express from "express";
import { getAllUsers, getMessages, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

// ADDED: Wrapper function to catch async errors and pass to error handler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

messageRouter.get("/users", protectRoute, asyncHandler(getAllUsers));
messageRouter.get("/:id", protectRoute, asyncHandler(getMessages));
messageRouter.put("/mark/:id", protectRoute, asyncHandler(markMessageAsSeen));
messageRouter.post("/send/:id", protectRoute, asyncHandler(sendMessage));

export default messageRouter;