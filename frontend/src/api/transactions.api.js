import { apiClient } from './client';

export const transactionsApi = {
  getTransactions: async (params = {}) => {
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data.data;
  },

  createTransaction: async (payload) => {
    const response = await apiClient.post('/transactions', payload);
    return response.data.data;
  },

  updateTransaction: async (id, payload) => {
    const response = await apiClient.put(`/transactions/${id}`, payload);
    return response.data.data;
  },

  deleteTransaction: async (id) => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data.data;
  },

  getMonthlySummary: async (year, month) => {
    const response = await apiClient.get('/transactions/monthly-summary', {
      params: { year, month },
    });
    return response.data.data;
  },
};
