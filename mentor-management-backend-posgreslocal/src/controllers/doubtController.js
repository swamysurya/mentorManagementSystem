import Doubt from "../models/doubtModel.js";

export const createDoubt = async (req, res) => {
  try {
    const mentorId = req.user.userId; // From JWT payload
    const { description, section_id, subject_id, resolution_status, date } =
      req.body;

    // Validate required fields
    if (!description || !section_id || !subject_id || !resolution_status) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const doubtData = {
      description,
      section_id,
      subject_id,
      resolution_status,
      mentor_id: mentorId,
      date: date || new Date(),
    };

    const doubt = await Doubt.createDoubt(doubtData);

    res.status(201).json({
      status: "success",
      data: doubt,
      message: "Doubt created successfully",
    });
  } catch (error) {
    console.error("Error creating doubt:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create doubt",
    });
  }
};

export const deleteDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;
    // console.log(doubtId);
    const mentorId = req.user.userId;

    const deletedDoubt = await Doubt.deleteDoubt(doubtId, mentorId);

    if (!deletedDoubt) {
      return res.status(404).json({
        status: "error",
        message: "Doubt not found or unauthorized",
      });
    }

    res.json({
      status: "success",
      message: "Doubt deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting doubt:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete doubt",
    });
  }
};

export const getDoubts = async (req, res) => {
  try {
    const mentorId = req.user.userId;
    const doubts = await Doubt.getDoubtsByMentor(mentorId);

    res.json({
      status: "success",
      data: doubts,
    });
  } catch (error) {
    console.error("Error fetching doubts:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch doubts",
    });
  }
};
