import express from "express";
import { chatWithSpeakingCoach } from "../controllers/speakingCoachController.js";

const router = express.Router();

router.post("/chat", chatWithSpeakingCoach);

export default router;