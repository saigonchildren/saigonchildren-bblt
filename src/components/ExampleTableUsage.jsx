import React from 'react'
import { Badge, Text } from '@mantine/core'
import GenericTable from './GenericTable'
import UserPreviewModal from './UserPreviewModal'

// Example usage of GenericTable
const ExampleTableUsage = () => {
    const [selectedUser, setSelectedUser] = React.useState(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    // Sample data
    const sampleData = [
        {
            id: 1,
            name: 'John Doe',
            role: 'Mentor',
            email: 'john@example.com',
            phone: '+1234567890',
            skills: ['React', 'JavaScript', 'Node.js'],
            experience: '5+ years',
            company: 'Tech Corp'
        },
        {
            id: 2,
            name: 'Jane Smith',
            role: 'Mentee',
            email: 'jane@example.com',
            phone: '+0987654321',
            skills: ['Python', 'Data Science'],
            experience: '2 years',
            company: 'Data Inc'
        }
    ]

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (value) => <Text fw={500}>{value}</Text>
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <Badge color={value === 'Mentor' ? 'blue' : 'green'}>
                    {value}
                </Badge>
            )
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'phone',
            label: 'Phone'
        },
        {
            key: 'skills',
            label: 'Skills',
            render: (value) => (
                <div className="flex flex-wrap gap-1">
                    {value.map((skill, index) => (
                        <Badge key={index} size="sm" variant="light">
                            {skill}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            key: 'experience',
            label: 'Experience'
        },
        {
            key: 'company',
            label: 'Company'
        }
    ]

    const handlePreview = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    return (
        <div>
            <GenericTable
                data={sampleData}
                columns={columns}
                title="Example Users Table"
                searchable={true}
                sortable={true}
                filterable={true}
                onRowPreview={handlePreview}
                rowsPerPage={5}
            />

            <UserPreviewModal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
            />
        </div>
    )
}

export default ExampleTableUsage
