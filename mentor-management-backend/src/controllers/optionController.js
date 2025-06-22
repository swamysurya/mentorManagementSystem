import db from "../config/db.js";

export const getSectionOptions = async (req, res) => {
  try {
    const query = `
      SELECT * FROM section_options
    `;
    const result = await db.query(query);

    res.json({
      status: "success",
      data: result.rows,
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

export const getSubjectOptions = async (req, res) => {
  try {
    const query = `
      SELECT * FROM subject_options
    `;
    const result = await db.query(query);

    res.json({
      status: "success",
      data: result.rows,
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

export const getCategoryOptions = async (req, res) => {
  try {
    const query = `
      SELECT * FROM category_options
    `;
    const result = await db.query(query);

    res.json({
      status: "success",
      data: result.rows,
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
