import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const agentService = {
  register: async (payload) => {
    const formData = new FormData();
    formData.append('fullName', payload.name);
    formData.append('email', payload.email);
    formData.append('mobile', payload.mobile);
    formData.append('agencyName', payload.agencyName);
    formData.append('airportName', payload.airport);
    formData.append('uploadId', payload.uploadId);

    const response = await axios.post(`${API_BASE_URL}/agents/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },

  getPendingAgents: async () => {
    const response = await axios.get(`${API_BASE_URL}/agents/pending`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  approveAgent: async (userId) => {
    const response = await axios.patch(
      `${API_BASE_URL}/agents/${userId}/approve`,
      {},
      { headers: getAuthHeaders() },
    );
    return response.data;
  },

  rejectAgent: async (userId, reason) => {
    const response = await axios.patch(
      `${API_BASE_URL}/agents/${userId}/reject`,
      { reason },
      { headers: getAuthHeaders() },
    );
    return response.data;
  },

  getApprovedAgents: async () => {
    const response = await axios.get(`${API_BASE_URL}/agents/approved`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  getAgentHistory: async () => {
    const response = await axios.get(`${API_BASE_URL}/agents/history`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

export default agentService;
