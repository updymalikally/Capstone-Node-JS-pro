import { apiClient } from './client';

export const authApi = {
  login: async (payload) => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data.data;
  },

  register: async (payload) => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  },

  updateProfile: async (payload) => {
    const response = await apiClient.put('/auth/profile', payload);
    return response.data.data;
  },
};
