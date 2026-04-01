import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const generalQuestionsService = {
  findAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/questions`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  create: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/questions`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default generalQuestionsService;
