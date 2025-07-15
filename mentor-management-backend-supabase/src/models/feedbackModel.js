import supabase from "../config/supabase.js";

class Feedback {
  /**
   * Create a new feedback entry
   * @param {Object} feedbackData - Feedback data to be inserted
   * @returns {Promise<Object>} Created feedback record
   */
  static async createFeedback(feedbackData) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .insert([
          {
            ...feedbackData,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw error;
    }
  }

  /**
   * Get feedback by ID
   * @param {number} id - Feedback ID
   * @returns {Promise<Object>} Feedback record
   */
  static async getFeedbackById(id) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting feedback ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all feedback for a mentor
   * @param {number} mentorId - Mentor ID
   * @returns {Promise<Array>} Array of feedback records
   */
  static async getFeedbackByMentor(mentorId) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("mentor_id", mentorId)
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting feedback for mentor ${mentorId}:`, error);
      throw error;
    }
  }

  /**
   * Get feedback by section
   * @param {number} sectionId - Section ID
   * @returns {Promise<Array>} Array of feedback records
   */
  static async getFeedbackBySection(sectionId) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("section_id", sectionId)
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting feedback for section ${sectionId}:`, error);
      throw error;
    }
  }

  /**
   * Update feedback
   * @param {number} id - Feedback ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated feedback record
   */
  static async updateFeedback(id, updates) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating feedback ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete feedback
   * @param {number} id - Feedback ID
   * @returns {Promise<Object>} Deleted feedback record
   */
  static async deleteFeedback(id) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error deleting feedback ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all feedback for a specific mentor
   * @param {string} mentorId - The ID of the mentor
   * @param {Object} options - Additional options (startDate, endDate, limit)
   * @returns {Promise<Array>} Array of feedback records
   */
  static async getFeedbackByMentorId(mentorId, options = {}) {
    try {
      if (!mentorId) {
        throw new Error("Mentor ID is required");
      }

      let query = supabase
        .from("feedback")
        .select(
          `
          *,
          section_options:section_id (
            section_name
          )
        `
        )
        .eq("mentor_id", mentorId)
        .order("date", { ascending: false });

      // Apply date range filter if provided
      if (options.startDate && options.endDate) {
        query = query
          .gte("date", options.startDate)
          .lte("date", options.endDate);
      }

      // Apply limit if provided
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error getting feedback for mentor ${mentorId}:`, error);
      throw error;
    }
  }

  /**
   * Get all feedback with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Filtered feedback records
   */
  static async getAllFeedback(filters = {}) {
    try {
      let query = supabase
        .from("feedback")
        .select("*")
        .order("date", { ascending: false });

      // Apply filters if provided
      if (filters.mentor_id) {
        query = query.eq("mentor_id", filters.mentor_id);
      }
      if (filters.section_id) {
        query = query.eq("section_id", filters.section_id);
      }
      if (filters.start_date && filters.end_date) {
        query = query
          .gte("date", filters.start_date)
          .lte("date", filters.end_date);
      }
      if (filters.concern_status) {
        query = query.eq("concern_status", filters.concern_status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting all feedback:", error);
      throw error;
    }
  }

  /**
   * Get feedback for a specific mentor and date
   * @param {number} mentorId - Mentor ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of feedback records with section names
   */
  static async getFeedbackByDate(mentorId, date) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select(
          `
          *,
          section_options:section_id (
            section_name
          )
        `
        )
        .eq("mentor_id", mentorId)
        .eq("date", date)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        `Error getting feedback for mentor ${mentorId} on ${date}:`,
        error
      );
      throw error;
    }
  }
}

export default Feedback;
