import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const dashboardService = {
  getDashboardStats: async (airportId, surveyId, agentId) => {
    const params = {};
    if (airportId) params.airportId = airportId;
    if (surveyId) params.surveyId = surveyId;
    if (agentId) params.agentId = agentId;

    const response = await axios.get(`${API_BASE_URL}/surveys/dashboard/stats`, {
      params,
      headers: getAuthHeaders(),
    });

    return response.data;
  },
};

export default dashboardService;
