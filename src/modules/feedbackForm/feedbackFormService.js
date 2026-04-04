import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const feedbackFormService = {
  findRunningSurvey: async (surveyId, latitude, longitude) => {
    const response = await axios.get(`${API_BASE_URL}/public/surveys/${surveyId}`, {
      params: { latitude, longitude },
    });

    return response.data;
  },

  submitFeedback: async (surveyId, payload) => {
    const response = await axios.post(`${API_BASE_URL}/public/surveys/${surveyId}/feedback`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
};

export default feedbackFormService;