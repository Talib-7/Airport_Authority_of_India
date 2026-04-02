import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const airportsService = {
  findAll: async (region) => {
    const response = await axios.get(`${API_BASE_URL}/airports`, {
      params: region ? { region } : undefined,
      headers: getAuthHeader(),
    });

    return response.data;
  },

  create: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/airports`, payload, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },

  update: async (airportId, payload) => {
    const response = await axios.patch(`${API_BASE_URL}/airports/${airportId}`, payload, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },

  remove: async (airportId) => {
    const response = await axios.delete(`${API_BASE_URL}/airports/${airportId}`, {
      headers: getAuthHeader(),
    });

    return response.data;
  },

  validateAccess: async (latitude, longitude) => {
    const response = await axios.get(`${API_BASE_URL}/airports/access/check`, {
      params: { latitude, longitude },
    });

    return response.data;
  },
};

export default airportsService;