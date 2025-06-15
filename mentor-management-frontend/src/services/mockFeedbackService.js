const mockFeedbackData = [
  {
    feedback_id: 1,
    mentor_id: 1,
    mentor_name: "John Doe",
    section: "CCBP 4.0",
    date: "2025-06-13",
    student_engagement: 4,
    overall_performance: 4,
    concern_status: "general",
    positive_notes:
      "Students were actively participating in the discussion. Good understanding of concepts.",
    suggestions: "Could include more practical examples",
    additional_feedback: "Overall good session",
  },
  {
    feedback_id: 2,
    mentor_id: 1,
    mentor_name: "John Doe",
    section: "CCBP 4.0",
    date: "2025-06-14",
    student_engagement: 3,
    overall_performance: 3,
    concern_status: "concern",
    positive_notes: "Basic concepts were clear",
    suggestions: "Need to improve time management",
    additional_feedback: "Some students need extra attention",
  },
  {
    feedback_id: 3,
    mentor_id: 1,
    mentor_name: "John Doe",
    section: "CCBP 4.0",
    date: "2025-06-15",
    student_engagement: 5,
    overall_performance: 5,
    concern_status: "general",
    positive_notes: "Excellent session with great student participation",
    suggestions: "None",
    additional_feedback: "Keep up the good work",
  },
];

export const getFeedbackHistory = async (date) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Format the input date to YYYY-MM-DD
  const formattedInputDate = date.split("T")[0];

  // Filter feedback for the given date
  const feedbackForDate = mockFeedbackData.filter(
    (feedback) => feedback.date === formattedInputDate
  );

  return feedbackForDate;
};

export const submitFeedback = async (feedbackData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Ensure date is in YYYY-MM-DD format
  const formattedDate = feedbackData.date.split("T")[0];

  // Create new feedback object
  const newFeedback = {
    feedback_id: mockFeedbackData.length + 1,
    ...feedbackData,
    date: formattedDate,
  };

  // Add to mock data
  mockFeedbackData.push(newFeedback);

  return newFeedback;
};

export const getAllFeedbackDates = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return all unique dates from mock data, ensuring they're in YYYY-MM-DD format
  return [...new Set(mockFeedbackData.map((feedback) => feedback.date))].sort();
};

export const getFeedbackStats = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const stats = {
    totalFeedback: mockFeedbackData.length,
    averageEngagement:
      mockFeedbackData.reduce((acc, curr) => acc + curr.student_engagement, 0) /
      mockFeedbackData.length,
    averagePerformance:
      mockFeedbackData.reduce(
        (acc, curr) => acc + curr.overall_performance,
        0
      ) / mockFeedbackData.length,
    concernCount: mockFeedbackData.filter((f) => f.concern_status === "concern")
      .length,
    generalCount: mockFeedbackData.filter((f) => f.concern_status === "general")
      .length,
  };

  return stats;
};

export const getFeedbackByDateRange = async (startDate, endDate) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const feedbackInRange = mockFeedbackData.filter((feedback) => {
    const feedbackDate = new Date(feedback.date);
    return (
      feedbackDate >= new Date(startDate) && feedbackDate <= new Date(endDate)
    );
  });

  return feedbackInRange;
};

export const updateFeedback = async (feedbackId, updatedData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockFeedbackData.findIndex((f) => f.feedback_id === feedbackId);
  if (index === -1) {
    throw new Error("Feedback not found");
  }

  mockFeedbackData[index] = {
    ...mockFeedbackData[index],
    ...updatedData,
  };

  return mockFeedbackData[index];
};

export const deleteFeedback = async (feedbackId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockFeedbackData.findIndex((f) => f.feedback_id === feedbackId);
  if (index === -1) {
    throw new Error("Feedback not found");
  }

  const deletedFeedback = mockFeedbackData[index];
  mockFeedbackData.splice(index, 1);

  return deletedFeedback;
};

export default {
  getFeedbackHistory,
  submitFeedback,
  getAllFeedbackDates,
  getFeedbackStats,
  getFeedbackByDateRange,
  updateFeedback,
  deleteFeedback,
};
