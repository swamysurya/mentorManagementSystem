// src/controllers/optionController.js
import {
  getSectionOptions as getSections,
  getSubjectOptions as getSubjects,
  getCategoryOptions as getCategories,
  addSection,
} from "../models/optionModel.js";

/**
 * @desc    Get all section options
 * @route   GET /api/options/sections
 * @access  Public
 */

export const getSectionOptions = async (req, res) => {
  console.log("Getting section options");
  try {
    const sections = await getSections();
    res.json({
      status: "success",
      data: sections,
      message: "Section options retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting section options:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get section options",
    });
  }
};

/**
 * @desc    Get all subject options
 * @route   GET /api/options/subjects
 * @access  Public
 */
export const getSubjectOptions = async (req, res) => {
  console.log("Getting subject options");
  try {
    const subjects = await getSubjects();
    res.json({
      status: "success",
      data: subjects,
      message: "Subject options retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting subject options:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get subject options",
    });
  }
};

/**
 * @desc    Get all category options
 * @route   GET /api/options/categories
 * @access  Public
 */
export const getCategoryOptions = async (req, res) => {
  try {
    const categories = await getCategories();
    res.json({
      status: "success",
      data: categories,
      message: "Category options retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting category options:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get category options",
    });
  }
};

/**
 * @desc    Add a new section
 * @route   POST /api/options/sections
 * @access  Private/Admin
 */
export const createSection = async (req, res) => {
  try {
    const { sectionName } = req.body;

    if (!sectionName) {
      return res.status(400).json({
        status: "error",
        message: "Section name is required",
      });
    }

    const newSection = await addSection(sectionName);

    res.status(201).json({
      status: "success",
      data: newSection,
      message: "Section added successfully",
    });
  } catch (error) {
    console.error("Error adding section:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to add section",
    });
  }
};
