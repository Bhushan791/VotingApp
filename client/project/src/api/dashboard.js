import axiosInstance from './axios';

export const dashboardAPI = {
  getAdminSummary: async () => {
    const response = await axiosInstance.get('/dashboard/admin-summary/');
    return response.data;
  },

  getPollStats: async (pollId) => {
    const response = await axiosInstance.get(`/dashboard/polls/${pollId}/stats/`);
    return response.data;
  },
};
