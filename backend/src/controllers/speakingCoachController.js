// Generate feedback for the user's sentence
const getCoachReply = (userText) => {
  const text = (userText || "").trim();

  // If user didn't say anything
  if (!text) {
    return "Say something in English and I will help you practice.";
  }

  const tips = [];

  // Check common mistake: "I am go"
  if (/\\bi am go\\b/i.test(text)) {
    tips.push('Try: "I am going"');
  }

  // Check "he go"
  if (/\\bhe go\\b/i.test(text)) {
    tips.push('Try: "He goes"');
  }

  // Check "she go"
  if (/\\bshe go\\b/i.test(text)) {
    tips.push('Try: "She goes"');
  }

  // Check past tense with yesterday
  if (/\\byesterday\\b/i.test(text) && /\\bgo\\b/i.test(text)) {
    tips.push('Because you used "yesterday", use past tense: "went"');
  }

  const praise = "Nice! Your sentence is understandable.";
  const question = "Tell me more about that. Why do you think so?";

  // If we found mistakes, return corrections
  if (tips.length > 0) {
    return `${praise}\n\nSmall correction(s):\n- ${tips.join("\n- ")}\n\n${question}`;
  }

  // Otherwise just continue conversation
  return `${praise}\n\n${question}`;
};


// API controller for speaking coach
const chatWithSpeakingCoach = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate user message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    // Generate reply
    const reply = getCoachReply(message);

    // Send response to frontend
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

// Export controller
module.exports = {
  chatWithSpeakingCoach,
};