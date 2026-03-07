const express = require("express");
const router = express.Router();

const {
  chatWithSpeakingCoach,
} = require("../controllers/speakingCoachController");

router.post("/chat", chatWithSpeakingCoach);

module.exports = router;