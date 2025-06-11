// src/pages/FeedbackPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/styles/feedback.css';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'manikantaswamy.amjuri@nxtwave.co.in',
    mentorName: '',
    section: '',
    date: new Date().toISOString().split('T')[0],
    studentEngagement: 3,
    overallPerformance: 3,
    concernStatus: 'general',
    positiveNotes: '',
    suggestions: '',
    additionalFeedback: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace this with actual API call
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage for now (temporary solution)
      const existingFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      const newFeedback = {
        ...formData,
        id: Date.now(),
        submittedAt: new Date().toISOString()
      };
      existingFeedbacks.push(newFeedback);
      localStorage.setItem('feedbacks', JSON.stringify(existingFeedbacks));

      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          ...formData,
          mentorName: '',
          section: '',
          date: new Date().toISOString().split('T')[0],
          studentEngagement: 3,
          overallPerformance: 3,
          concernStatus: 'general',
          positiveNotes: '',
          suggestions: '',
          additionalFeedback: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/mentor');
  };

  if (isSubmitted) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="page-content">
          <div className="success-message">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Thank You!</h2>
            <p>Your feedback has been successfully submitted.</p>
            <p className="success-note">You'll be redirected to a new form in a moment...</p>
          </div>
        </main>
      </div>
    );
  }

  // Rest of your existing form JSX...
  // Add isSubmitting state to the submit button:

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
          <h1>Daily Classroom Feedback Form</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="feedback-form">
          
          <div className="form-header">
            <div className="email-display">
              {formData.email}
              <span className="email-note">Switch account</span>
            </div>
            <p className="required-note">* Indicates required question</p>
          </div>

          {/* Email Section - Displayed but not editable */}
          <div className="form-section">
            <label className="question-label">
              Email
              <span className="required-star">*</span>
            </label>
            <div className="email-field">
              <span>{formData.email}</span>
            </div>
          </div>

          {/* Mentor Name */}
          <div className="form-section">
            <label className="question-label">
              Mentor Name
            </label>
            <input
              type="text"
              value={formData.mentorName}
              onChange={(e) => handleChange('mentorName', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Section */}
          <div className="form-section">
            <label className="question-label">
              Section
              <span className="required-star">*</span>
            </label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => handleChange('section', e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* Date */}
          <div className="form-section">
            <label className="question-label">
              Date
              <span className="required-star">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* Student Engagement Rating */}
          <div className="form-section">
            <label className="question-label">
              How was the overall engagement of students in class today?
              <span className="required-star">*</span>
            </label>
            <div className="rating-scale">
              <div className="scale-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
              <div className="scale-options">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="rating-option">
                    <input
                      type="radio"
                      name="studentEngagement"
                      value={num}
                      checked={formData.studentEngagement === num}
                      onChange={(e) => handleChange('studentEngagement', Number(e.target.value))}
                      required
                    />
                    <span>{num}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Performance Rating */}
          <div className="form-section">
            <label className="question-label">
              How would you rate the overall performance of students today?
              <span className="required-star">*</span>
            </label>
            <div className="rating-scale">
              <div className="scale-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
              <div className="scale-options">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="rating-option">
                    <input
                      type="radio"
                      name="overallPerformance"
                      value={num}
                      checked={formData.overallPerformance === num}
                      onChange={(e) => handleChange('overallPerformance', Number(e.target.value))}
                      required
                    />
                    <span>{num}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Concerns Status */}
          <div className="form-section">
            <label className="question-label">
              Did you notice any irregularities or concerns (e.g., distractions, behavioral issues)?
            </label>
            <div className="radio-group">
              {['Critical', 'General', 'Positive'].map((status) => (
                <label key={status} className="radio-option">
                  <input
                    type="radio"
                    name="concernStatus"
                    value={status.toLowerCase()}
                    checked={formData.concernStatus === status.toLowerCase()}
                    onChange={(e) => handleChange('concernStatus', e.target.value)}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Positive Notes */}
          <div className="form-section">
            <label className="question-label">
              What went well in class today? (e.g., active participation, breakthroughs in understanding)
            </label>
            <textarea
              value={formData.positiveNotes}
              onChange={(e) => handleChange('positiveNotes', e.target.value)}
              className="form-textarea"
              rows="4"
            />
          </div>

          {/* Suggestions */}
          <div className="form-section">
            <label className="question-label">
              Do you have any suggestions or actions to improve the class experience?
            </label>
            <textarea
              value={formData.suggestions}
              onChange={(e) => handleChange('suggestions', e.target.value)}
              className="form-textarea"
              rows="4"
            />
          </div>

          {/* Additional Feedback */}
          <div className="form-section">
            <label className="question-label">
              Any additional feedback or notes?
            </label>
            <textarea
              value={formData.additionalFeedback}
              onChange={(e) => handleChange('additionalFeedback', e.target.value)}
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FeedbackPage;

