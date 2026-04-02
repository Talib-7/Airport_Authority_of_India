import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const surveyManagementService = {
  findAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/surveys`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  create: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/surveys`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (surveyId, payload) => {
    const response = await axios.patch(`${API_BASE_URL}/surveys/${surveyId}`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  makeLive: async (surveyId, payload) => {
    const response = await axios.patch(`${API_BASE_URL}/surveys/${surveyId}/live`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  stop: async (surveyId) => {
    const response = await axios.patch(
      `${API_BASE_URL}/surveys/${surveyId}/stop`,
      {},
      {
        headers: getAuthHeader(),
      },
    );
    return response.data;
  },

  fetchAirports: async () => {
    const response = await axios.get(`${API_BASE_URL}/airports`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default surveyManagementService;