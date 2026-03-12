import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
});

const listeningContentSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  type: {
    type: String,
    enum: ['paragraph', 'song'],
    default: 'paragraph'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  questions: {
    type: [questionSchema],
    validate: [arr => arr.length === 3, 'Exactly 3 questions required']
  }
}, { timestamps: true });

// Ensure unique combination of level + order
listeningContentSchema.index({ level: 1, order: 1 }, { unique: true });

export default mongoose.model('ListeningContent', listeningContentSchema);
