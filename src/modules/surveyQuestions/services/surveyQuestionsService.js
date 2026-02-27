import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Helper to get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const surveyQuestionsService = {
  // Create a new survey question (Admin only)
  create: async (questionData) => {
    const response = await axios.post(
      `${API_BASE_URL}/survey-questions`,
      questionData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Get all survey questions
  findAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/survey-questions`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get a single survey question by ID
  findOne: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/survey-questions/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Update a survey question (Admin only)
  update: async (id, questionData) => {
    const response = await axios.patch(
      `${API_BASE_URL}/survey-questions/${id}`,
      questionData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Delete a survey question (Admin only)
  remove: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/survey-questions/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default surveyQuestionsService;
