import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getAllListeningContent,
  getListeningById,
  submitListeningAnswers,
  getListeningProgress
} from '../controllers/listening.controller.js';

const router = express.Router();

// All listening routes require authentication
router.use(protect);

// Important: /progress must come BEFORE /:id
router.get('/', getAllListeningContent);
router.get('/progress', getListeningProgress);
router.get('/:id', getListeningById);
router.post('/:id/submit', submitListeningAnswers);

export default router;
