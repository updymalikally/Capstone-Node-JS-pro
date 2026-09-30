import { apiClient } from './client';

export const categoriesApi = {
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data.data;
  },

  createCategory: async (payload) => {
    const response = await apiClient.post('/categories', payload);
    return response.data.data;
  },
};
