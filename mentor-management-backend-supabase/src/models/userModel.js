import supabase from "../config/supabase.js";
import bcrypt from "bcrypt";

class User {
  // Get all users
  static async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from("users_profile")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from("users_profile")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user
  static async createUser(userData) {
    const {
      email,
      password,
      role,
      first_name,
      last_name,
      phone_number,
      profile_picture,
      is_active = true,
      last_login = null,
    } = userData;

    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const { data, error } = await supabase
        .from("users_profile")
        .insert([
          {
            email,
            password: hashedPassword,
            role,
            first_name,
            last_name,
            phone_number,
            profile_picture,
            is_active,
            last_login,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from("users_profile")
        .select("*")
        .eq("email", email)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found" error
      return data || null;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Update last login
  static async updateLastLogin(userId) {
    try {
      const { error } = await supabase
        .from("users_profile")
        .update({ last_login: new Date() })
        .eq("id", userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

export default User;
