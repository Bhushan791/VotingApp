// client/src/users/api.js
import api from '../common/api';
import { setTokens, setUser } from '../common/auth';

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/register/', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Registration failed' },
    };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/users/login/', credentials);
    const { access, refresh, user } = response.data;

    // Save tokens and user data
    setTokens(access, refresh);
    setUser(user);

    return { success: true, data: { user, access, refresh } };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Login failed' },
    };
  }
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile/');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to fetch profile' },
    };
  }
};