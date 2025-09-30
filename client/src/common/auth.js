// client/src/common/auth.js

// Token keys for localStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Save tokens to localStorage
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Clear all tokens
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Save user data
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user data
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Check if user is admin
export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

// Check if user is regular user
export const isRegularUser = () => {
  const user = getUser();
  return user?.role === 'user';
};

// Logout helper
export const logout = () => {
  clearTokens();
  window.location.href = '/login';
};