import { apiClient } from './client';

export const adminApi = {
  getOverview: async () => {
    const response = await apiClient.get('/admin/overview');
    return response.data.data;
  },

  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data.data;
  },
};
