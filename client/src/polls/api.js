// client/src/polls/api.js
import api from '../common/api';

// Get all active polls (public)
export const getPolls = async () => {
  try {
    const response = await api.get('/polls/');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to fetch polls' },
    };
  }
};

// Get single poll details with options (public)
export const getPollDetail = async (pollId) => {
  try {
    const response = await api.get(`/polls/${pollId}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to fetch poll details' },
    };
  }
};

// Create new poll (admin only)
export const createPoll = async (pollData) => {
  try {
    const response = await api.post('/polls/create/', pollData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to create poll' },
    };
  }
};

// Add options to a poll (admin only)
export const addPollOptions = async (pollId, options) => {
  try {
    const response = await api.post(`/polls/${pollId}/options/create/`, {
      options: options,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to add options' },
    };
  }
};

// Cast a vote (authenticated users only)
export const castVote = async (pollId, optionId) => {
  try {
    const response = await api.post(`/polls/${pollId}/vote/`, {
      poll: pollId,
      option: optionId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to cast vote' },
    };
  }
};

// Get poll results (public)
export const getPollResults = async (pollId) => {
  try {
    const response = await api.get(`/polls/${pollId}/results/`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to fetch results' },
    };
  }
};