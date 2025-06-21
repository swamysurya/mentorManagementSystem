import api from "../utils/axios";

export const issueService = {
  // Create a new issue
  createIssue: async (issueData) => {
    try {
      const response = await api.post("/api/issues", issueData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all issues
  getAllIssues: async () => {
    try {
      const response = await api.get("/api/issues");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get issue by ID
  getIssueById: async (id) => {
    try {
      const response = await api.get(`/api/issues/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update issue status
  updateIssueStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/issues/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
