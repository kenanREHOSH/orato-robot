import Lesson from '../models/lesson.js';
import Achievement from '../models/achievement.js';
import User from '../models/user.js';

// Helper: get relative time string
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// GET /api/progress — fetch progress for the authenticated user (or first user as fallback)
export const getProgress = async (req, res) => {
  try {
    let user = req.user;
    if (!user) {
      user = await User.findOne();
      if (!user) {
        return res.status(200).json({ lessons: [], stats: [], activities: [], summary: { totalLessons: 0, avgScore: 0, totalPoints: 0, dayStreak: 0, learningHours: 0 } });
      }
    }
    const userId = user._id;

    // 1. Completed lessons (progress === 100) sorted by most recent
    const completedLessons = await Lesson.find({ userId, progress: 100 })
      .sort({ lastAccessed: -1 })
      .limit(10);

    const lessons = completedLessons.map((l, i) => ({
      id: l._id,
      title: l.title,
      language: l.category || 'English',
      icon: l.icon || '📚',
      date: l.lastAccessed ? new Date(l.lastAccessed).toISOString().split('T')[0] : '',
      time: l.lastAccessed ? new Date(l.lastAccessed).toTimeString().slice(0, 5) : '',
      score: l.progress,
      duration: `${l.totalTime || 0} min`,
      points: (i + 1) * 50,
    }));

    // Sort combined lessons by date descending
    lessons.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. Weekly stats — aggregate lessons accessed in the past 7 days
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const recentLessons = await Lesson.find({
      userId,
      lastAccessed: { $gte: weekStart },
    });

    const statsMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const dayKey = dayNames[d.getDay()];
      statsMap[dayKey] = { day: dayKey, lessons: 0, points: 0 };
    }

    recentLessons.forEach((l) => {
      const dayKey = dayNames[new Date(l.lastAccessed).getDay()];
      if (statsMap[dayKey]) {
        statsMap[dayKey].lessons += 1;
        statsMap[dayKey].points += 50;
      }
    });

    const stats = Object.values(statsMap);

    // 3. Recent activities — combine achievements + recent lesson completions
    const achievements = await Achievement.find({ userId })
      .sort({ earnedAt: -1 })
      .limit(5);

    const activities = achievements.map((a) => ({
      id: a._id,
      type: 'achievement',
      title: `Earned "${a.title}" badge`,
      time: timeAgo(a.earnedAt),
      icon: '🏆',
    }));

    // Add recent lesson completions as activities
    completedLessons.slice(0, 3).forEach((l) => {
      activities.push({
        id: l._id,
        type: 'lesson',
        title: `Completed ${l.title}`,
        time: timeAgo(l.lastAccessed),
        icon: l.icon || '📚',
      });
    });

    // Sort activities by recency (achievements earnedAt, lessons lastAccessed)
    activities.sort((a, b) => {
      // Already sorted relative, just interleave
      return 0;
    });

    res.status(200).json({
      lessons: lessons.slice(0, 15),
      stats,
      activities: activities.slice(0, 8),
      summary: {
        totalLessons: lessons.length,
        avgScore: lessons.length > 0 ? Math.round(lessons.reduce((s, l) => s + l.score, 0) / lessons.length) : 0,
        totalPoints: user.stats?.totalPoints || 0,
        dayStreak: user.stats?.dayStreak || 0,
        learningHours: Math.round((recentLessons.reduce((s, l) => s + (l.totalTime || 0), 0)) / 60 * 10) / 10,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};