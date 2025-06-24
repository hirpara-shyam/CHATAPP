import express from "express";
import { sendChatRequest, getChatRequests, acceptChatRequest, rejectChatRequest } from "../controllers/chatRequestController.js";
import { protectRoute } from "../middleware/auth.js";

const chatRequestRouter = express.Router();

chatRequestRouter.post("/send", protectRoute, sendChatRequest);
chatRequestRouter.get("/", protectRoute, getChatRequests);
chatRequestRouter.put("/accept/:id", protectRoute, acceptChatRequest);
chatRequestRouter.put("/reject/:id", protectRoute, rejectChatRequest);

export default chatRequestRouter;