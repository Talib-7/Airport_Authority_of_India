import { create } from 'zustand';
import authService from '../services/authService';
import airportsService from '../../airports/services/airportsService';

const AGENT_ROLE_ID = 2;

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location services are not available in this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => reject(new Error('Location access is required for agent login.')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  });

const useAuthStore = create((set) => ({
  // State
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // Actions
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      
      const { access_token, user } = response;

      if (user?.roleId === AGENT_ROLE_ID) {
        const position = await getCurrentPosition();
        const accessResponse = await airportsService.validateAccess(
          position.coords.latitude,
          position.coords.longitude,
        );

        if (!accessResponse?.allowed) {
          set({
            loading: false,
            error: 'Agent login is allowed only within an airport premise.',
            isAuthenticated: false,
          });
          return { success: false, error: 'Agent login is allowed only within an airport premise.' };
        }

        if (user.airportId && accessResponse?.airport?.airportId !== user.airportId) {
          set({
            loading: false,
            error: 'You are not within your assigned airport region.',
            isAuthenticated: false,
          });
          return { success: false, error: 'You are not within your assigned airport region.' };
        }
      }
      
      // Save to localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      set({
        token: access_token,
        user: user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ 
        loading: false, 
        error: errorMessage,
        isAuthenticated: false 
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Helper to check if token is still valid
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
      });
    } else {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));

export default useAuthStore;
