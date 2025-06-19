import React, { useState } from 'react'
import { MultiStepForm } from '../../components/MultiStepForm'
import { isSunCodeValid } from '../../services/suncodes.service'
import { signUp } from '../../services/auth.service';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [sunCodeValidation, setSunCodeValidation] = useState({
        message: '',
        status: null // null, 'success', 'error', 'loading'
    });

    const validateSunCode = async (sunCode) => {
        if (!sunCode || sunCode.trim() === '') {
            setSunCodeValidation({
                message: 'Please enter a SUN ID to validate',
                status: 'error'
            });
            return;
        }

        setSunCodeValidation({
            message: 'Validating SUN ID...',
            status: 'loading'
        });

        try {
            const isValid = await isSunCodeValid(sunCode.trim());

            if (isValid) {
                setSunCodeValidation({
                    message: '✓ Valid SUN ID - Code is active and available',
                    status: 'success'
                });
            } else {
                setSunCodeValidation({
                    message: '✗ Invalid or inactive SUN ID. Please check your code or contact administration.',
                    status: 'error'
                });
            }
        } catch (error) {
            console.error('SUN code validation error:', error);
            setSunCodeValidation({
                message: '✗ Error validating SUN ID. Please check your connection and try again.',
                status: 'error'
            });
        }
    }; const getMenteeFormSteps = () => [{
        title: "Personal Information",
        description: "Basic details and account setup",
        fields: [
            { name: "full_name", label: "Full Name", type: "text", required: true },
            { name: "role", label: "Role", type: "select", options: ["Mentee"], required: true, placeholder: "Select your role" },
            { name: "phone_number", label: "Phone Number", type: "tel", required: true }
        ]
    },
    {
        title: "Academic Information",
        description: "Your educational background",
        fields: [
            {
                name: "student_year",
                label: "Year of Study",
                type: "select",
                options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Other"],
                required: true
            },
            {
                name: "university",
                label: "University",
                type: "select",
                options: [
                    "Vietnam National University, Ho Chi Minh City",
                    "University of Technology - VNU-HCM",
                    "University of Science - VNU-HCM",
                    "Ho Chi Minh City University of Technology (HCMUT)",
                    "Ho Chi Minh City University of Medicine and Pharmacy",
                    "University of Economics Ho Chi Minh City (UEH)",
                    "Ho Chi Minh City University of Education",
                    "Ho Chi Minh City University of Social Sciences and Humanities",
                    "Ton Duc Thang University",
                    "RMIT University Vietnam",
                    "FPT University Ho Chi Minh City",
                    "International University - VNU-HCM",
                    "Ho Chi Minh City Open University",
                    "University of Finance - Marketing",
                    "Saigon University",
                    "Other"
                ],
                required: true
            },
            { name: "major", label: "Major", type: "text", required: true }
        ]
    },
    {
        title: "Current Status",
        description: "Your internship and work status",
        fields: [
            {
                name: "is_internship",
                label: "Currently in Internship?",
                type: "radio",
                options: ["Yes", "No"],
                required: true
            },
            {
                name: "internship_position",
                label: "Internship Position",
                type: "text",
                conditional: { field: "is_internship", value: "Yes" }
            },
            {
                name: "internship_company",
                label: "Internship Company",
                type: "text",
                conditional: { field: "is_internship", value: "Yes" }
            }
        ]
    },
    {
        title: "Mentoring Preferences",
        description: "What you're looking for in a mentor",
        fields: [
            {
                name: "prefer_mentoring_topics",
                label: "Preferred Mentoring Topics",
                type: "multiselect",
                options: ["Career Planning", "Technical Skills", "Networking", "Interview Preparation", "Professional Development", "Industry Insights", "Other"]
            },
            {
                name: "prefer_mentoring_fields",
                label: "Preferred Mentoring Fields",
                type: "multiselect",
                options: ["Artificial Intelligence", "Data Science", "Web Development", "Mobile Development", "UX/UI Design", "Software Engineering", "DevOps", "Cybersecurity", "Other"]
            }, {
                name: "prefer_mentoring_softskills",
                label: "Preferred Soft Skills Development",
                type: "multiselect",
                options: ["Communication", "Teamwork", "Time Management", "Leadership", "Problem Solving", "Critical Thinking", "Presentation Skills", "Other"]
            },
            {
                name: "prefer_mentor_gender",
                label: "Preferred Mentor Gender",
                type: "select",
                options: ["No Preference", "Male", "Female", "Other"]
            },
            {
                name: "prefer_international_mentor",
                label: "Open to International Mentor?",
                type: "radio",
                options: ["Yes", "No"]
            }, {
                name: "prefer_mentor_working_style",
                label: "Preferred Mentor Working Style",
                type: "select",
                options: ["Hands-on Guidance", "Discussion-based", "Project-focused", "Guided Learning", "Goal-oriented", "Flexible Approach", "Other"],
                required: true
            }
        ]
    }, {
        title: "Final Details",
        description: "Complete your profile",
        fields: [
            {
                name: "sun_id",
                label: "Student Unique Number (SUN ID)",
                type: "text_with_button",
                required: false,
                buttonText: "Validate",
                onButtonClick: validateSunCode,
                validationMessage: sunCodeValidation.message,
                validationStatus: sunCodeValidation.status
            }, { name: "self_introduction", label: "Self Introduction", type: "textarea", required: true, placeholder: "Tell us about yourself, your interests, and goals..." },
            { name: "commitment", label: "Commitment Statement", type: "textarea", required: true, placeholder: "Describe your commitment to the mentoring program..." },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Password", type: "password", required: true, description: "Please remember your password, currently we do not support reset password!" }
        ]
    }
    ]; const getMentorFormSteps = () => [
        {
            title: "Personal Information",
            description: "Basic details and account setup",
            fields: [
                { name: "full_name", label: "Full Name", type: "text", required: true },
                { name: "role", label: "Role", type: "select", options: ["Mentor"], required: true, placeholder: "Select your role" },
                { name: "phone_number", label: "Phone Number", type: "tel", required: true }
            ]
        },
        {
            title: "Professional Experience",
            description: "Your work experience and expertise",
            fields: [
                { name: "working_company", label: "Current Company", type: "text", required: true },
                { name: "working_title", label: "Job Title", type: "text", required: true },
                {
                    name: "working_level",
                    label: "Professional Level",
                    type: "select",
                    options: ["Junior", "Mid-level", "Senior", "Lead", "Manager", "Director", "C-Level", "Other"],
                    required: true
                },
                {
                    name: "working_years_of_experience",
                    label: "Years of Experience",
                    type: "select",
                    options: ["1-2 years", "3-5 years", "6-10 years", "11-15 years", "16+ years"],
                    required: true
                }, {
                    name: "working_field",
                    label: "Working Field",
                    type: "select",
                    options: ["Artificial Intelligence", "Data Science", "Web Development", "Mobile Development", "UX/UI Design", "Software Engineering", "DevOps", "Cybersecurity", "Product Management", "Project Management", "Consulting", "Other"],
                    required: true
                }
            ]
        },
        {
            title: "Mentoring Preferences",
            description: "Your mentoring style and preferences",
            fields: [
                {
                    name: "prefer_mentoring_topic",
                    label: "Preferred Mentoring Topics",
                    type: "multiselect",
                    options: ["Career Planning", "Technical Skills", "Networking", "Interview Preparation", "Professional Development", "Industry Insights", "Leadership Development", "Entrepreneurship", "Other"]
                },
                {
                    name: "student_year",
                    label: "Year of Study",
                    type: "select",
                    options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Other"],
                    required: true
                },
                {
                    name: "prefer_mentoring_field",
                    label: "Preferred Mentoring Fields",
                    type: "multiselect",
                    options: ["Artificial Intelligence", "Data Science", "Web Development", "Mobile Development", "UX/UI Design", "Software Engineering", "DevOps", "Cybersecurity", "Product Management", "Other"]
                }, {
                    name: "prefer_mentee_working_style",
                    label: "Preferred Mentee Working Style",
                    type: "select",
                    options: ["Self-motivated", "Needs Guidance", "Project-focused", "Discussion-oriented", "Goal-driven", "Flexible", "Other"],
                    required: true
                },
                {
                    name: "prefer_mentoring_softskills",
                    label: "Preferred Soft Skills to Mentor",
                    type: "multiselect",
                    options: ["Communication", "Teamwork", "Time Management", "Leadership", "Problem Solving", "Critical Thinking", "Presentation Skills", "Negotiation", "Conflict Resolution", "Other"]
                }, {
                    name: "prefer_mentee_gender",
                    label: "Preferred Mentee Gender",
                    type: "select",
                    options: ["No Preference", "Male", "Female", "Other"]
                },

            ]
        }, {
            title: "Final Details",
            description: "Complete your mentor profile",
            fields: [{ name: "self_introduction", label: "Self Introduction", type: "textarea", required: true, placeholder: "Tell us about yourself, your expertise, and what you can offer as a mentor..." },
            { name: "commitment", label: "Commitment Statement", type: "textarea", required: true, placeholder: "Describe your commitment to mentoring and availability..." },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Password", type: "password", required: true, description: "Please remember your password, currently we do not support reset password!" }
            ]
        }
    ];

    const getFormSteps = () => {
        if (selectedRole === 'Mentee') {
            return getMenteeFormSteps();
        } else if (selectedRole === 'Mentor') {
            return getMentorFormSteps();
        }
        return [];
    };

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
    };

    const navigate = useNavigate(); const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            let { email, password, full_name, role, phone_number, ...user_data } = data;
            let response = await signUp(email, password, full_name, role, user_data, phone_number);
            if (response?.data) {
                notifications.show({
                    title: "Registration Successful",
                    message: `Welcome ${email}! Your registration as a ${role} is complete.`,
                    color: "green"
                });
                setRegistrationComplete(true);
            } else {
                notifications.show({
                    title: "Registration Failed",
                    message: response?.error,
                    color: "red"
                });
            }
        } catch (error) {
            notifications.show({
                title: "Registration Failed",
                message: "An unexpected error occurred. Please try again.",
                color: "red"
            });
        } finally {
            setIsSubmitting(false);
        }
    }; if (!selectedRole) {
        return (
            <div className="p-8 h-screen bg-blue-400">
                <div className='rounded-xl bg-white h-full p-8 shadow-sm flex flex-col items-center justify-center'>
                    <div className='text-center text-3xl font-bold mb-8'>
                        Join Saigonchildren Mentoring Program
                    </div>
                    <div className='text-center text-lg mb-12 text-gray-600 max-w-2xl'>
                        Choose your role to get started with the registration process
                    </div>                    <div className='flex gap-8'>
                        <div
                            onClick={() => handleRoleSelection('Mentee')}
                            className='bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-xl cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg'
                        >
                            <div className='text-2xl font-bold mb-4'>I'm a Mentee</div>
                            <div className='text-sm opacity-90'>
                                I'm looking for guidance and mentorship to advance my career
                            </div>
                        </div>
                        <div
                            onClick={() => handleRoleSelection('Mentor')}
                            className='bg-green-500 hover:bg-green-600 text-white p-8 rounded-xl cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg'
                        >
                            <div className='text-2xl font-bold mb-4'>I'm a Mentor</div>
                            <div className='text-sm opacity-90'>
                                I want to share my knowledge and help others grow
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 text-center'>
                        <span className='text-gray-600'>Already registered? </span>
                        <button
                            onClick={() => navigate('/auth/login')}
                            className='text-blue-500 hover:text-blue-700 underline font-medium'
                        >
                            Login now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Thank you page after successful registration
    if (registrationComplete) {
        return (
            <div className="p-8 h-screen bg-blue-400">
                <div className='rounded-xl bg-white h-full p-8 shadow-sm flex flex-col items-center justify-center'>
                    <div className='text-center mb-8'>
                        <div className='text-6xl mb-6'>✓</div>
                        <div className='text-3xl font-bold mb-4 text-green-600'>
                            Thank You for Registering!
                        </div>
                        <div className='text-xl mb-8 text-gray-700'>
                            Your {selectedRole} account has been created successfully.
                        </div>
                    </div>

                    <div className='bg-blue-50 p-6 rounded-lg max-w-2xl text-center mb-8'>
                        <div className='text-lg font-semibold text-blue-800 mb-2'>
                            What's Next?
                        </div>
                        <div className='text-blue-700'>
                            Saigonchildren staff will be notified and we will perform matching soon.
                            You'll receive an email notification once your {selectedRole.toLowerCase()} matching is ready.
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/auth/login')}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg'
                    >
                        Login to Your Account
                    </button>

                    <div className='mt-6 text-center'>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-screen bg-blue-400">
            <div className='rounded-xl bg-white h-full p-8 shadow-sm overflow-auto'>                <div className='flex justify-between items-center mb-4 pb-8'>
                <div className='text-2xl font-bold'>
                    {selectedRole} Registration - Saigonchildren Mentoring Program
                </div>
                <div className='flex items-center gap-4'>
                    <span className='text-gray-600'>Already registered? </span>
                    <button
                        onClick={() => navigate('/auth/login')}
                        className='text-blue-500 hover:text-blue-700 underline font-medium'
                    >
                        Login now
                    </button>
                    <span className='text-gray-400'>|</span>
                    <button
                        onClick={() => setSelectedRole(null)}
                        className='text-blue-500 hover:text-blue-700 underline'
                    >
                        Change Role
                    </button>
                </div>
            </div>                <MultiStepForm
                    steps={getFormSteps()}
                    onSubmit={handleFormSubmit}
                    initialValues={{ role: selectedRole }}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default RegisterPage;