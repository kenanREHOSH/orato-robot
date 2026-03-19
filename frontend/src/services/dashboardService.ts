const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.config?.backendUrl) {
    return window.config.backendUrl;
  }
  return 'http://localhost:5002/api';
};

const BASE_URL = `${getBaseUrl()}/dashboard`;

const getToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (token) return token;

  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.token || parsed.accessToken || parsed.tokens?.accessToken || null;
    } catch {
      return null;
    }
  }

  return null;
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const dashboardService = {
  getDashboard: async () => {
    const res = await fetch(`${BASE_URL}/`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  },

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  getContinueLearning: async () => {
    const res = await fetch(`${BASE_URL}/continue-learning`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch lessons');
    return res.json();
  },

  getChallenges: async () => {
    const res = await fetch(`${BASE_URL}/challenges`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch challenges');
    return res.json();
  },

  updateChallenge: async (type: string, amount: number = 1) => {
    const res = await fetch(`${BASE_URL}/challenges/update`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount })
    });
    if (!res.ok) throw new Error('Failed to update challenge');
    return res.json();
  },

  getSkills: async () => {
    const res = await fetch(`${BASE_URL}/skills`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  getAchievements: async () => {
    const res = await fetch(`${BASE_URL}/achievements`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch achievements');
    return res.json();
  },
};
