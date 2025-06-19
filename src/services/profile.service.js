import { supabase } from "../lib/supabase.js";

export const getProfileCount = async () => {
  try {
    const { count, error } = await supabase
      .from("user_profile")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching profile count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getProfileCount:", error);
    return 0;
  }
};

export const getAllProfiles = async () => {
  try {
    const { data, error } = await supabase.from("user_profile").select("*");

    if (error) {
      console.error("Error fetching profiles:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllProfiles:", error);
    return [];
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from("user_profile")
      .update(profileData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { success: false, error: error.message };
  }
};
