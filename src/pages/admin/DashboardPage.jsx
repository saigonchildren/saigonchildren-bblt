import React, { useEffect } from 'react'
import { Card, Text, Group, Badge, Progress, Container, Grid, Title, Paper, Stack, ThemeIcon, List, Button } from '@mantine/core';
import { HiUsers, HiStar, HiCog, HiChartBar, HiShieldCheck, HiDatabase, HiArrowUp } from 'react-icons/hi';
import { useProfileStore } from '../../store/profile.store.js';

const StatCard = ({ title, value, description, icon, color, progress, trend }) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className="hover:shadow-lg transition-shadow duration-200">
            <Group justify="space-between">
                <div>
                    <Text size="sm" c="dimmed" className="font-medium">
                        {title}
                    </Text>
                    <Text size="xl" fw={700} className="mt-1">
                        {value}
                    </Text>
                    <Group gap="xs" className="mt-1">
                        <Text size="xs" c="dimmed">
                            {description}
                        </Text>
                        {trend && (
                            <Badge color="green" size="xs" variant="light" leftSection={<HiArrowUp size="0.6rem" />}>
                                {trend}
                            </Badge>
                        )}
                    </Group>
                </div>
                <ThemeIcon color={color} size="xl" radius="md">
                    {icon}
                </ThemeIcon>
            </Group>
            {progress && (
                <Progress value={progress} mt="md" size="sm" radius="xl" color={color} />
            )}
        </Card>
    );
};

const FeatureCard = ({ title, description, icon, features, color }) => {
    return (
        <Paper shadow="sm" p="xl" radius="md" className="h-full border hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-gray-50">
            <Stack gap="md">
                <Group>
                    <ThemeIcon color={color} size="lg" radius="md" className="shadow-sm">
                        {icon}
                    </ThemeIcon>
                    <Title order={3} className="text-gray-800">
                        {title}
                    </Title>
                </Group>

                <Text c="dimmed" className="text-sm leading-relaxed">
                    {description}
                </Text>

                <List
                    spacing="xs"
                    size="sm"
                    icon={<HiShieldCheck size="0.8rem" color="#10b981" />}
                    className="mt-2"
                >
                    {features.map((feature, index) => (
                        <List.Item key={index} className="text-gray-600">
                            {feature}
                        </List.Item>
                    ))}
                </List>

                <Button variant="light" color={color} size="sm" className="mt-auto hover:scale-105 transition-transform duration-200">
                    Get Started
                </Button>
            </Stack>
        </Paper>
    );
};

const DashboardPage = () => {
    const { totalProfiles, isLoading, error, fetchProfileCount } = useProfileStore();

    useEffect(() => {
        fetchProfileCount();
    }, []);

    // Use real profile count from server
    const stats = {
        totalUsers: totalProfiles,
    };

    return (
        <Container size="xl" py="xl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header Section */}
            <div className="text-center mb-12">
                <Title order={1} className="text-5xl font-bold text-sky-400 mb-6">
                    Admin Dashboard
                </Title>

                {error && (
                    <Text size="sm" c="red" className="mt-2">
                        Error loading data: {error}
                    </Text>
                )}
            </div>

            {/* Statistics Cards */}
            <Grid gutter="lg" className="mb-16" justify="center">
                <Grid.Col span={{ base: 12, sm: 8, md: 6, lg: 4 }}>
                    <StatCard
                        title="Total Users"
                        value={isLoading ? "Loading..." : stats.totalUsers.toLocaleString()}
                        description="Registered profiles"
                        trend={isLoading ? "Loading..." : (stats.totalUsers > 0 ? "Live Data" : "No Data")}
                        icon={<HiUsers size="1.5rem" />}
                        color="blue"
                        progress={isLoading ? 0 : Math.min((stats.totalUsers / 5000) * 100, 100)}
                    />
                </Grid.Col>
            </Grid>

        </Container>
    )
}

export default DashboardPage