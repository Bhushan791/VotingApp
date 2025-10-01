import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          authAPI.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

const login = async (credentials) => {
  try {
    const data = await authAPI.login(credentials);
    console.log('Login response:', data); // see tokens
    const userData = await authAPI.getProfile();
    console.log('User profile:', userData); // see profile
    setUser(userData);
    return data;
  } catch (err) {
    console.error('Login failed:', err.response?.data || err);
    throw err; // rethrow so Login.jsx can catch
  }
};


  const register = async (userData) => {
    const data = await authAPI.register(userData);
    return data;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.is_staff || user?.is_superuser;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
