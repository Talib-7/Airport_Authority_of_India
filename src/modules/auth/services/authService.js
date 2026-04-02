import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const authService = {
  // Login user
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/agents/register`, userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (otpData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, otpData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, resetData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Logout (if backend requires)
  logout: async (token) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default authService;
