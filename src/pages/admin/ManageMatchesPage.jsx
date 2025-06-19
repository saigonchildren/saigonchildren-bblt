import React from 'react'
import { TextInput, Modal, Group, Text, Button, Card, Loader, NumberInput, Accordion, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { getAllMatches, createMatch, deleteMatchById } from '../../services/matches.service'
import { useNavigate } from 'react-router-dom'

const ManageMatchesPage = () => {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [matches, setMatches] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [modalOpened, { open, close }] = useDisclosure(false)
    const [newMatchName, setNewMatchName] = React.useState('')
    const [creating, setCreating] = React.useState(false)
    const [deleteModalOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
    const [matchToDelete, setMatchToDelete] = React.useState(null)
    const [deleting, setDeleting] = React.useState(false)

    // Matching configuration state
    const [matchConfig, setMatchConfig] = React.useState({
        majorWorkingFieldMatch: 2,
        commonFieldsPerMatch: 1,
        commonSoftSkillsPerMatch: 2,
        genderPreferenceExact: 1,
        genderPreferenceFlexible: 0.5,
        studentYearMatch: 1,
        workingStyleExact: 1,
        workingStyleFlexible: 0.5,
    })

    const fetchMatches = async () => {
        setLoading(true)
        try {
            const data = await getAllMatches()
            setMatches(data)
        } catch (e) {
            setMatches([])
        }
        setLoading(false)
    }

    React.useEffect(() => {
        fetchMatches()
    }, [])
    const navigate = useNavigate();
    const handleCreateMatch = async () => {
        if (!newMatchName.trim()) return
        setCreating(true)
        try {
            let data = await createMatch(newMatchName.trim(), matchConfig)
            setNewMatchName('')
            close()
            fetchMatches()
            navigate(`/admin/matches/${data.id}`)
        } catch (e) {
            // handle error, e.g. show notification
            console.error("Error creating match:", e)
        }
        setCreating(false)
    }

    const handleDeleteClick = (match) => {
        setMatchToDelete(match)
        openDelete()
    }

    const handleConfirmDelete = async () => {
        if (!matchToDelete) return
        setDeleting(true)
        try {
            await deleteMatchById(matchToDelete.id)
            setMatchToDelete(null)
            closeDelete()
            fetchMatches()
        } catch (e) {
            // handle error
        }
        setDeleting(false)
    }

    const handleConfigChange = (key, value) => {
        setMatchConfig(prev => ({
            ...prev,
            [key]: value
        }))
    }

    // Filter matches by name if searchTerm is set
    const filteredMatches = matches.filter(
        m => m.match_metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className='max-h-screen  w-full'>
            {/* Create Modal */}
            <Modal opened={modalOpened} onClose={close} title="Create Match" centered size="lg">
                <TextInput
                    label="Match Name"
                    placeholder="Enter match name"
                    value={newMatchName}
                    onChange={e => setNewMatchName(e.target.value)}
                    required
                    mb="md"
                />

                <Accordion defaultValue="config">
                    <Accordion.Item value="config">
                        <Accordion.Control>
                            <Title order={4}>Matching Configuration</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <div className="grid grid-cols-2 gap-4">
                                <NumberInput
                                    label="Major-Working Field Match"
                                    value={matchConfig.majorWorkingFieldMatch}
                                    onChange={(value) => handleConfigChange('majorWorkingFieldMatch', value)}
                                    min={0}
                                    step={0.5}
                                />
                                <NumberInput
                                    label="Common Fields Per Match"
                                    value={matchConfig.commonFieldsPerMatch}
                                    onChange={(value) => handleConfigChange('commonFieldsPerMatch', value)}
                                    min={0}
                                    step={0.5}
                                />
                                <NumberInput
                                    label="Common Soft Skills Per Match"
                                    value={matchConfig.commonSoftSkillsPerMatch}
                                    onChange={(value) => handleConfigChange('commonSoftSkillsPerMatch', value)}
                                    min={0}
                                    step={0.5}
                                />
                                <NumberInput
                                    label="Gender Preference Exact"
                                    value={matchConfig.genderPreferenceExact}
                                    onChange={(value) => handleConfigChange('genderPreferenceExact', value)}
                                    min={0}
                                    step={0.5}
                                />
                                <NumberInput
                                    label="Gender Preference Flexible"
                                    value={matchConfig.genderPreferenceFlexible}
                                    onChange={(value) => handleConfigChange('genderPreferenceFlexible', value)}
                                    min={0}
                                    step={0.5}
                                />
                                <NumberInput
                                    label="Student Year Match"
                                    value={matchConfig.studentYearMatch}
                                    onChange={(value) => handleConfigChange('studentYearMatch', value)}
                                    min={0}
                                    step={0.5}
                                />
                                <NumberInput
                                    label="Working Style Exact"
                                    value={matchConfig.workingStyleExact}
                                    onChange={(value) => handleConfigChange('workingStyleExact', value)}
                                    min={0}
                                    step={0.5}
                                />
                                <NumberInput
                                    label="Working Style Flexible"
                                    value={matchConfig.workingStyleFlexible}
                                    onChange={(value) => handleConfigChange('workingStyleFlexible', value)}
                                    min={0}
                                    step={0.5}
                                />
                            </div>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <Group mt="md" justify="end">
                    <Button variant="default" onClick={close}>Cancel</Button>
                    <Button color="blue" loading={creating} onClick={handleCreateMatch}>Create</Button>
                </Group>
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal opened={deleteModalOpened} onClose={closeDelete} title="Delete Match" centered>
                <Text>Are you sure you want to delete <b>{matchToDelete?.match_metadata?.name}</b>?</Text>
                <Group mt="md" justify="end">
                    <Button variant="default" onClick={closeDelete}>Cancel</Button>
                    <Button color="red" loading={deleting} onClick={handleConfirmDelete}>Delete</Button>
                </Group>
            </Modal>
            <div className='flex items-center justify-start p-4 gap-4'>
                <TextInput
                    placeholder="Search matches..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button color="blue" variant="filled" onClick={open}>
                    Create new match
                </Button>
            </div>

            <div className='overflow-y-auto max-h-[calc(100vh-250px)] p-4'>
                {loading ? (
                    <Loader />
                ) : (
                    filteredMatches.map((match) => (
                        <Card className='shadow-sm m-2' padding="lg" radius="md" withBorder key={match.id}>
                            <Group justify="space-between" mt="md" mb="xs">
                                <Text fw={500}>{match.match_metadata?.name || 'No Name'}</Text>
                                <Text size="sm" c="dimmed">{match.match_metadata?.created_at?.slice(0, 10) || ''}</Text>
                            </Group>
                            <div className='flex items-center gap-2 mt-4'>
                                <Button color="blue" radius="md" size="xs" onClick={() => {
                                    navigate(`/admin/matches/${match.id}`)
                                }}>View detail</Button>
                                <Button color="red" radius="md" size="xs" onClick={() => handleDeleteClick(match)}>Delete</Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default ManageMatchesPage