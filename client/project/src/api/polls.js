import axiosInstance from './axios';

export const pollsAPI = {
  getAllPolls: async () => {
    const response = await axiosInstance.get('/polls/');
    return response.data;
  },

  // NEW: Get all polls including closed ones (for admin)
  getAdminAllPolls: async () => {
    const response = await axiosInstance.get('/polls/admin/all/');
    return response.data;
  },

  getPoll: async (id) => {
    const response = await axiosInstance.get(`/polls/${id}/`);
    return response.data;
  },

  createPoll: async (pollData) => {
    const response = await axiosInstance.post('/polls/create/', pollData);
    return response.data;
  },

  addOption: async (pollId, optionText) => {
    const response = await axiosInstance.post(`/polls/${pollId}/options/create/`, {
      option_text: optionText,
    });
    return response.data;
  },

  vote: async (pollId, optionId) => {
    const response = await axiosInstance.post(`/polls/${pollId}/vote/`, {
      option: optionId,
      poll: pollId,
    });
    return response.data;
  },

  getResults: async (pollId) => {
    const response = await axiosInstance.get(`/polls/${pollId}/results/`);
    return response.data;
  },
};