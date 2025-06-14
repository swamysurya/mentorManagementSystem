import pool from "../config/db.js";
import bcrypt from "bcrypt";

class User {
  static async getAllUsers() {
    try {
      const query = "SELECT * FROM users_profile";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const query = "SELECT * FROM users_profile WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createUser(userData) {
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
    } = userData;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
      "INSERT INTO users_profile (email, password, role, first_name, last_name, phone_number, profile_picture, is_active, last_login) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    const result = await pool.query(query, [
      email,
      hashedPassword,
      role,
      first_name,
      last_name,
      phone_number,
      profile_picture,
      is_active,
      last_login,
    ]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users_profile WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async updateLastLogin(userId) {
    const query =
      "UPDATE users_profile SET last_login = CURRENT_TIMESTAMP WHERE id = $1";
    await pool.query(query, [userId]);
  }
}

export default User;
