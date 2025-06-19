import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { updateProfile } from '../../services/profile.service.js';
import {
    Container,
    Paper,
    Title,
    TextInput,
    Textarea,
    Select,
    MultiSelect,
    Button,
    Group,
    Stack,
    Grid,
    Notification,
    Switch
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

const UserProfilePage = () => {
    const { user, setUser } = useAuthStore(state => state);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            full_name: user?.full_name || '',
            phone_number: user?.phone_number || '',
            email: user?.email || '',
            // Common fields
            commitment: user?.user_data?.commitment || '',
            self_introduction: user?.user_data?.self_introduction || '',
            // Mentee specific fields
            major: user?.user_data?.major || '',
            sun_id: user?.user_data?.sun_id || '',
            university: user?.user_data?.university || '',
            student_year: user?.user_data?.student_year || '',
            is_internship: user?.user_data?.is_internship || 'No',
            internship_company: user?.user_data?.internship_company || '',
            internship_position: user?.user_data?.internship_position || '',
            prefer_mentor_gender: user?.user_data?.prefer_mentor_gender || 'No Preference',
            prefer_mentoring_fields: user?.user_data?.prefer_mentoring_fields || [],
            prefer_mentoring_topics: user?.user_data?.prefer_mentoring_topics || [],
            prefer_international_mentor: user?.user_data?.prefer_international_mentor || 'No',
            prefer_mentor_working_style: user?.user_data?.prefer_mentor_working_style || 'Flexible Approach',
            prefer_mentoring_softskills: user?.user_data?.prefer_mentoring_softskills || [],
            // Mentor specific fields
            working_field: user?.user_data?.working_field || '',
            working_level: user?.user_data?.working_level || '',
            working_title: user?.user_data?.working_title || '',
            working_company: user?.user_data?.working_company || '',
            working_years_of_experience: user?.user_data?.working_years_of_experience || '',
            prefer_mentee_gender: user?.user_data?.prefer_mentee_gender || 'No Preference',
            prefer_mentoring_field: user?.user_data?.prefer_mentoring_field || [],
            prefer_mentoring_topic: user?.user_data?.prefer_mentoring_topic || [],
            prefer_mentee_working_style: user?.user_data?.prefer_mentee_working_style || 'Flexible Approach',
        }
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const { full_name, phone_number, email, ...userData } = values;

            const profileData = {
                full_name,
                phone_number,
                email,
                user_data: userData
            };

            const result = await updateProfile(user.id, profileData);

            if (result.success) {
                setUser(result.data);
                notifications.show({
                    title: 'Success',
                    message: 'Profile updated successfully!',
                    color: 'green'
                });
            } else {
                notifications.show({
                    title: 'Error',
                    message: result.error || 'Failed to update profile',
                    color: 'red'
                });
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred',
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    const fieldOptions = [
        'Web Development', 'Mobile Development', 'Data Science', 'AI/ML',
        'Cybersecurity', 'Cloud Computing', 'DevOps', 'UI/UX Design'
    ];

    const topicOptions = [
        'Technical Skills', 'Career Planning', 'Industry Insights',
        'Professional Development', 'Networking', 'Interview Preparation'
    ];

    const softSkillOptions = [
        'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
        'Time Management', 'Negotiation', 'Presentation Skills'
    ];

    return (
        <Container size="lg">
            <Paper shadow="sm" p="xl">
                <Title order={2} mb="xl">Profile Settings</Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        {/* Basic Information */}
                        <Title order={3} size="h4">Basic Information</Title>
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    {...form.getInputProps('full_name')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Phone Number"
                                    placeholder="Enter your phone number"
                                    {...form.getInputProps('phone_number')}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <TextInput
                                    label="Email"
                                    placeholder="Enter your email"
                                    {...form.getInputProps('email')}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Textarea
                                    label="Self Introduction"
                                    placeholder="Tell us about yourself"
                                    rows={4}
                                    {...form.getInputProps('self_introduction')}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Textarea
                                    label="Commitment"
                                    placeholder="Describe your commitment"
                                    rows={3}
                                    {...form.getInputProps('commitment')}
                                />
                            </Grid.Col>
                        </Grid>

                        {/* Role-specific fields */}
                        {user?.role === 'Mentee' && (
                            <>
                                <Title order={3} size="h4" mt="xl">Academic Information</Title>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Student ID"
                                            placeholder="Enter your student ID"
                                            {...form.getInputProps('sun_id')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Major"
                                            placeholder="Enter your major"
                                            {...form.getInputProps('major')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="University"
                                            placeholder="Enter your university"
                                            {...form.getInputProps('university')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Student Year"
                                            placeholder="Select your year"
                                            data={['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate']}
                                            {...form.getInputProps('student_year')}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Title order={3} size="h4" mt="xl">Internship Information</Title>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Currently in Internship"
                                            data={['Yes', 'No']}
                                            {...form.getInputProps('is_internship')}
                                        />
                                    </Grid.Col>
                                    {form.values.is_internship === 'Yes' && (
                                        <>
                                            <Grid.Col span={6}>
                                                <TextInput
                                                    label="Internship Company"
                                                    placeholder="Enter company name"
                                                    {...form.getInputProps('internship_company')}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={12}>
                                                <TextInput
                                                    label="Internship Position"
                                                    placeholder="Enter your position"
                                                    {...form.getInputProps('internship_position')}
                                                />
                                            </Grid.Col>
                                        </>
                                    )}
                                </Grid>

                                <Title order={3} size="h4" mt="xl">Mentor Preferences</Title>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Preferred Mentor Gender"
                                            data={['Male', 'Female', 'No Preference']}
                                            {...form.getInputProps('prefer_mentor_gender')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="International Mentor Preference"
                                            data={['Yes', 'No', 'No Preference']}
                                            {...form.getInputProps('prefer_international_mentor')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <MultiSelect
                                            label="Preferred Mentoring Fields"
                                            data={fieldOptions}
                                            {...form.getInputProps('prefer_mentoring_fields')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <MultiSelect
                                            label="Preferred Mentoring Topics"
                                            data={topicOptions}
                                            {...form.getInputProps('prefer_mentoring_topics')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <MultiSelect
                                            label="Preferred Soft Skills"
                                            data={softSkillOptions}
                                            {...form.getInputProps('prefer_mentoring_softskills')}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </>
                        )}

                        {user?.role === 'Mentor' && (
                            <>
                                <Title order={3} size="h4" mt="xl">Professional Information</Title>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Working Field"
                                            placeholder="Enter your working field"
                                            {...form.getInputProps('working_field')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Working Level"
                                            data={['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager']}
                                            {...form.getInputProps('working_level')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Job Title"
                                            placeholder="Enter your job title"
                                            {...form.getInputProps('working_title')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Company"
                                            placeholder="Enter your company"
                                            {...form.getInputProps('working_company')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Years of Experience"
                                            data={['0-2 years', '3-5 years', '6-10 years', '10+ years']}
                                            {...form.getInputProps('working_years_of_experience')}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Title order={3} size="h4" mt="xl">Mentee Preferences</Title>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Preferred Mentee Gender"
                                            data={['Male', 'Female', 'No Preference']}
                                            {...form.getInputProps('prefer_mentee_gender')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Preferred Working Style"
                                            data={['Needs Guidance', 'Independent', 'Flexible Approach']}
                                            {...form.getInputProps('prefer_mentee_working_style')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <MultiSelect
                                            label="Mentoring Fields"
                                            data={fieldOptions}
                                            {...form.getInputProps('prefer_mentoring_field')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <MultiSelect
                                            label="Mentoring Topics"
                                            data={topicOptions}
                                            {...form.getInputProps('prefer_mentoring_topic')}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </>
                        )}

                        <Group justify="flex-end" mt="xl">
                            <Button
                                type="submit"
                                loading={loading}
                                size="md"
                            >
                                Update Profile
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default UserProfilePage;