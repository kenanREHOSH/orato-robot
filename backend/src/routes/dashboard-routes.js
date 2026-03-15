import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getDashboard,
  getStats,
  getContinueLearning,
  getChallenges,
  updateChallengeProgress,
  getSkills,
  getRecentAchievements,
  getActivityHistory
} from '../controllers/dashboard.controller.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

router.get('/', getDashboard);
router.get('/stats', getStats);
router.get('/continue-learning', getContinueLearning);
router.get('/challenges', getChallenges);
router.post('/challenges/update', updateChallengeProgress);
router.get('/skills', getSkills);
router.get('/achievements', getRecentAchievements);
router.get('/activity', getActivityHistory);

export default router;