import { protectRoute } from "../middleware/auth.js";
import express from "express";
import { getAllUsers, getMessages, markMessageAsSeen, sendMessage } from "../controllers/messagecontroller.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getAllUsers);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;