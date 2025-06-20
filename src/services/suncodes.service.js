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

// Create a new sun code
export const createSunCode = async (code, label = "", isActive = true) => {
  const { data, error } = await supabase
    .from("suncodes")
    .insert([{ code, label, is_active: isActive }])
    .select()
    .single();

  if (error) {
    console.error("Error creating sun code:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

// upload multiple sun codes
export const uploadSunCodes = async (sunCodes, label = "") => {
  const { data, error } = await supabase
    .from("suncodes")
    .insert(sunCodes.map((code) => ({ code, label, is_active: true })));

  if (error) {
    console.error("Error uploading sun codes:", error);
    return { success: false, error };
  }

  return { success: true, data, error: null };
};

// Get all sun codes with pagination
export const getAllSunCodes = async (page = 1, limit = 10, search = "") => {
  let query = supabase
    .from("suncodes")
    .select("*", { count: "exact" })
    .order("id", { ascending: false });

  if (search) {
    query = query.or(`code.ilike.%${search}%,label.ilike.%${search}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching sun codes:", error);
    return { data: [], count: 0, error };
  }

  return { data, count, error: null };
};

// Get single sun code by ID
export const getSunCodeById = async (id) => {
  const { data, error } = await supabase
    .from("suncodes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching sun code:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

// Update sun code
export const updateSunCode = async (id, updates) => {
  const { data, error } = await supabase
    .from("suncodes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating sun code:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

// Delete sun code
export const deleteSunCode = async (id) => {
  const { error } = await supabase.from("suncodes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting sun code:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
};

// Bulk delete sun codes
export const bulkDeleteSunCodes = async (ids) => {
  const { error } = await supabase.from("suncodes").delete().in("id", ids);

  if (error) {
    console.error("Error bulk deleting sun codes:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
};

// Bulk update status for multiple sun codes
export const bulkUpdateStatus = async (ids, isActive) => {
  const { data, error } = await supabase
    .from("suncodes")
    .update({ is_active: isActive })
    .in("id", ids)
    .select();

  if (error) {
    console.error("Error bulk updating sun codes status:", error);
    return { success: false, error };
  }

  return { success: true, data, error: null };
};
