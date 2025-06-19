import { supabase } from "../lib/supabase";

export const isSunCodeValid = async (sunCode) => {
  let { data, error } = await supabase
    .from("suncodes")
    .select("*")
    .eq("is_active", true)
    .eq("code", sunCode)
    .single();
  if (error) {
    console.error("Error fetching sun code:", error);
    return false;
  }
  return data ? true : false;
};

export const sunCodeUsed = async (sunCode) => {
  const { error } = await supabase
    .from("suncodes")
    .update({ is_active: false })
    .eq("code", sunCode);
  if (error) {
    console.error("Error updating sun code:", error);
    return false;
  }
  return true;
};

// upload multiple sun codes
export const uploadSunCodes = async (sunCodes) => {
  const { data, error } = await supabase
    .from("suncodes")
    .insert(sunCodes.map((code) => ({ code, is_active: true })));
  if (error) {
    console.error("Error uploading sun codes:", error);
    return false;
  }
  return data;
};
