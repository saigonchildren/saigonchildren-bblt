// Helper function to find common elements between two arrays
function findCommonElement(arr1, arr2) {
  if (!arr1 || !arr2) return [];
  return arr1.filter((item) => arr2.includes(item));
}

// Helper function to generate UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Default configuration for matching criteria points
export const defaultConfig = {
  majorWorkingFieldMatch: 2,
  commonFieldsPerMatch: 1,
  commonSoftSkillsPerMatch: 2,
  genderPreferenceExact: 1,
  genderPreferenceFlexible: 0.5,
  studentYearMatch: 1,
  workingStyleExact: 1,
  workingStyleFlexible: 0.5,
};

function calculateMatchingRate(mentee, mentor, config = defaultConfig) {
  let totalPoints = 0;

  // Merge user config with default config
  const matchConfig = { ...defaultConfig, ...config };

  // Check if mentee's major matches mentor's working field
  if (mentee.user_data.major === mentor.user_data.working_field) {
    totalPoints += matchConfig.majorWorkingFieldMatch;
  }

  // Find common mentoring fields
  const commonFields = findCommonElement(
    mentee.user_data.prefer_mentoring_fields,
    mentor.user_data.prefer_mentoring_field
  );
  totalPoints += commonFields.length * matchConfig.commonFieldsPerMatch;

  // Find common soft skills
  const commonSoftSkills = findCommonElement(
    mentee.user_data.prefer_mentoring_softskills,
    mentor.user_data.prefer_mentoring_softskills
  );
  totalPoints += commonSoftSkills.length * matchConfig.commonSoftSkillsPerMatch;

  // Gender preference matching
  if (
    mentee.user_data.prefer_mentor_gender === "No Preference" ||
    mentee.user_data.prefer_mentor_gender === "" ||
    mentor.user_data.prefer_mentee_gender === "No Preference" ||
    mentor.user_data.prefer_mentee_gender === ""
  ) {
    totalPoints += matchConfig.genderPreferenceFlexible;
  } else if (
    mentee.user_data.prefer_mentor_gender ===
    mentor.user_data.prefer_mentee_gender
  ) {
    totalPoints += matchConfig.genderPreferenceExact;
  }

  // Student year matching
  if (mentee.user_data.student_year === mentor.user_data.student_year) {
    totalPoints += matchConfig.studentYearMatch;
  }

  // Working style compatibility
  const menteeWorkingStyle = mentee.user_data.prefer_mentor_working_style;
  const mentorWorkingStyle = mentor.user_data.prefer_mentee_working_style;

  if (
    menteeWorkingStyle === "Flexible Approach" ||
    mentorWorkingStyle === "Flexible Approach"
  ) {
    totalPoints += matchConfig.workingStyleFlexible;
  } else if (
    (menteeWorkingStyle === "Needs Guidance" &&
      mentorWorkingStyle === "Needs Guidance") ||
    (menteeWorkingStyle === "Self-motivated" &&
      mentorWorkingStyle === "Self-motivated")
  ) {
    totalPoints += matchConfig.workingStyleExact;
  }

  return totalPoints;
}

export function generateGroup(users, matchName = null, config = defaultConfig) {
  // Separate mentees and mentors
  const mentees = users.filter((user) => user.role === "Mentee");
  const mentors = users.filter((user) => user.role === "Mentor");

  if (mentors.length === 0) {
    throw new Error("No mentors available for matching");
  }

  if (mentees.length === 0) {
    throw new Error("No mentees available for matching");
  }

  const groups = [];
  const candidates = [];

  // Calculate maximum group size
  const maxGroupSize = Math.ceil(mentees.length / mentors.length);
  console.log("max_group_size:", maxGroupSize);

  // Generate all possible mentor-mentee combinations with scores
  for (const mentor of mentors) {
    for (const mentee of mentees) {
      const score = calculateMatchingRate(mentee, mentor, config);
      candidates.push({
        mentee: mentee,
        mentor: mentor,
        score: score,
      });
    }
  }

  // Sort candidates by score in descending order
  candidates.sort((a, b) => b.score - a.score);

  // Create a copy of mentees for tracking unmatched ones
  let unmatchedMentees = [...mentees];
  let targetMentorIndex = 0;

  // Assign mentees to mentors
  while (unmatchedMentees.length > 0) {
    const currentMentor = mentors[targetMentorIndex];

    const group = {
      id: targetMentorIndex,
      mentorId: currentMentor.id,
      mentorName: currentMentor.full_name,
      mentees: [],
    };

    // Find best matches for current mentor
    const mentorCandidates = candidates.filter(
      (candidate) =>
        candidate.mentor.id === currentMentor.id &&
        unmatchedMentees.some((mentee) => mentee.id === candidate.mentee.id)
    );

    // Add mentees to group up to max group size
    for (const candidate of mentorCandidates) {
      if (group.mentees.length >= maxGroupSize) break;

      const matchMentee = {
        menteeId: candidate.mentee.id,
        menteeName: candidate.mentee.full_name,
        matchRate: candidate.score,
      };

      group.mentees.push(matchMentee);

      // Remove mentee from unmatched list
      unmatchedMentees = unmatchedMentees.filter(
        (mentee) => mentee.id !== candidate.mentee.id
      );
    }

    groups.push(group);

    // Move to next mentor
    targetMentorIndex = (targetMentorIndex + 1) % mentors.length;
  }

  // Create final match object
  const newMatch = {
    uid: generateUUID(),
    createdAt: new Date().toISOString(),
    groups: groups,
    matchName: matchName || `Match ${new Date().toLocaleString()}`,
  };

  return newMatch;
}

export { calculateMatchingRate, findCommonElement };
