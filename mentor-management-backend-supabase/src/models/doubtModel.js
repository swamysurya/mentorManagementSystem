import pool from "../config/db.js";

class Doubt {
  static async createDoubt(doubtData) {
    const {
      description,
      section_id,
      subject_id,
      resolution_status,
      mentor_id,
      date,
    } = doubtData;

    const query = `
      INSERT INTO student_doubts 
      (description, section_id, subject_id, resolution_status, mentor_id, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      description,
      section_id,
      subject_id,
      resolution_status,
      mentor_id,
      date,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteDoubt(doubtId, mentorId) {
    const query = `
      DELETE FROM student_doubts 
      WHERE doubt_id = $1 AND mentor_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [doubtId, mentorId]);
    return result.rows[0];
  }

  static async getDoubtsByMentor(mentorId) {
    const query = `
      SELECT 
        d.*,
        s.section_name,
        sub.subject_name
      FROM student_doubts d
      JOIN section_options s ON d.section_id = s.section_id
      JOIN subject_options sub ON d.subject_id = sub.subject_id
      WHERE d.mentor_id = $1
      ORDER BY d.date DESC, d.created_at DESC
    `;
    const result = await pool.query(query, [mentorId]);
    return result.rows;
  }
}

export default Doubt;
