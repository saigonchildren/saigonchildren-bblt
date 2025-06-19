import { supabase } from "../lib/supabase";
import { generateGroup, defaultConfig } from "../utils/matching_group_algo";

export const getAllMatches = async () => {
  let { data, error } = await supabase.from("matches").select("*");
  if (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
  return data;
};

export const deleteMatchById = async (matchId) => {
  const { data, error } = await supabase
    .from("matches")
    .delete()
    .eq("id", matchId)
    .select();

  if (error) {
    console.error("Error deleting match:", error);
    throw error;
  }
  return data;
};

export const updateMatchById = async (matchId, matchData) => {
  const { data, error } = await supabase
    .from("matches")
    .update(matchData)
    .eq("id", matchId)
    .select();

  if (error) {
    console.error("Error updating match:", error);
    throw error;
  }
  return data;
};

export const createMatch = async (name, config = defaultConfig) => {
  const now = new Date().toISOString();
  const currentYear = new Date().getFullYear();

  // Filter profiles that created matches in the current year
  const { data: profiles, error: profileError } = await supabase
    .from("user_profile")
    .select("*");

  if (profileError) {
    console.error("Error fetching profiles:", profileError);
    throw profileError;
  }

  const profilesInCurrentYear = profiles.filter((profile) => {
    const createdAt = new Date(profile.created_at);
    return createdAt.getFullYear() === currentYear;
  });

  const match_metadata = {
    name,
    created_at: now,
    updated_at: now,
    program_year: currentYear,
  };

  // Create the match
  const { data: matchData, error } = await supabase
    .from("matches")
    .insert([{ match_metadata }])
    .select()
    .single();

  if (error) {
    console.error("Error creating match:", error);
    throw error;
  }

  // Generate groups using the matching algorithm
  try {
    const matchResult = generateGroup(profilesInCurrentYear, name, config);
    console.log("Match result:", matchResult);
    // Save mentorships to the database
    const mentorships = [];

    for (const group of matchResult.groups) {
      for (const mentee of group.mentees) {
        const mentorship_metadata = {
          match_rate: mentee.matchRate,
          group_id: group.id,
          mentor_name: group.mentorName,
          mentee_name: mentee.menteeName,
          created_at: now,
        };
        mentorships.push({
          mentor_id: group.mentorId,
          mentee_id: mentee.menteeId,
          match_id: matchData.id,
          mentorship_metadata,
        });
      }
    }

    // Insert mentorships
    if (mentorships.length > 0) {
      const { error: mentorshipError } = await supabase
        .from("mentorships")
        .insert(mentorships);

      if (mentorshipError) {
        console.error("Error creating mentorships:", mentorshipError);
        throw mentorshipError;
      }
    }
  } catch (matchError) {
    console.error("Error generating matches:", matchError);
    // Continue without failing if matching fails
  }

  return matchData;
};

export const getMatchById = async (matchId) => {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (error) {
    console.error("Error fetching match:", error);
    throw error;
  }
  return data;
};

export const getMentorshipsByMatchId = async (matchId) => {
  const { data, error } = await supabase
    .from("mentorships")
    .select(
      `
      *,
      mentor:mentor_id(id, full_name, email, user_data),
      mentee:mentee_id(id, full_name, email, user_data)
    `
    )
    .eq("match_id", matchId);

  if (error) {
    console.error("Error fetching mentorships:", error);
    throw error;
  }
  return data;
};
