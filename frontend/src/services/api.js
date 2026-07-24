// Express Backend Base API Url. Vite dev server proxies /api requests to http://localhost:5000/api
const BASE_URL = '/api';

const getHeaders = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  let sessionId = localStorage.getItem('aspireya_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('aspireya_session_id', sessionId);
  }
  
  headers['Session-Id'] = sessionId;
  return headers;
};

export const api = {
  get: async (endpoint) => {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  post: async (endpoint, data) => {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

// Authored API Actions
export const fetchChatHistory = () => api.get('/chat/history');
export const sendChatMessage = (message) => api.post('/chat/message', { message });
export const clearChatHistory = () => api.post('/chat/clear');
export const checkBackendHealth = () => api.get('/health');
export const saveUserProfile = (profileData) => api.post('/chat/profile', profileData);
