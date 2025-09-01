import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Article APIs
export const articleAPI = {
  // Get all articles for a user
  getByUserId: async (userId) => {
    const response = await api.get(`/articles/user/${userId}`);
    return response.data;
  },

  // Create a new article
  create: async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
  },

  // Update an article
  update: async (articleId, articleData) => {
    const response = await api.put(`/articles/${articleId}`, articleData);
    return response.data;
  },

  // Delete an article
  delete: async (articleId, userId) => {
    const response = await api.delete(`/articles/${articleId}?userId=${userId}`);
    return response.data;
  },
};

// Webhook APIs
export const webhookAPI = {
  // Subscribe or update webhook
  subscribe: async (subscriptionData) => {
    const response = await api.post('/webhooks/subscribe', subscriptionData);
    return response.data;
  },

  // Get webhook subscription for a user (if endpoint exists)
  getByUserId: async (userId) => {
    try {
      const response = await api.get(`/webhooks/user/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

export default api;