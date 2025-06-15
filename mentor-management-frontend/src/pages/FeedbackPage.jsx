// src/pages/FeedbackPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Calendar from "../components/Calendar";
import "../assets/styles/feedback.css";
import {
  getFeedbackHistory,
  submitFeedback,
  getAllFeedbackDates,
} from "../services/feedbackService";
import { getSectionOptions } from "../services/optionService";
import { format, isAfter } from "date-fns";

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    section_id: "",
    date: new Date().toISOString().split("T")[0],
    studentEngagement: 3,
    overallPerformance: 3,
    concernStatus: "general",
    positiveNotes: "",
    suggestions: "",
    additionalFeedback: "",
  });

  const [sectionOptions, setSectionOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [allFeedbackDates, setAllFeedbackDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch section options when component mounts
  useEffect(() => {
    const fetchSectionOptions = async () => {
      try {
        const response = await getSectionOptions();
        // Check if the response has a data property
        const options = response.data || response;
        // Ensure options is an array
        setSectionOptions(Array.isArray(options) ? options : []);
      } catch (err) {
        console.error("Error fetching section options:", err);
        setError("Failed to load section options");
        setSectionOptions([]); // Set empty array on error
      }
    };

    fetchSectionOptions();
  }, []);

  // Fetch all feedback dates when component mounts
  useEffect(() => {
    const fetchAllFeedbackDates = async () => {
      try {
        const response = await getAllFeedbackDates();
        // Check if the response has a data property
        const dates = response.data || response;
        // Ensure dates is an array and format them consistently
        const formattedDates = Array.isArray(dates)
          ? dates.map((date) => format(new Date(date), "yyyy-MM-dd"))
          : [];
        setAllFeedbackDates(formattedDates);
      } catch (err) {
        console.error("Error fetching all feedback dates:", err);
        setAllFeedbackDates([]); // Set empty array on error
      }
    };

    fetchAllFeedbackDates();
  }, []);

  // Fetch feedback history when selected date changes
  useEffect(() => {
    const fetchFeedbackHistory = async () => {
      try {
        setLoading(true);
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await getFeedbackHistory(formattedDate);
        setFeedbackHistory(response.data || []);
      } catch (err) {
        setError("Failed to load feedback history");
        console.error("Error fetching feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackHistory();
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      date: format(date, "yyyy-MM-dd"),
    }));
  };

  const handleBack = () => {
    navigate("/mentor");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAfter(selectedDate, new Date())) {
      alert("Cannot submit feedback for future dates");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const feedbackData = {
        section_id: parseInt(formData.section_id),
        date: formattedDate,
        student_engagement: formData.studentEngagement,
        overall_performance: formData.overallPerformance,
        concern_status: formData.concernStatus,
        positive_notes: formData.positiveNotes,
        suggestions: formData.suggestions,
        additional_feedback: formData.additionalFeedback,
      };

      const response = await submitFeedback(feedbackData);

      // Update feedback history
      setFeedbackHistory((prev) => [response.data, ...prev]);

      // Update all feedback dates
      setAllFeedbackDates((prev) => {
        const newDates = [...prev, formattedDate];
        // Remove duplicates and sort
        return [...new Set(newDates)].sort();
      });

      setIsSubmitted(true);

      // Reset form after successful submission
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          section_id: "",
          date: formattedDate,
          studentEngagement: 3,
          overallPerformance: 3,
          concernStatus: "general",
          positiveNotes: "",
          suggestions: "",
          additionalFeedback: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading feedback history...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (feedbackHistory.length > 0) {
      return (
        <div className="feedback-history">
          <h2>Feedback for {format(selectedDate, "MMMM d, yyyy")}</h2>
          <div className="feedback-list">
            {feedbackHistory.map((feedback) => (
              <div key={feedback.feedback_id} className="feedback-item">
                <div className="feedback-header">
                  <h3>{feedback.section_name}</h3>
                  <span
                    className={`status ${feedback.concern_status.toLowerCase()}`}
                  >
                    {feedback.concern_status}
                  </span>
                </div>
                <div className="feedback-ratings">
                  <div>Student Engagement: {feedback.student_engagement}/5</div>
                  <div>
                    Overall Performance: {feedback.overall_performance}/5
                  </div>
                </div>
                {feedback.positive_notes && (
                  <div className="feedback-section">
                    <h4>Positive Notes:</h4>
                    <p>{feedback.positive_notes}</p>
                  </div>
                )}
                {feedback.suggestions && (
                  <div className="feedback-section">
                    <h4>Suggestions:</h4>
                    <p>{feedback.suggestions}</p>
                  </div>
                )}
                {feedback.additional_feedback && (
                  <div className="feedback-section">
                    <h4>Additional Feedback:</h4>
                    <p>{feedback.additional_feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="section">Section</label>
          <select
            id="section"
            value={formData.section_id}
            onChange={(e) =>
              setFormData({ ...formData, section_id: e.target.value })
            }
            required
            className="concern-status-select"
          >
            <option value="">Select a section</option>
            {sectionOptions.map((section) => (
              <option key={section.section_id} value={section.section_id}>
                {section.section_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Student Engagement</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                className={`rating-button ${
                  formData.studentEngagement === rating ? "selected" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, studentEngagement: rating })
                }
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Overall Performance</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                className={`rating-button ${
                  formData.overallPerformance === rating ? "selected" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, overallPerformance: rating })
                }
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="concernStatus">
            Status of the Concern/Irregularity
          </label>
          <select
            id="concernStatus"
            value={formData.concernStatus}
            onChange={(e) =>
              setFormData({ ...formData, concernStatus: e.target.value })
            }
            required
            className="concern-status-select"
          >
            <option value="critical">Critical</option>
            <option value="general">General</option>
            <option value="positive">Positive</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="positiveNotes">Positive Notes</label>
          <textarea
            id="positiveNotes"
            value={formData.positiveNotes}
            onChange={(e) =>
              setFormData({ ...formData, positiveNotes: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="suggestions">Suggestions</label>
          <textarea
            id="suggestions"
            value={formData.suggestions}
            onChange={(e) =>
              setFormData({ ...formData, suggestions: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalFeedback">Additional Feedback</label>
          <textarea
            id="additionalFeedback"
            value={formData.additionalFeedback}
            onChange={(e) =>
              setFormData({ ...formData, additionalFeedback: e.target.value })
            }
          />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>

        {isSubmitted && (
          <div className="success-message">
            Feedback submitted successfully!
          </div>
        )}
      </form>
    );
  };

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <button onClick={handleBack} className="back-button">
            <svg
              className="back-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1>Daily Classroom Feedback</h1>
        </div>

        <div className="feedback-container">
          <div className="calendar-section">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              feedbackDates={allFeedbackDates}
            />
          </div>

          <div className="content-section">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
