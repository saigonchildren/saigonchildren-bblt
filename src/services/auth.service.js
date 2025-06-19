import { use } from "react";
import { supabase } from "../lib/supabase";
export const loginWithEmailAndPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // get user profile after login
  if (error) {
    console.error("Login error:", error);
    return null;
  }
  return data;
};

export const countUserProfiles = async () => {
  const { count, error } = await supabase
    .from("user_profile")
    .select("*", { count: "exact" });

  if (error) {
    console.error("Error counting user profiles:", error);
    return null;
  }
  return count;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
    return false;
  }
  return true;
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data;
};

export const getAllUserProfiles = async () => {
  const { data, error } = await supabase.from("user_profile").select("*");
  if (error) {
    console.error("Error fetching users:", error);
    return null;
  }
  return data;
};

export const signUp = async (
  email,
  password,
  full_name,
  role,
  user_data,
  phone_number
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Registration error:", error);
    if (error.status === 422) {
      return { error: "Email already exists. Please log in." };
    } else return { error: error.message };
  }

  let user_id = data.user.id;
  // // Create user profile
  const { data: data_response_profile, error: profileError } = await supabase
    .from("user_profile")
    .insert([
      {
        id: user_id,
        full_name,
        role,
        user_data,
        email: email,
        phone_number,
      },
    ]);

  if (profileError) {
    return { error: profileError.message };
  }

  return {
    data: data.user,
  };
};
