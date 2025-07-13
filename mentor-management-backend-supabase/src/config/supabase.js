import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables");
}

// Initialize Supabase client with auth settings
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Set to true if you want to persist the session in local storage
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        return new Promise((resolve) => {
          // Handle session storage if needed
          resolve(null);
        });
      },
      setItem: (key, value) => {
        return new Promise((resolve) => {
          // Handle session storage if needed
          resolve(null);
        });
      },
      removeItem: (key) => {
        return new Promise((resolve) => {
          // Handle session storage if needed
          resolve(null);
        });
      },
    },
  },
  // Global options
  db: {
    schema: "public", // default schema
  },
});

export default supabase;
