// src/models/optionModel.js
import supabase from "../config/supabase.js";

/**
 * Get all section options
 * @returns {Promise<Array>} Array of section options
 */
export const getSectionOptions = async () => {
  try {
    const { data, error } = await supabase
      .from("section_options")
      .select("*")
      .order("section_name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting section options:", error);
    throw error;
  }
};

/**
 * Get all subject options
 * @returns {Promise<Array>} Array of subject options
 */
export const getSubjectOptions = async () => {
  try {
    const { data, error } = await supabase
      .from("subject_options")
      .select("*")
      .order("subject_name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting subject options:", error);
    throw error;
  }
};

/**
 * Get all category options
 * @returns {Promise<Array>} Array of category options
 */
export const getCategoryOptions = async () => {
  try {
    const { data, error } = await supabase
      .from("category_options")
      .select("*")
      .order("category_name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting category options:", error);
    throw error;
  }
};

/**
 * Add a new section
 * @param {string} sectionName - Name of the section to add
 * @returns {Promise<Object>} The created section
 */
export const addSection = async (sectionName) => {
  try {
    const { data, error } = await supabase
      .from("section_options")
      .insert([{ section_name: sectionName }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding section:", error);
    throw error;
  }
};
