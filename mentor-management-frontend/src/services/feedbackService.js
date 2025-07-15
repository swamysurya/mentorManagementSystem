// src/services/feedbackService.js
import api from "../utils/common/axios";

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post("/feedback/", feedbackData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFeedbackHistory = async (date) => {
  try {
    const response = await api.get("/feedback/history", {
      params: { date },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllFeedbackDates = async () => {
  try {
    const response = await api.get("/feedback/dates");
    // Ensure we're returning an array of dates
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
