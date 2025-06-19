import React from 'react'
import { Modal, Text, Badge, Group, Stack, Paper, Title, Divider, Grid, ScrollArea } from '@mantine/core'
import { FiUser, FiBriefcase, FiActivity as FiGraduationCap, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'

const UserPreviewModal = ({ opened, onClose, user }) => {
    if (!user) return null

    const formatValue = (value) => {
        if (Array.isArray(value)) {
            return value.join(', ')
        }
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value, null, 2)
        }
        return value || 'Not provided'
    }

    const renderUserDetails = () => {
        if (user.role === 'Mentor') {
            return (
                <Stack gap="lg">
                    {/* Basic Info */}
                    <Paper p="md" className="bg-blue-50">
                        <Group gap="xs" className="mb-3">
                            <FiUser size={20} className="text-blue-600" />
                            <Title order={4} className="text-blue-800">Basic Information</Title>
                        </Group>
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Full Name</Text>
                                <Text>{formatValue(user.full_name)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Role</Text>
                                <Badge variant="filled" color="blue">{user.role}</Badge>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Group gap="xs">
                                    <FiPhone size={14} />
                                    <Text size="sm" fw={500} c="dimmed">Phone Number</Text>
                                </Group>
                                <Text>{formatValue(user.phone_number)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Group gap="xs">
                                    <FiMail size={14} />
                                    <Text size="sm" fw={500} c="dimmed">Email</Text>
                                </Group>
                                <Text>{formatValue(user.email)}</Text>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Professional Info */}
                    <Paper p="md" className="bg-green-50">
                        <Group gap="xs" className="mb-3">
                            <FiBriefcase size={20} className="text-green-600" />
                            <Title order={4} className="text-green-800">Professional Information</Title>
                        </Group>
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Working Field</Text>
                                <Text>{formatValue(user.user_data?.working_field)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Working Level</Text>
                                <Text>{formatValue(user.user_data?.working_level)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Job Title</Text>
                                <Text>{formatValue(user.user_data?.working_title)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Company</Text>
                                <Text>{formatValue(user.user_data?.working_company)}</Text>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Text size="sm" fw={500} c="dimmed">Years of Experience</Text>
                                <Text>{formatValue(user.user_data?.working_years_of_experience)}</Text>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Mentoring Preferences */}
                    <Paper p="md" className="bg-purple-50">
                        <Group gap="xs" className="mb-3">
                            <FiGraduationCap size={20} className="text-purple-600" />
                            <Title order={4} className="text-purple-800">Mentoring Preferences</Title>
                        </Group>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed" className="mb-2">Preferred Mentoring Fields</Text>
                                <Group gap="xs">
                                    {user.user_data?.prefer_mentoring_field?.map((field, index) => (
                                        <Badge key={index} variant="light" color="purple">
                                            {field}
                                        </Badge>
                                    ))}
                                </Group>
                            </div>
                            <div>
                                <Text size="sm" fw={500} c="dimmed" className="mb-2">Preferred Mentoring Topics</Text>
                                <Group gap="xs">
                                    {user.user_data?.prefer_mentoring_topic?.map((topic, index) => (
                                        <Badge key={index} variant="light" color="purple">
                                            {topic}
                                        </Badge>
                                    ))}
                                </Group>
                            </div>
                            <div>
                                <Text size="sm" fw={500} c="dimmed" className="mb-2">Preferred Soft Skills</Text>
                                <Group gap="xs">
                                    {user.user_data?.prefer_mentoring_softskills?.map((skill, index) => (
                                        <Badge key={index} variant="light" color="purple">
                                            {skill}
                                        </Badge>
                                    ))}
                                </Group>
                            </div>
                            <Grid>
                                <Grid.Col span={6}>
                                    <Text size="sm" fw={500} c="dimmed">Preferred Mentee Gender</Text>
                                    <Text>{formatValue(user.user_data?.prefer_mentee_gender)}</Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="sm" fw={500} c="dimmed">Preferred Working Style</Text>
                                    <Text>{formatValue(user.user_data?.prefer_mentee_working_style)}</Text>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Paper>

                    {/* Additional Info */}
                    <Paper p="md" className="bg-gray-50">
                        <Title order={4} className="mb-3">Additional Information</Title>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed">Commitment</Text>
                                <Text>{formatValue(user.user_data?.commitment)}</Text>
                            </div>
                            <div>
                                <Text size="sm" fw={500} c="dimmed">Self Introduction</Text>
                                <Text style={{ whiteSpace: 'pre-wrap' }}>{formatValue(user.user_data?.self_introduction)}</Text>
                            </div>
                        </Stack>
                    </Paper>
                </Stack>
            )
        } else if (user.role === 'Mentee') {
            return (
                <Stack gap="lg">
                    {/* Basic Info */}
                    <Paper p="md" className="bg-blue-50">
                        <Group gap="xs" className="mb-3">
                            <FiUser size={20} className="text-blue-600" />
                            <Title order={4} className="text-blue-800">Basic Information</Title>
                        </Group>
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Full Name</Text>
                                <Text>{formatValue(user.full_name)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Role</Text>
                                <Badge variant="filled" color="green">{user.role}</Badge>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Group gap="xs">
                                    <FiPhone size={14} />
                                    <Text size="sm" fw={500} c="dimmed">Phone Number</Text>
                                </Group>
                                <Text>{formatValue(user.phone_number)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Group gap="xs">
                                    <FiMail size={14} />
                                    <Text size="sm" fw={500} c="dimmed">Email</Text>
                                </Group>
                                <Text>{formatValue(user.email)}</Text>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Academic Info */}
                    <Paper p="md" className="bg-green-50">
                        <Group gap="xs" className="mb-3">
                            <FiGraduationCap size={20} className="text-green-600" />
                            <Title order={4} className="text-green-800">Academic Information</Title>
                        </Group>
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">University</Text>
                                <Text>{formatValue(user.user_data?.university)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Major</Text>
                                <Text>{formatValue(user.user_data?.major)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Year of Study</Text>
                                <Text>{formatValue(user.user_data?.student_year)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">SUN ID</Text>
                                <Text>{formatValue(user.user_data?.sun_id)}</Text>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Internship Info */}
                    <Paper p="md" className="bg-orange-50">
                        <Group gap="xs" className="mb-3">
                            <FiBriefcase size={20} className="text-orange-600" />
                            <Title order={4} className="text-orange-800">Internship Information</Title>
                        </Group>
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Has Internship</Text>
                                <Badge
                                    variant="filled"
                                    color={user.user_data?.is_internship === 'Yes' ? 'green' : 'red'}
                                >
                                    {formatValue(user.user_data?.is_internship)}
                                </Badge>
                            </Grid.Col>
                            {user.user_data?.is_internship === 'Yes' && (
                                <>
                                    <Grid.Col span={6}>
                                        <Text size="sm" fw={500} c="dimmed">Internship Company</Text>
                                        <Text>{formatValue(user.user_data?.internship_company)}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Text size="sm" fw={500} c="dimmed">Internship Position</Text>
                                        <Text>{formatValue(user.user_data?.internship_position)}</Text>
                                    </Grid.Col>
                                </>
                            )}
                        </Grid>
                    </Paper>

                    {/* Mentoring Preferences */}
                    <Paper p="md" className="bg-purple-50">
                        <Group gap="xs" className="mb-3">
                            <FiGraduationCap size={20} className="text-purple-600" />
                            <Title order={4} className="text-purple-800">Mentoring Preferences</Title>
                        </Group>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed" className="mb-2">Preferred Mentoring Fields</Text>
                                <Group gap="xs">
                                    {user.user_data?.prefer_mentoring_fields?.map((field, index) => (
                                        <Badge key={index} variant="light" color="purple">
                                            {field}
                                        </Badge>
                                    ))}
                                </Group>
                            </div>
                            <div>
                                <Text size="sm" fw={500} c="dimmed" className="mb-2">Preferred Mentoring Topics</Text>
                                <Group gap="xs">
                                    {user.user_data?.prefer_mentoring_topics?.map((topic, index) => (
                                        <Badge key={index} variant="light" color="purple">
                                            {topic}
                                        </Badge>
                                    ))}
                                </Group>
                            </div>
                            <div>
                                <Text size="sm" fw={500} c="dimmed" className="mb-2">Preferred Soft Skills</Text>
                                <Group gap="xs">
                                    {user.user_data?.prefer_mentoring_softskills?.map((skill, index) => (
                                        <Badge key={index} variant="light" color="purple">
                                            {skill}
                                        </Badge>
                                    ))}
                                </Group>
                            </div>
                            <Grid>
                                <Grid.Col span={4}>
                                    <Text size="sm" fw={500} c="dimmed">Preferred Mentor Gender</Text>
                                    <Text>{formatValue(user.user_data?.prefer_mentor_gender)}</Text>
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Text size="sm" fw={500} c="dimmed">Preferred Working Style</Text>
                                    <Text>{formatValue(user.user_data?.prefer_mentor_working_style)}</Text>
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Text size="sm" fw={500} c="dimmed">Prefer International Mentor</Text>
                                    <Text>{formatValue(user.user_data?.prefer_international_mentor)}</Text>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Paper>

                    {/* Additional Info */}
                    <Paper p="md" className="bg-gray-50">
                        <Title order={4} className="mb-3">Additional Information</Title>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed">Commitment</Text>
                                <Text>{formatValue(user.user_data?.commitment)}</Text>
                            </div>
                            <div>
                                <Text size="sm" fw={500} c="dimmed">Self Introduction</Text>
                                <Text style={{ whiteSpace: 'pre-wrap' }}>{formatValue(user.user_data?.self_introduction)}</Text>
                            </div>
                        </Stack>
                    </Paper>
                </Stack>
            )
        } else {
            // Admin or other roles
            return (
                <Stack gap="lg">
                    <Paper p="md" className="bg-red-50">
                        <Group gap="xs" className="mb-3">
                            <FiUser size={20} className="text-red-600" />
                            <Title order={4} className="text-red-800">Admin Information</Title>
                        </Group>
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Full Name</Text>
                                <Text>{formatValue(user.full_name)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Role</Text>
                                <Badge variant="filled" color="red">{user.role}</Badge>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Group gap="xs">
                                    <FiPhone size={14} />
                                    <Text size="sm" fw={500} c="dimmed">Phone Number</Text>
                                </Group>
                                <Text>{formatValue(user.phone_number)}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Group gap="xs">
                                    <FiMail size={14} />
                                    <Text size="sm" fw={500} c="dimmed">Email</Text>
                                </Group>
                                <Text>{formatValue(user.email)}</Text>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Raw Data */}
                    <Paper p="md" className="bg-gray-50">
                        <Title order={4} className="mb-3">Additional Data</Title>
                        <ScrollArea h={200}>
                            <Text component="pre" size="sm" c="dimmed" className="bg-white p-3 rounded border">
                                {JSON.stringify(user.user_data, null, 2)}
                            </Text>
                        </ScrollArea>
                    </Paper>
                </Stack>
            )
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`User Details - ${user.full_name}`}
            size="xl"
            scrollAreaComponent={ScrollArea.Autosize}
        >
            <ScrollArea.Autosize mah={600}>
                {renderUserDetails()}
            </ScrollArea.Autosize>
        </Modal>
    )
}

export default UserPreviewModal
