import supabase from "../config/supabase.js";

/**
 * Add media links for an issue
 * @param {number} issueId - The ID of the issue
 * @param {string[]} mediaLinks - Array of media URLs
 * @returns {Promise<Array>} Array of created media records
 */
export const addMediaLinks = async (issueId, mediaLinks) => {
  if (!mediaLinks || mediaLinks.length === 0) return [];

  try {
    // Prepare media records with their types
    const mediaRecords = mediaLinks.map((link) => ({
      issue_id: issueId,
      media_link: link,
      media_type: getMediaType(link),
    }));

    // Insert all media records in a single transaction
    const { data, error } = await supabase
      .from("issue_media")
      .insert(mediaRecords)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding media links:", error);
    throw error;
  }
};
/**
 * Create a new feedback entry
 * @param {Object} feedbackData - The feedback data to create
 * @returns {Promise<Object>} The created feedback
 */
export const createFeedback = async (feedbackData) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        ...feedbackData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};

/**
 * Get feedback by ID
 * @param {string} id - The feedback ID
 * @returns {Promise<Object>} The feedback data
 */
export const getFeedbackById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching feedback ${id}:`, error);
    throw error;
  }
};

/**
 * Get all feedback for a mentor
 * @param {string} mentorId - The mentor's ID
 * @returns {Promise<Array>} Array of feedback entries
 */
export const getFeedbackByMentor = async (mentorId) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select(
        `
          *,
          sections:section_id (section_name)
        `
      )
      .eq("mentor_id", mentorId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching feedback for mentor ${mentorId}:`, error);
    throw error;
  }
};

/**
 * Update feedback
 * @param {string} id - The feedback ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated feedback
 */
export const updateFeedback = async (id, updates) => {
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
};

/**
 * Delete feedback
 * @param {string} id - The feedback ID to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteFeedback = async (id) => {
  try {
    const { error } = await supabase.from("feedback").delete().eq("id", id);

    if (error) throw error;
    return { success: true, message: "Feedback deleted successfully" };
  } catch (error) {
    console.error(`Error deleting feedback ${id}:`, error);
    throw error;
  }
};

/**
 * Get feedback summary for dashboard
 * @param {string} mentorId - The mentor's ID
 * @returns {Promise<Object>} Summary statistics
 */
export const getFeedbackSummary = async (mentorId) => {
  try {
    const { data, error } = await supabase.rpc("get_feedback_summary", {
      mentor_id: mentorId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching feedback summary:", error);
    throw error;
  }
};

/**
 * Get feedback by date range
 * @param {string} mentorId - The mentor's ID
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @returns {Promise<Array>} Filtered feedback entries
 */
export const getFeedbackByDateRange = async (mentorId, startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("mentor_id", mentorId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching feedback by date range:", error);
    throw error;
  }
};

/**
 * Get all media for a specific issue
 * @param {number} issueId - The ID of the issue
 * @returns {Promise<Array>} Array of media records
 */
export const getMediaByIssueId = async (issueId) => {
  try {
    const { data, error } = await supabase
      .from("issue_media")
      .select("*")
      .eq("issue_id", issueId)
      .order("uploaded_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting media for issue ${issueId}:`, error);
    throw error;
  }
};

/**
 * Delete media by ID
 * @param {number} mediaId - The ID of the media record to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteMedia = async (mediaId) => {
  try {
    const { error } = await supabase
      .from("issue_media")
      .delete()
      .eq("id", mediaId);

    if (error) throw error;
    return { success: true, message: "Media deleted successfully" };
  } catch (error) {
    console.error(`Error deleting media ${mediaId}:`, error);
    throw error;
  }
};

/**
 * Delete all media for an issue
 * @param {number} issueId - The ID of the issue
 * @returns {Promise<Object>} Success message
 */
export const deleteAllMediaForIssue = async (issueId) => {
  try {
    const { error } = await supabase
      .from("issue_media")
      .delete()
      .eq("issue_id", issueId);

    if (error) throw error;
    return {
      success: true,
      message: "All media for issue deleted successfully",
    };
  } catch (error) {
    console.error(`Error deleting media for issue ${issueId}:`, error);
    throw error;
  }
};

/**
 * Update media record
 * @param {number} mediaId - The ID of the media record
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated media record
 */
export const updateMedia = async (mediaId, updates) => {
  try {
    const { data, error } = await supabase
      .from("issue_media")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", mediaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating media ${mediaId}:`, error);
    throw error;
  }
};

/**
 * Helper function to determine media type from URL
 * @param {string} link - The media URL
 * @returns {string} Media type ('image', 'video', or 'other')
 */
function getMediaType(link) {
  if (!link) return "other";
  if (link.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) return "image";
  if (link.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i)) return "video";
  if (link.match(/\.(mp3|wav|ogg|m4a)$/i)) return "audio";
  return "other";
}
