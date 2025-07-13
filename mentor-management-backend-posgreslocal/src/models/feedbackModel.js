import pool from "../config/db.js";

class Feedback {
  static async createFeedback(feedbackData) {
    const {
      mentor_id,
      section_id,
      date,
      student_engagement,
      overall_performance,
      concern_status,
      positive_notes,
      suggestions,
      additional_feedback,
    } = feedbackData;

    const query = `
      INSERT INTO feedback (
        mentor_id, section_id, date, student_engagement, 
        overall_performance, concern_status, positive_notes, 
        suggestions, additional_feedback
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      mentor_id,
      section_id,
      date,
      student_engagement,
      overall_performance,
      concern_status,
      positive_notes,
      suggestions,
      additional_feedback,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getFeedbackByDate(mentor_id, date) {
    const query = `
      SELECT f.*, s.section_name 
      FROM feedback f
      JOIN section_options s ON f.section_id = s.section_id
      WHERE f.mentor_id = $1 AND f.date = $2
      ORDER BY f.created_at DESC
    `;

    const result = await pool.query(query, [mentor_id, date]);
    return result.rows;
  }

  static async getAllFeedbackDates(mentor_id) {
    const query = `
      SELECT DISTINCT date 
      FROM feedback 
      WHERE mentor_id = $1 
      ORDER BY date DESC
    `;

    const result = await pool.query(query, [mentor_id]);
    return result.rows.map((row) => row.date);
  }
}

export default Feedback;
