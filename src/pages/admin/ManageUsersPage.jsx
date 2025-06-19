import React, { useEffect, useState } from 'react'
import { Container, Text, Badge, Group } from '@mantine/core'
import { useProfileStore } from '../../store/profile.store'
import { getAllProfiles } from '../../services/profile.service'
import GenericTable from '../../components/GenericTable'
import UserPreviewModal from '../../components/UserPreviewModal'

const ManageUsersPage = () => {
    const { profiles, setProfiles } = useProfileStore((state) => (state))
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchProfiles = async () => {
            const allProfiles = await getAllProfiles()
            setProfiles(allProfiles)
        }
        fetchProfiles()
    }, [setProfiles])

    const handleUserPreview = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
    }

    // Define table columns
    const columns = [
        {
            key: 'full_name',
            label: 'Full Name',
            render: (value) => (
                <Text fw={500}>
                    {value || 'N/A'}
                </Text>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <Badge
                    variant="filled"
                    color={
                        value === 'Mentor'
                            ? 'blue'
                            : value === 'Mentee'
                                ? 'green'
                                : 'red'
                    }
                >
                    {value}
                </Badge>
            )
        },
        {
            key: 'phone_number',
            label: 'Phone',
            render: (value) => (
                <Text size="sm">
                    {value || 'N/A'}
                </Text>
            )
        },
        {
            key: 'email',
            label: 'Email',
            render: (value) => (
                <Text size="sm">
                    {value || 'N/A'}
                </Text>
            )
        },
        {
            key: 'user_data.working_field',
            label: 'Field/Major',
            render: (value, item) => {
                const field = item.role === 'Mentor' ? item.user_data?.working_field : item.user_data?.major
                return (
                    <Text size="sm">
                        {field || 'N/A'}
                    </Text>
                )
            }
        },
        {
            key: 'user_data.working_level',
            label: 'Level/Year',
            render: (value, item) => {
                const level = item.role === 'Mentor' ? item.user_data?.working_level : item.user_data?.student_year
                return (
                    <Text size="sm">
                        {level || 'N/A'}
                    </Text>
                )
            }
        },
        {
            key: 'user_data.working_company',
            label: 'Company/University',
            render: (value, item) => {
                const org = item.role === 'Mentor' ? item.user_data?.working_company : item.user_data?.university
                return (
                    <Text size="sm" className="max-w-xs truncate" title={org}>
                        {org || 'N/A'}
                    </Text>
                )
            }
        }, {
            key: 'created_at',
            label: 'Joined',
            type: 'date',
            render: (value) => (
                <Text size="sm" c="dimmed">
                    {value ? new Date(value).toLocaleDateString() : 'N/A'}
                </Text>
            )
        }
    ]

    return (
        <Container size="xl" className="p-6">            <div className="mb-6">
        </div>

            <GenericTable
                data={profiles}
                columns={columns}
                title="Users Management"
                searchable={true}
                sortable={true}
                filterable={true}
                exportable={true}
                exportFilename="mentors_mentees_export"
                onRowPreview={handleUserPreview}
                rowsPerPage={10}
            />

            <UserPreviewModal
                opened={isModalOpen}
                onClose={handleCloseModal}
                user={selectedUser}
            />
        </Container>
    )
}

export default ManageUsersPage