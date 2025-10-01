import api from './axios';

export const adminManagementAPI = {
  // ==================== STATISTICS ====================
  getStats: async () => {
    const response = await api.get('/admin/stats/');
    return response.data;
  },

  // ==================== USER MANAGEMENT ====================
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users/', { params });
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/admin/users/${userId}/`);
    return response.data;
  },

  updateUser: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}/`, data);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}/`);
    return response.data;
  },

  bulkDeleteUsers: async (ids) => {
    const response = await api.post('/admin/users/bulk-delete/', { ids });
    return response.data;
  },

  // ==================== POLL MANAGEMENT ====================
  getPolls: async (params = {}) => {
    const response = await api.get('/admin/polls/', { params });
    return response.data;
  },

  getPoll: async (pollId) => {
    const response = await api.get(`/admin/polls/${pollId}/`);
    return response.data;
  },

  updatePoll: async (pollId, data) => {
    const response = await api.put(`/admin/polls/${pollId}/`, data);
    return response.data;
  },

  deletePoll: async (pollId) => {
    const response = await api.delete(`/admin/polls/${pollId}/`);
    return response.data;
  },

  togglePollActive: async (pollId) => {
    const response = await api.post(`/admin/polls/${pollId}/toggle-active/`);
    return response.data;
  },

  bulkDeletePolls: async (ids) => {
    const response = await api.post('/admin/polls/bulk-delete/', { ids });
    return response.data;
  },

  // ==================== BANNER MANAGEMENT ====================
  getBanners: async (params = {}) => {
    const response = await api.get('/admin/banners/', { params });
    return response.data;
  },

  getBanner: async (bannerId) => {
    const response = await api.get(`/admin/banners/${bannerId}/`);
    return response.data;
  },

  updateBanner: async (bannerId, data) => {
    const response = await api.put(`/admin/banners/${bannerId}/`, data);
    return response.data;
  },

  deleteBanner: async (bannerId) => {
    const response = await api.delete(`/admin/banners/${bannerId}/`);
    return response.data;
  },

  bulkDeleteBanners: async (ids) => {
    const response = await api.post('/admin/banners/bulk-delete/', { ids });
    return response.data;
  },

  // ==================== VOTE MANAGEMENT ====================
  getVotes: async (params = {}) => {
    const response = await api.get('/admin/votes/', { params });
    return response.data;
  },

  deleteVote: async (voteId) => {
    const response = await api.delete(`/admin/votes/${voteId}/`);
    return response.data;
  },
};