import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const feedbackReceivedService = {
  // Get all feedback with optional filters
  getAllFeedback: async (airportId, surveyId, agentId) => {
    try {
      const params = {};
      if (airportId) params.airportId = airportId;
      if (surveyId) params.surveyId = surveyId;
      if (agentId) params.agentId = agentId;

      const response = await axios.get(`${API_BASE_URL}/surveys/feedback/all`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  // Get filter options (airports, surveys, agents)
  getFilterOptions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/surveys/feedback/filters/options`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  },
};

export default feedbackReceivedService;
