/**
 * Seed Listening Content using Pollinations.AI API
 * Generates paragraphs + 3 questions per item for each level
 * 
 * Usage: node seedListening.js
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import ListeningContent from './src/models/listeningContent.js';

const MONGO_URI = process.env.MONGO_URI;

// Topics for each level
const topics = {
  beginner: [
    'My Daily Routine',
    'Going to the Market',
    'My Family Members',
    'A Day at School',
    'My Favorite Food',
    'The Weather Today',
    'Playing in the Park',
    'My Pet Animal',
    'A Birthday Party',
    'Visiting the Doctor'
  ],
  intermediate: [
    'A Trip to the City',
    'Environmental Pollution',
    'Social Media and Friends',
    'A Job Interview Experience',
    'Cooking a Traditional Meal',
    'Public Transportation',
    'The Importance of Exercise',
    'A Movie Review',
    'Learning a New Language',
    'A Festival Celebration'
  ],
  advanced: [
    'The Impact of Artificial Intelligence on Employment',
    'Climate Change and Global Responsibility',
    'The Ethics of Genetic Engineering',
    'Cultural Globalization and Identity',
    'The Future of Space Exploration',
    'Mental Health in Modern Society',
    'The Role of Technology in Education',
    'Economic Inequality and Solutions',
    'The Philosophy of Happiness',
    'Sustainable Development Goals'
  ]
};

/**
 * Generate a paragraph + 3 MCQ questions using Pollinations.AI
 */
async function generateContent(topic, level, order) {
  const levelDesc = {
    beginner: 'very simple English (A1-A2 level), short sentences, basic vocabulary, 50-80 words',
    intermediate: 'moderate English (B1-B2 level), varied sentence structure, 80-120 words',
    advanced: 'complex English (C1-C2 level), sophisticated vocabulary, complex sentences, 120-160 words'
  };

  const prompt = `Generate a short English listening comprehension paragraph about "${topic}" in ${levelDesc[level]}.

Then create exactly 3 multiple-choice questions about this paragraph. Each question must have exactly 4 options (A, B, C, D) with only one correct answer.

IMPORTANT: Respond ONLY with valid JSON in this exact format, no other text:
{
  "title": "${topic}",
  "content": "The paragraph text here...",
  "questions": [
    {
      "text": "Question 1 text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    },
    {
      "text": "Question 2 text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1
    },
    {
      "text": "Question 3 text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2
    }
  ]
}

The correctAnswer is the INDEX (0-3) of the correct option. Make questions test comprehension of the paragraph.`;

  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai&seed=${order * 100 + level.length}`;

  try {
    console.log(`   🌐 Calling Pollinations.AI for: "${topic}"...`);
    const response = await fetch(url);
    const text = await response.text();

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // Try to find raw JSON
      const startIdx = text.indexOf('{');
      const endIdx = text.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        jsonStr = text.substring(startIdx, endIdx + 1);
      }
    }

    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!parsed.content || !parsed.questions || parsed.questions.length !== 3) {
      throw new Error('Invalid response structure');
    }

    // Validate each question has 4 options
    for (const q of parsed.questions) {
      if (!q.options || q.options.length !== 4) {
        throw new Error('Each question must have exactly 4 options');
      }
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        q.correctAnswer = 0; // Default to first option if invalid
      }
    }

    return {
      level,
      order,
      type: 'paragraph',
      title: parsed.title || topic,
      content: parsed.content,
      questions: parsed.questions
    };
  } catch (error) {
    console.error(`   ❌ API error for "${topic}": ${error.message}`);
    console.log(`   📝 Using fallback content for "${topic}"`);
    return generateFallback(topic, level, order);
  }
}

/**
 * Fallback content if API fails
 */
function generateFallback(topic, level, order) {
  const fallbacks = {
    beginner: {
      content: `This is a simple paragraph about ${topic.toLowerCase()}. It uses easy words. People do this every day. It is very common. Many people enjoy it. It is a good thing to learn about.`,
      questions: [
        {
          text: `What is this paragraph about?`,
          options: [topic, 'Animals', 'Space', 'History'],
          correctAnswer: 0
        },
        {
          text: 'How often do people do this?',
          options: ['Never', 'Every day', 'Once a year', 'Only on weekends'],
          correctAnswer: 1
        },
        {
          text: 'According to the paragraph, this is:',
          options: ['Dangerous', 'Boring', 'Very common', 'Expensive'],
          correctAnswer: 2
        }
      ]
    },
    intermediate: {
      content: `${topic} is an interesting subject that many people think about. In today's world, it has become increasingly important. People from different backgrounds have various opinions about it. Understanding ${topic.toLowerCase()} can help us make better decisions in our daily lives. Research shows that awareness about this topic is growing every year.`,
      questions: [
        {
          text: `What does the paragraph say about ${topic.toLowerCase()}?`,
          options: ['It is not important', 'It has become increasingly important', 'Nobody cares about it', 'It was only important in the past'],
          correctAnswer: 1
        },
        {
          text: 'What can understanding this topic help us with?',
          options: ['Nothing', 'Making better decisions', 'Sleeping better', 'Cooking food'],
          correctAnswer: 1
        },
        {
          text: 'According to the paragraph, awareness about this topic is:',
          options: ['Decreasing', 'Staying the same', 'Growing every year', 'Not mentioned'],
          correctAnswer: 2
        }
      ]
    },
    advanced: {
      content: `The multifaceted nature of ${topic.toLowerCase()} presents both unprecedented opportunities and formidable challenges in contemporary society. Scholars and practitioners alike have engaged in rigorous discourse regarding its implications for future generations. The complexity of this subject demands a nuanced understanding that transcends superficial analysis. As we navigate an increasingly interconnected world, the significance of comprehending ${topic.toLowerCase()} cannot be overstated.`,
      questions: [
        {
          text: `How does the paragraph describe the nature of ${topic.toLowerCase()}?`,
          options: ['Simple', 'Multifaceted', 'Irrelevant', 'Temporary'],
          correctAnswer: 1
        },
        {
          text: 'What kind of understanding does this subject demand?',
          options: ['Basic understanding', 'No understanding', 'A nuanced understanding', 'Mathematical understanding'],
          correctAnswer: 2
        },
        {
          text: 'Who has engaged in discourse about this topic?',
          options: ['Only students', 'Only politicians', 'Scholars and practitioners', 'Only children'],
          correctAnswer: 2
        }
      ]
    }
  };

  const fb = fallbacks[level];
  return {
    level,
    order,
    type: 'paragraph',
    title: topic,
    content: fb.content,
    questions: fb.questions
  };
}

/**
 * Main seed function
 */
async function seedListening() {
  try {
    console.log('\n🎧 Listening Content Seeder');
    console.log('═══════════════════════════════════════\n');

    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!\n');

    // Clear existing listening content
    await ListeningContent.deleteMany({});
    console.log('🗑️  Cleared existing listening content\n');

    const levels = ['beginner', 'intermediate', 'advanced'];
    let totalSeeded = 0;

    for (const level of levels) {
      console.log(`\n📚 Generating ${level.toUpperCase()} content (10 items)...`);
      console.log('───────────────────────────────────────');

      const levelTopics = topics[level];

      for (let i = 0; i < levelTopics.length; i++) {
        const order = i + 1;
        const topic = levelTopics[i];

        const content = await generateContent(topic, level, order);

        await ListeningContent.create(content);
        console.log(`   ✅ [${order}/10] "${topic}" saved`);
        totalSeeded++;

        // Small delay between API calls to be respectful
        if (i < levelTopics.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`🎉 Done! Seeded ${totalSeeded} listening items.`);
    console.log('═══════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedListening();
