// Render backend URL in production; Vite proxy /api in local development
const BASE_URL = import.meta.env.VITE_API_URL || '/api';
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
      const errorMsg = errData.details ? `${errData.error}: ${errData.details}` : (errData.error || `HTTP error! status: ${response.status}`);
      throw new Error(errorMsg);
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
      const errorMsg = errData.details ? `${errData.error}: ${errData.details}` : (errData.error || `HTTP error! status: ${response.status}`);
      throw new Error(errorMsg);
    }
    return response.json();
  },

  postForm: async (endpoint, formData) => {
    const headers = await getHeaders();
    delete headers['Content-Type']; // Let browser set multipart/form-data boundary
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errorMsg = errData.details ? `${errData.error}: ${errData.details}` : (errData.error || `HTTP error! status: ${response.status}`);
      throw new Error(errorMsg);
    }
    return response.json();
  },

  delete: async (endpoint) => {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

// Authored API Actions
// Authored API Actions
export const fetchConversations = () => api.get('/chat/conversations');
export const fetchChatHistory = (conversationId) => api.get(`/chat/history/${conversationId || ''}`);
export const sendChatMessage = (message, conversationId, file = null) => {
  if (file) {
    const formData = new FormData();
    if (message) formData.append('message', message);
    if (conversationId) formData.append('conversationId', conversationId);
    formData.append('file', file);
    return api.postForm('/chat/message', formData);
  }
  return api.post('/chat/message', { message, conversationId });
};
export const clearChatHistory = (conversationId) => api.post(`/chat/conversations/${conversationId}/clear`);
export const renameConversation = (conversationId, title) => api.post(`/chat/conversations/${conversationId}/title`, { title });
export const deleteConversation = (conversationId) => api.delete(`/chat/conversations/${conversationId}`);
export const checkBackendHealth = () => api.get('/health');
export const saveUserProfile = (profileData) => api.post('/chat/profile', profileData);
