import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Text, Group, Loader, Button, Modal, Grid, Badge, Paper, Title, Divider, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { getMatchById, getMentorshipsByMatchId } from '../../services/matches.service'
import { exportMentorshipsToExcel } from '../../utils/excel_export'

const MatchDetailPage = () => {
    const { matchId } = useParams()
    const navigate = useNavigate()
    const [match, setMatch] = React.useState(null)
    const [mentorships, setMentorships] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [modalOpened, { open, close }] = useDisclosure(false)
    const [selectedPair, setSelectedPair] = React.useState(null)

    const fetchMatchDetails = async () => {
        setLoading(true)
        try {
            const [matchData, mentorshipData] = await Promise.all([
                getMatchById(matchId),
                getMentorshipsByMatchId(matchId)
            ])
            setMatch(matchData)
            setMentorships(mentorshipData)
        } catch (error) {
            console.error('Error fetching match details:', error)
        }
        setLoading(false)
    }

    React.useEffect(() => {
        if (matchId) {
            fetchMatchDetails()
        }
    }, [matchId])

    const handleViewDetails = (mentorship) => {
        setSelectedPair(mentorship)
        open()
    }

    const handleExportToExcel = () => {
        if (mentorships.length > 0 && match) {
            exportMentorshipsToExcel(
                mentorships,
                match.match_metadata?.name || 'Match',
                `${match.match_metadata?.name || 'match'}_details`
            )
        }
    }

    const calculateStats = () => {
        if (mentorships.length === 0) return { avgMatchRate: 0, totalPairs: 0, uniqueMentors: 0 }

        const totalMatchRate = mentorships.reduce((sum, m) => sum + (m.mentorship_metadata?.match_rate || 0), 0)
        const avgMatchRate = totalMatchRate / mentorships.length
        const uniqueMentors = new Set(mentorships.map(m => m.mentor_id)).size

        return {
            avgMatchRate: avgMatchRate.toFixed(2),
            totalPairs: mentorships.length,
            uniqueMentors
        }
    }

    const stats = calculateStats()

    if (loading) {
        return <Loader />
    }

    if (!match) {
        return <Text>Match not found</Text>
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <Group justify="space-between" align="center">
                    <div>
                        <Group gap="sm" mb="xs">
                            <Button variant="subtle" onClick={() => navigate('/admin/matches')}>
                                ← Back to Matches
                            </Button>
                        </Group>
                        <Title order={2}>{match.match_metadata?.name || 'Match Details'}</Title>
                        <Text size="sm" c="dimmed">
                            Created: {match.match_metadata?.created_at ? new Date(match.match_metadata.created_at).toLocaleDateString() : 'N/A'}
                        </Text>
                    </div>
                    <Button onClick={handleExportToExcel} disabled={mentorships.length === 0}>
                        Export to Excel
                    </Button>
                </Group>
            </div>

            {/* Statistics Cards */}
            <Grid mb="xl">
                <Grid.Col span={4}>
                    <Paper p="md" withBorder>
                        <Text size="xs" tt="uppercase" fw={700} c="dimmed">Total Pairs</Text>
                        <Text size="xl" fw={700}>{stats.totalPairs}</Text>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Paper p="md" withBorder>
                        <Text size="xs" tt="uppercase" fw={700} c="dimmed">Unique Mentors</Text>
                        <Text size="xl" fw={700}>{stats.uniqueMentors}</Text>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Paper p="md" withBorder>
                        <Text size="xs" tt="uppercase" fw={700} c="dimmed">Avg Match Rate</Text>
                        <Text size="xl" fw={700}>{stats.avgMatchRate}</Text>
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Mentorship Pairs */}
            <Title order={3} mb="md">Mentor-Mentee Pairs</Title>
            <div className="grid gap-4">
                {mentorships.map((mentorship, index) => (
                    <Card key={mentorship.id} padding="lg" radius="md" withBorder>
                        <Group justify="space-between">
                            <div>
                                <Group gap="sm" mb="xs">
                                    <Text fw={600}>Pair #{index + 1}</Text>
                                    <Badge color="blue" variant="light">
                                        Match Rate: {mentorship.mentorship_metadata?.match_rate || 0}
                                    </Badge>
                                </Group>
                                <Text size="sm">
                                    <strong>Mentor:</strong> {mentorship.mentor?.full_name || 'N/A'}
                                </Text>
                                <Text size="sm">
                                    <strong>Mentee:</strong> {mentorship.mentee?.full_name || 'N/A'}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    Group ID: {mentorship.mentorship_metadata?.group_id || 'N/A'}
                                </Text>
                            </div>
                            <Button size="xs" onClick={() => handleViewDetails(mentorship)}>
                                View Details
                            </Button>
                        </Group>
                    </Card>
                ))}
            </div>

            {/* Detail Modal */}
            <Modal opened={modalOpened} onClose={close} title="Mentorship Pair Details" size="lg">
                {selectedPair && (
                    <Stack gap="md">
                        <Group justify="center">
                            <Badge size="lg" color="blue">
                                Match Rate: {selectedPair.mentorship_metadata?.match_rate || 0}
                            </Badge>
                        </Group>

                        <Divider />

                        <Grid>
                            <Grid.Col span={6}>
                                <Title order={4} mb="sm">Mentor Details</Title>
                                <Stack gap="xs">
                                    <Text><strong>Name:</strong> {selectedPair.mentor?.full_name || 'N/A'}</Text>
                                    <Text><strong>Email:</strong> {selectedPair.mentor?.email || 'N/A'}</Text>
                                    {selectedPair.mentor?.user_data && (
                                        <>
                                            <Text><strong>Major:</strong> {selectedPair.mentor.user_data.major || 'N/A'}</Text>
                                            <Text><strong>Working Field:</strong> {selectedPair.mentor.user_data.working_field || 'N/A'}</Text>
                                            <Text><strong>Student Year:</strong> {selectedPair.mentor.user_data.student_year || 'N/A'}</Text>
                                            <Text><strong>Gender:</strong> {selectedPair.mentor.user_data.gender || 'N/A'}</Text>
                                            <Text><strong>Mentoring Fields:</strong> {
                                                Array.isArray(selectedPair.mentor.user_data.prefer_mentoring_field)
                                                    ? selectedPair.mentor.user_data.prefer_mentoring_field.join(', ')
                                                    : selectedPair.mentor.user_data.prefer_mentoring_field || 'N/A'
                                            }</Text>
                                            <Text><strong>Soft Skills:</strong> {
                                                Array.isArray(selectedPair.mentor.user_data.prefer_mentoring_softskills)
                                                    ? selectedPair.mentor.user_data.prefer_mentoring_softskills.join(', ')
                                                    : selectedPair.mentor.user_data.prefer_mentoring_softskills || 'N/A'
                                            }</Text>
                                        </>
                                    )}
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Title order={4} mb="sm">Mentee Details</Title>
                                <Stack gap="xs">
                                    <Text><strong>Name:</strong> {selectedPair.mentee?.full_name || 'N/A'}</Text>
                                    <Text><strong>Email:</strong> {selectedPair.mentee?.email || 'N/A'}</Text>
                                    {selectedPair.mentee?.user_data && (
                                        <>
                                            <Text><strong>Major:</strong> {selectedPair.mentee.user_data.major || 'N/A'}</Text>
                                            <Text><strong>Student Year:</strong> {selectedPair.mentee.user_data.student_year || 'N/A'}</Text>
                                            <Text><strong>Gender:</strong> {selectedPair.mentee.user_data.gender || 'N/A'}</Text>
                                            <Text><strong>Preferred Fields:</strong> {
                                                Array.isArray(selectedPair.mentee.user_data.prefer_mentoring_fields)
                                                    ? selectedPair.mentee.user_data.prefer_mentoring_fields.join(', ')
                                                    : selectedPair.mentee.user_data.prefer_mentoring_fields || 'N/A'
                                            }</Text>
                                            <Text><strong>Soft Skills:</strong> {
                                                Array.isArray(selectedPair.mentee.user_data.prefer_mentoring_softskills)
                                                    ? selectedPair.mentee.user_data.prefer_mentoring_softskills.join(', ')
                                                    : selectedPair.mentee.user_data.prefer_mentoring_softskills || 'N/A'
                                            }</Text>
                                        </>
                                    )}
                                </Stack>
                            </Grid.Col>
                        </Grid>

                        <Divider />

                        <div>
                            <Title order={5} mb="xs">Additional Info</Title>
                            <Text size="sm">Group ID: {selectedPair.mentorship_metadata?.group_id || 'N/A'}</Text>
                            <Text size="sm">Created: {
                                selectedPair.mentorship_metadata?.created_at
                                    ? new Date(selectedPair.mentorship_metadata.created_at).toLocaleString()
                                    : 'N/A'
                            }</Text>
                        </div>
                    </Stack>
                )}
            </Modal>
        </div>
    )
}

export default MatchDetailPage