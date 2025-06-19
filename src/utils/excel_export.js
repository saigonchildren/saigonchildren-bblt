import * as XLSX from "xlsx";

/**
 * Converts camelCase or snake_case string to Title Case
 * @param {string} str - The string to convert
 * @returns {string} - The converted string
 */
const toTitleCase = (str) => {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/^./, (match) => match.toUpperCase()) // Capitalize first letter
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();
};

/**
 * Flattens nested objects with dot notation
 * @param {Object} obj - The object to flatten
 * @param {string} prefix - The prefix for keys
 * @returns {Object} - The flattened object
 */
const flattenObject = (obj, prefix = "") => {
  const flattened = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(value, newKey));
      } else {
        flattened[newKey] = value;
      }
    }
  }

  return flattened;
};

/**
 * Prepares user data for Excel export by flattening user_data and converting column names
 * @param {Array} users - Array of user objects
 * @returns {Array} - Array of flattened user objects with title case headers
 */
export const prepareUsersForExport = (users) => {
  return users.map((user) => {
    // First, flatten the entire user object
    const flattenedUser = flattenObject(user);

    // Create a new object with title case keys
    const exportUser = {};

    for (const key in flattenedUser) {
      const titleCaseKey = toTitleCase(key);
      let value = flattenedUser[key];

      // Handle special formatting for certain fields
      if (key === "created_at" && value) {
        value = new Date(value).toLocaleDateString();
      } else if (Array.isArray(value)) {
        value = value.join(", ");
      } else if (value === null || value === undefined) {
        value = "";
      }

      exportUser[titleCaseKey] = value;
    }

    return exportUser;
  });
};

/**
 * Exports data to Excel file
 * @param {Array} data - The data to export
 * @param {string} filename - The filename (without extension)
 * @param {string} sheetName - The name of the Excel sheet
 */
export const exportToExcel = (
  data,
  filename = "export",
  sheetName = "Sheet1"
) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const columnWidths = [];
    const headers = Object.keys(data[0] || {});

    headers.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...data.map((row) => String(row[header] || "").length)
      );
      columnWidths[index] = { width: Math.min(maxLength + 2, 50) };
    });

    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate and download the file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Excel file "${filename}.xlsx" downloaded successfully`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw new Error("Failed to export data to Excel");
  }
};

/**
 * Exports users data to Excel with proper formatting
 * @param {Array} users - Array of user objects
 * @param {string} filename - The filename (without extension)
 */
export const exportUsersToExcel = (users, filename = "users_export") => {
  const preparedData = prepareUsersForExport(users);
  exportToExcel(preparedData, filename, "Users");
};

/**
 * Exports users data to Excel with separate sheets for Mentors and Mentees
 * Filters out Admin roles
 * @param {Array} users - Array of user objects
 * @param {string} filename - The filename (without extension)
 */
export const exportUsersToExcelByRole = (
  users,
  filename = "users_by_role_export"
) => {
  try {
    // Filter out Admin roles and separate by role
    const mentors = users.filter((user) => user.role === "Mentor");
    const mentees = users.filter((user) => user.role === "Mentee");

    // Prepare data for each role
    const preparedMentors = prepareUsersForExport(mentors);
    const preparedMentees = prepareUsersForExport(mentees);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create worksheets for each role
    if (preparedMentors.length > 0) {
      const mentorWorksheet = XLSX.utils.json_to_sheet(preparedMentors);

      // Auto-size columns for mentors
      const mentorHeaders = Object.keys(preparedMentors[0] || {});
      const mentorColumnWidths = [];

      mentorHeaders.forEach((header) => {
        const maxLength = Math.max(
          header.length,
          ...preparedMentors.map((row) => String(row[header] || "").length)
        );
        mentorColumnWidths.push({ wch: Math.min(maxLength + 2, 30) });
      });

      mentorWorksheet["!cols"] = mentorColumnWidths;
      XLSX.utils.book_append_sheet(workbook, mentorWorksheet, "Mentors");
    }

    if (preparedMentees.length > 0) {
      const menteeWorksheet = XLSX.utils.json_to_sheet(preparedMentees);

      // Auto-size columns for mentees
      const menteeHeaders = Object.keys(preparedMentees[0] || {});
      const menteeColumnWidths = [];

      menteeHeaders.forEach((header) => {
        const maxLength = Math.max(
          header.length,
          ...preparedMentees.map((row) => String(row[header] || "").length)
        );
        menteeColumnWidths.push({ wch: Math.min(maxLength + 2, 30) });
      });

      menteeWorksheet["!cols"] = menteeColumnWidths;
      XLSX.utils.book_append_sheet(workbook, menteeWorksheet, "Mentees");
    }

    // If no mentors or mentees found, create an empty sheet with a message
    if (preparedMentors.length === 0 && preparedMentees.length === 0) {
      const emptyWorksheet = XLSX.utils.json_to_sheet([
        { Message: "No Mentors or Mentees found to export" },
      ]);
      XLSX.utils.book_append_sheet(workbook, emptyWorksheet, "No Data");
    }

    // Generate and download the file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(
      `Excel file "${filename}.xlsx" with separate sheets downloaded successfully`
    );
    console.log(`Mentors: ${mentors.length}, Mentees: ${mentees.length}`);
  } catch (error) {
    console.error("Error exporting users by role to Excel:", error);
    throw new Error("Failed to export users by role to Excel");
  }
};

/**
 * Prepares mentorship data for Excel export by flattening data
 * @param {Array} mentorships - Array of mentorship objects
 * @returns {Array} - Array of flattened mentorship objects
 */
export const prepareMentorshipsForExport = (mentorships) => {
  return mentorships.map((mentorship, index) => {
    const flattenedData = {
      "Pair Number": index + 1,
      "Mentor ID": mentorship.mentor_id || "N/A",
      "Mentor Name": mentorship.mentor?.full_name || "N/A",
      "Mentor Email": mentorship.mentor?.email || "N/A",
      "Mentee ID": mentorship.mentee_id || "N/A",
      "Mentee Name": mentorship.mentee?.full_name || "N/A",
      "Mentee Email": mentorship.mentee?.email || "N/A",
      "Match Rate": mentorship.mentorship_metadata?.match_rate || 0,
      "Group ID": mentorship.mentorship_metadata?.group_id || "N/A",
      "Created At":
        mentorship.mentorship_metadata?.created_at &&
        new Date(
          mentorship.mentorship_metadata.created_at
        ).toLocaleDateString(),
    };

    // Add mentor details
    if (mentorship.mentor?.user_data) {
      const mentorData = mentorship.mentor.user_data;
      flattenedData["Mentor Major"] = mentorData.major || "N/A";
      flattenedData["Mentor Working Field"] = mentorData.working_field || "N/A";
      flattenedData["Mentor Student Year"] = mentorData.student_year || "N/A";
      flattenedData["Mentor Gender"] = mentorData.gender || "N/A";
      flattenedData["Mentor Preferred Mentoring Fields"] = Array.isArray(
        mentorData.prefer_mentoring_field
      )
        ? mentorData.prefer_mentoring_field.join(", ")
        : mentorData.prefer_mentoring_field || "N/A";
      flattenedData["Mentor Soft Skills"] = Array.isArray(
        mentorData.prefer_mentoring_softskills
      )
        ? mentorData.prefer_mentoring_softskills.join(", ")
        : mentorData.prefer_mentoring_softskills || "N/A";
    }

    // Add mentee details
    if (mentorship.mentee?.user_data) {
      const menteeData = mentorship.mentee.user_data;
      flattenedData["Mentee Major"] = menteeData.major || "N/A";
      flattenedData["Mentee Student Year"] = menteeData.student_year || "N/A";
      flattenedData["Mentee Gender"] = menteeData.gender || "N/A";
      flattenedData["Mentee Preferred Mentoring Fields"] = Array.isArray(
        menteeData.prefer_mentoring_fields
      )
        ? menteeData.prefer_mentoring_fields.join(", ")
        : menteeData.prefer_mentoring_fields || "N/A";
      flattenedData["Mentee Soft Skills"] = Array.isArray(
        menteeData.prefer_mentoring_softskills
      )
        ? menteeData.prefer_mentoring_softskills.join(", ")
        : menteeData.prefer_mentoring_softskills || "N/A";
    }

    return flattenedData;
  });
};

/**
 * Exports mentorship data to Excel
 * @param {Array} mentorships - Array of mentorship objects
 * @param {string} matchName - Name of the match
 * @param {string} filename - The filename (without extension)
 */
export const exportMentorshipsToExcel = (
  mentorships,
  matchName,
  filename = "match_details"
) => {
  const preparedData = prepareMentorshipsForExport(mentorships);
  exportToExcel(preparedData, filename, `${matchName} - Mentorships`);
};
