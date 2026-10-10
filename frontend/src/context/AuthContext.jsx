import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sports_token') || null);
  const [loading, setLoading] = useState(true);

  // Check token and fetch user on load
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('sports_token');
      if (storedToken) {
        try {
          const res = await axiosClient.get('/auth/profile');
          setUser(res.data);
          setToken(storedToken);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const { token: receivedToken, ...userData } = res.data;
    localStorage.setItem('sports_token', receivedToken);
    setToken(receivedToken);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await axiosClient.post('/auth/register', userData);
    const { token: receivedToken, ...createdUser } = res.data;
    localStorage.setItem('sports_token', receivedToken);
    setToken(receivedToken);
    setUser(createdUser);
    return createdUser;
  };

  const demoLogin = async () => {
    return await login('alex@example.com', 'password123');
  };

  const adminLogin = async () => {
    return await login('admin@sportshub.com', 'adminpassword');
  };

  const logout = () => {
    localStorage.removeItem('sports_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    const res = await axiosClient.put('/auth/profile', updateData);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller' || user?.isSeller === true,
        loading,
        login,
        register,
        demoLogin,
        adminLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
