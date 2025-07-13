import supabase from "../config/supabase.js";

/**
 * Create a new issue
 * @param {Object} issue - The issue data
 * @returns {Promise<Object>} The created issue
 */
export const createIssue = async (issue) => {
  console.log("inside issues model", issue);
  try {
    const { data, error } = await supabase
      .from("issues")
      .insert({
        type: issue.type,
        issue_title: issue.issue_title,
        description: issue.description,
        status: issue.status || "open", // Default status
        page_link: issue.page_link,
        category_id: issue.category_id,
        subject_id: issue.subject_id,
        student_id: issue.student_id,
        student_name: issue.student_name,
        reported_by: issue.reported_by,
        // Add any other fields from your schema
      })
      .select()
      .single();
    // console.log("created issue", data);
    // console.log("error", error);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

/**
 * Get all issues with optional filters
 * @param {Object} filters - Optional filters for querying issues
 * @returns {Promise<Array>} Array of issues
 */
export const getIssues = async (filters = {}) => {
  try {
    let query = supabase
      .from("issues")
      .select(
        `
        *,
        category:category_id (category_name),
        subject:subject_id (subject_name),
        issue_media (media_link),
        date_submitted
      `
      )
      .order("date_submitted", { ascending: false });
    // console.log("query", query);
    // Apply filters if provided
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.student_id) {
      query = query.eq("student_id", filters.student_id);
    }
    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }
    if (filters.subject_id) {
      query = query.eq("subject_id", filters.subject_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting issues:", error);
    throw error;
  }
};

/**
 * Get a single issue by ID
 * @param {number} id - The issue ID
 * @returns {Promise<Object>} The issue data
 */
export const getIssueById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select(
        `
        *,
        category:category_id (category_name),
        subject:subject_id (subject_name),
        issue_media (media_link,media_type,uploaded_at)
      `
      )
      .eq("id", id)
      .single();
    // console.log("retrun issue details", data);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting issue ${id}:`, error);
    throw error;
  }
};

/**
 * Update an issue
 * @param {number} id - The issue ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated issue
 */
export const updateIssueStatus = async (id, updates) => {
  // console.log("inside update issue status", id, updates);
  try {
    const { data, error } = await supabase
      .from("issues")
      .update({
        status: updates,
        date_submitted: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    // console.log("updated issue", data);
    // console.log("error", error);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating issue ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an issue
 * @param {number} id - The issue ID
 * @returns {Promise<Object>} Success message
 */
export const deleteIssue = async (id) => {
  try {
    const { error } = await supabase.from("issues").delete().eq("id", id);

    if (error) throw error;
    return { success: true, message: "Issue deleted successfully" };
  } catch (error) {
    console.error(`Error deleting issue ${id}:`, error);
    throw error;
  }
};

// Additional helper methods as needed

/**
 * Get issues by status
 * @param {string} status - The status to filter by
 * @returns {Promise<Array>} Array of issues with the specified status
 */
export const getIssuesByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting ${status} issues:`, error);
    throw error;
  }
};

/**
 * Get issues by student ID
 * @param {string} studentId - The student ID
 * @returns {Promise<Array>} Array of issues for the student
 */
export const getIssuesByStudentId = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting issues for student ${studentId}:`, error);
    throw error;
  }
};
