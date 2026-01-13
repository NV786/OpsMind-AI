import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// --- CONFIGURATION ---
// Set this to FALSE when connecting to your real Node.js/Python backend
const USE_MOCK_API = false;
const API_URL = 'http://localhost:5000/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // 1. AXIOS SETUP: Attach token to every request automatically
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // 2. AXIOS INTERCEPTOR: Handle Token Expiration (401)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid -> Force logout
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // 3. INITIALIZATION: Check for session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        if (USE_MOCK_API) {
          // MOCK: Simulate validating token
          const storedUser = localStorage.getItem('user');
          if (storedUser) setCurrentUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          // REAL: Fetch user profile using the token
          try {
            const response = await axios.get(`${API_URL}/auth/me`);
            setCurrentUser(response.data.user);
            setToken(storedToken);
          } catch (error) {
            console.error("Session expired:", error);
            logout(); // Clear invalid token
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // --- ACTIONS ---

  const login = async (email, password) => {
    try {
      let data;

      if (USE_MOCK_API) {
        // MOCK DELAY
        await new Promise(r => setTimeout(r, 1500));

        // Mock Validation
        if (password.length < 6) throw new Error("Password too short");

        data = {
          token: "mock-jwt-token-12345",
          user: { id: 1, username: email.split('@')[0], email, role: 'admin' }
        };
      } else {
        // REAL API CALL
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        data = response.data;
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      let data;

      if (USE_MOCK_API) {
        await new Promise(r => setTimeout(r, 1500));
        data = {
          token: "mock-jwt-token-67890",
          user: { id: 2, username, email, role: 'user' }
        };
      } else {
        const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
        data = response.data;
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optional: Redirect to login handled by App.js router
  };

  const value = {
    currentUser, // Renamed from 'user' to match typical naming conventions
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};