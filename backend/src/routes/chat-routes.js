import express from "express";
import { sendChatMessage } from "../controllers/chat-controller.js";

const router = express.Router();

// POST /api/chat - AI chat message.
router.post("/", sendChatMessage);

export default router;
