import { create } from 'zustand';
import surveyQuestionsService from '../services/surveyQuestionsService';

const useSurveyQuestionsStore = create((set, get) => ({
  // State
  surveyQuestions: [],
  currentSurveyQuestion: null,
  loading: false,
  error: null,

  // Actions
  
  // Fetch all survey questions
  fetchSurveyQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const surveyQuestions = await surveyQuestionsService.findAll();
      set({
        surveyQuestions,
        loading: false,
        error: null,
      });
      return { success: true, data: surveyQuestions };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch survey questions';
      set({
        loading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch a single survey question
  fetchSurveyQuestion: async (id) => {
    set({ loading: true, error: null });
    try {
      const surveyQuestion = await surveyQuestionsService.findOne(id);
      set({
        currentSurveyQuestion: surveyQuestion,
        loading: false,
        error: null,
      });
      return { success: true, data: surveyQuestion };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch survey question';
      set({
        loading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Create a new survey question
  createSurveyQuestion: async (questionData) => {
    set({ loading: true, error: null });
    try {
      const response = await surveyQuestionsService.create(questionData);
      const newSurveyQuestion = response.surveyQuestion;
      
      // Add to survey questions list
      set((state) => ({
        surveyQuestions: [...state.surveyQuestions, newSurveyQuestion],
        loading: false,
        error: null,
      }));
      
      return { success: true, data: newSurveyQuestion, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create survey question';
      set({
        loading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Update a survey question
  updateSurveyQuestion: async (id, questionData) => {
    set({ loading: true, error: null });
    try {
      const response = await surveyQuestionsService.update(id, questionData);
      const updatedSurveyQuestion = response.surveyQuestion;
      
      // Update in survey questions list
      set((state) => ({
        surveyQuestions: state.surveyQuestions.map((q) =>
          q.surveyQuestionId === id ? updatedSurveyQuestion : q
        ),
        currentSurveyQuestion: state.currentSurveyQuestion?.surveyQuestionId === id ? updatedSurveyQuestion : state.currentSurveyQuestion,
        loading: false,
        error: null,
      }));
      
      return { success: true, data: updatedSurveyQuestion, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update survey question';
      set({
        loading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Delete a survey question
  deleteSurveyQuestion: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await surveyQuestionsService.remove(id);
      
      // Remove from survey questions list
      set((state) => ({
        surveyQuestions: state.surveyQuestions.filter((q) => q.surveyQuestionId !== id),
        currentSurveyQuestion: state.currentSurveyQuestion?.surveyQuestionId === id ? null : state.currentSurveyQuestion,
        loading: false,
        error: null,
      }));
      
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete survey question';
      set({
        loading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Clear current survey question
  clearCurrentSurveyQuestion: () => {
    set({ currentSurveyQuestion: null });
  },

  // Reset store
  reset: () => {
    set({
      surveyQuestions: [],
      currentSurveyQuestion: null,
      loading: false,
      error: null,
    });
  },
}));

export default useSurveyQuestionsStore;
