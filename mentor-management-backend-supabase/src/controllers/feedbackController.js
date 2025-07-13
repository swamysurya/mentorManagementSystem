import Feedback from "../models/feedbackModel.js";

export const submitFeedback = async (req, res) => {
  try {
    const {
      section_id,
      date,
      student_engagement,
      overall_performance,
      concern_status,
      positive_notes,
      suggestions,
      additional_feedback,
    } = req.body;

    const mentor_id = req.user.userId;

    const feedbackData = {
      mentor_id,
      section_id,
      date,
      student_engagement,
      overall_performance,
      concern_status,
      positive_notes,
      suggestions,
      additional_feedback,
    };

    const feedback = await Feedback.createFeedback(feedbackData);

    res.status(201).json({
      status: "success",
      data: feedback,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to submit feedback",
    });
  }
};

export const getFeedbackHistory = async (req, res) => {
  try {
    const { date } = req.query;
    const mentor_id = req.user.userId;

    const feedback = await Feedback.getFeedbackByDate(mentor_id, date);

    res.json({
      status: "success",
      data: feedback,
      message: "Feedback history retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch feedback history",
    });
  }
};

export const getAllFeedbackDates = async (req, res) => {
  try {
    const mentor_id = req.user.userId;
    const dates = await Feedback.getAllFeedback(mentor_id);

    res.json({
      status: "success",
      data: dates,
      message: "Feedback dates retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching feedback dates:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch feedback dates",
    });
  }
};
