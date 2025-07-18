import api from "../utils/common/axios";

export const getSectionOptions = async () => {
  try {
    const response = await api.get("/options/sections");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSubjectOptions = async () => {
  try {
    const response = await api.get("/options/subjects");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCategoryOptions = async () => {
  try {
    const response = await api.get("/options/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
