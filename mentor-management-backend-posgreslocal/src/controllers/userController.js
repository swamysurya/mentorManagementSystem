// src/controllers/userController.js
import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({
      status: "success",
      data: users,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching users",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      data: user,
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching user",
    });
  }
};

export const createUser = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const {
      email,
      password,
      role,
      first_name,
      last_name,
      phone_number,
      profile_picture,
      is_active,
      last_login,
    } = req.body;
    const user = await User.createUser({
      email,
      password,
      role,
      first_name,
      last_name,
      phone_number,
      profile_picture,
      is_active,
      last_login,
    });
    res.status(201).json({
      status: "success",
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
