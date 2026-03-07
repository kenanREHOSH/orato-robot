const getCoachReply = (userText) => {
  const text = (userText || "").trim();

  if (!text) {
    return "Say something in English and I will help you practice.";
  }

  const tips = [];

  if (/\\bi am go\\b/i.test(text)) {
    tips.push('Try: "I am going"');
  }

  if (/\\bhe go\\b/i.test(text)) {
    tips.push('Try: "He goes"');
  }

  if (/\\bshe go\\b/i.test(text)) {
    tips.push('Try: "She goes"');
  }

  if (/\\byesterday\\b/i.test(text) && /\\bgo\\b/i.test(text)) {
    tips.push('Because you used "yesterday", use past tense: "went"');
  }

  const praise = "Nice! Your sentence is understandable.";
  const question = "Tell me more about that. Why do you think so?";

  if (tips.length > 0) {
    return `${praise}\n\nSmall correction(s):\n- ${tips.join("\n- ")}\n\n${question}`;
  }

  return `${praise}\n\n${question}`;
};

const chatWithSpeakingCoach = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const reply = getCoachReply(message);

    return res.status(200).json({
      success: true,
      userMessage: message,
      coachReply: reply,
    });
  } catch (error) {
    console.error("Speaking coach error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating coach reply.",
    });
  }
};

module.exports = {
  chatWithSpeakingCoach,
};