const mentorProfile = {
  id: "id",
  full_name: "Full name",
  role: "Role",
  phone_number: "Phone number",
  email: "Email",
};

// flattern
const userDataMapper = (user) => {
  if (!user) return null;

  const { id, full_name, role, phone_number, email } = user;

  return {
    id,
    full_name,
    role,
    phone_number,
    email,
  };
};
