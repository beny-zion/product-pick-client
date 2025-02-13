// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/api/auth';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        console.log("user in token",response.data.user)
        if (response?.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        if (error.status !== 401) {
          console.error('Auth check failed:', error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);

  const updateUserProfile = async (userData) => {
    const response = await authService.updateProfile(userData);
    setUser(response.data.user);
    return response.data.user;
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.user);
    return response.data.user;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    // navigate('/');
  };

  const value = {
    updateUserProfile,
    setUser,
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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