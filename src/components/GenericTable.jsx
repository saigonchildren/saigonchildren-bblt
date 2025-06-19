import React, { useState, useMemo, useEffect } from 'react'
import { Table, TextInput, Select, Button, Group, Text, Pagination, Badge, ActionIcon, Flex, Paper, Title } from '@mantine/core'
import { FiSearch, FiFilter, FiChevronUp, FiChevronDown, FiEye, FiX, FiDownload } from 'react-icons/fi'
import { exportUsersToExcel, exportUsersToExcelByRole, prepareUsersForExport, exportToExcel } from '../utils/excel_export'

const GenericTable = ({
    data = [],
    columns = [],
    searchable = true,
    sortable = true,
    filterable = true,
    exportable = false,
    onRowPreview = null,
    rowsPerPage = 10,
    title = "Data Table",
    exportFilename = "data_export"
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
    const [filters, setFilters] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [showFilters, setShowFilters] = useState(false)

    // Reset to first page when search or filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filters])

    // Get unique values for filter options
    const getUniqueValues = (key) => {
        const values = data.map(item => {
            const value = getNestedValue(item, key)
            return Array.isArray(value) ? value.join(', ') : value
        }).filter(Boolean)
        return [...new Set(values)].sort()
    }

    // Helper function to get nested object values
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            if (current && typeof current === 'object') {
                return current[key]
            }
            return current
        }, obj)
    }

    // Filter and search data
    const filteredAndSearchedData = useMemo(() => {
        let filtered = data

        // Apply search
        if (searchTerm && searchable) {
            filtered = filtered.filter(item =>
                columns.some(column => {
                    const value = getNestedValue(item, column.key)
                    const searchValue = Array.isArray(value) ? value.join(' ') : String(value || '')
                    return searchValue.toLowerCase().includes(searchTerm.toLowerCase())
                })
            )
        }

        // Apply filters
        Object.entries(filters).forEach(([key, filterValue]) => {
            if (filterValue && filterValue !== 'all') {
                filtered = filtered.filter(item => {
                    const value = getNestedValue(item, key)
                    const itemValue = Array.isArray(value) ? value.join(', ') : String(value || '')
                    return itemValue === filterValue
                })
            }
        })

        return filtered
    }, [data, searchTerm, filters, columns])

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig.key || !sortable) return filteredAndSearchedData

        return [...filteredAndSearchedData].sort((a, b) => {
            const aValue = getNestedValue(a, sortConfig.key)
            const bValue = getNestedValue(b, sortConfig.key)

            // Handle arrays
            const aVal = Array.isArray(aValue) ? aValue.join(', ') : aValue
            const bVal = Array.isArray(bValue) ? bValue.join(', ') : bValue

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [filteredAndSearchedData, sortConfig])

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage
        return sortedData.slice(startIndex, startIndex + rowsPerPage)
    }, [sortedData, currentPage, rowsPerPage])

    const totalPages = Math.ceil(sortedData.length / rowsPerPage)

    const handleSort = (key) => {
        if (!sortable) return

        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev, [key]: value
        }))
    }

    const clearFilters = () => {
        setFilters({})
        setSearchTerm('')
    }

    const handleExportToExcel = () => {
        try {
            // Check if data has user_data field (user data structure)
            const hasUserData = sortedData.length > 0 && sortedData[0].hasOwnProperty('user_data')

            if (hasUserData) {
                // Use role-based export function for user data (separate Mentor/Mentee sheets)
                exportUsersToExcelByRole(sortedData, exportFilename)
            } else {
                // Use generic export for other data types
                exportToExcel(sortedData, exportFilename, 'Data')
            }
        } catch (error) {
            console.error('Export failed:', error)
            // You could add a notification here if using Mantine notifications
        }
    }

    const renderCellValue = (item, column) => {
        const value = getNestedValue(item, column.key)

        if (column.render) {
            return column.render(value, item)
        }

        if (Array.isArray(value)) {
            return (
                <Group gap="xs">
                    {value.map((val, index) => (
                        <Badge key={index} variant="light" size="sm">
                            {val}
                        </Badge>
                    ))}
                </Group>
            )
        }

        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value)
        }

        return value || '-'
    }

    const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length

    return (
        <Paper shadow="sm" p="md" className="w-full">
            {/* Header */}
            <div className="mb-4">
                <Flex justify="space-between" align="center" className="mb-4">
                    <Title order={2}>{title}</Title>
                    <Text size="sm" c="dimmed">
                        {sortedData.length} total records
                    </Text>
                </Flex>

                {/* Search and Filter Controls */}
                <div className="space-y-4">
                    <Flex gap="md" align="end" wrap="wrap">
                        {/* Search */}
                        {searchable && (
                            <TextInput
                                placeholder="Search across all columns..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftSection={<FiSearch size={16} />}
                                className="flex-1 min-w-64"
                            />
                        )}

                        {/* Filter Toggle */}
                        {filterable && (
                            <Button
                                variant={showFilters ? "filled" : "outline"}
                                leftSection={<FiFilter size={16} />}
                                rightSection={activeFiltersCount > 0 && (
                                    <Badge size="xs" variant="filled" color="red">
                                        {activeFiltersCount}
                                    </Badge>
                                )}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filters
                            </Button>
                        )}                        {/* Clear Filters */}
                        {(searchTerm || activeFiltersCount > 0) && (
                            <Button
                                variant="subtle"
                                leftSection={<FiX size={16} />}
                                onClick={clearFilters}
                            >
                                Clear all
                            </Button>
                        )}

                        {/* Export to Excel */}
                        {exportable && data.length > 0 && (
                            <Button
                                variant="outline"
                                leftSection={<FiDownload size={16} />}
                                onClick={handleExportToExcel}
                                color="green"
                            >
                                Export to Excel
                            </Button>
                        )}
                    </Flex>

                    {/* Filter Dropdowns */}
                    {filterable && showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                            {columns.filter(col => col.filterable !== false).map(column => (
                                <Select
                                    key={column.key}
                                    label={column.label}
                                    placeholder={`All ${column.label}`}
                                    value={filters[column.key] || null}
                                    onChange={(value) => handleFilterChange(column.key, value)}
                                    data={[
                                        { value: 'all', label: `All ${column.label}` },
                                        ...getUniqueValues(column.key).map(value => ({
                                            value: value,
                                            label: value
                                        }))
                                    ]}
                                    clearable
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            {columns.map(column => (
                                <Table.Th
                                    key={column.key}
                                    className={`${sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                >
                                    <Flex align="center" gap="xs">
                                        <Text fw={500}>{column.label}</Text>
                                        {sortable && column.sortable !== false && (
                                            <div className="flex flex-col">
                                                <FiChevronUp
                                                    size={12}
                                                    className={`${sortConfig.key === column.key && sortConfig.direction === 'asc'
                                                        ? 'text-blue-500'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                                <FiChevronDown
                                                    size={12}
                                                    className={`${sortConfig.key === column.key && sortConfig.direction === 'desc'
                                                        ? 'text-blue-500'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            </div>
                                        )}
                                    </Flex>
                                </Table.Th>
                            ))}
                            {onRowPreview && (
                                <Table.Th>
                                    <Text fw={500}>Actions</Text>
                                </Table.Th>
                            )}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <Table.Tr key={item.id || index} className="hover:bg-gray-50">
                                    {columns.map(column => (
                                        <Table.Td key={column.key}>
                                            {renderCellValue(item, column)}
                                        </Table.Td>
                                    ))}
                                    {onRowPreview && (
                                        <Table.Td>
                                            <ActionIcon
                                                variant="filled"
                                                color="blue"
                                                onClick={() => onRowPreview(item)}
                                            >
                                                <FiEye size={16} />
                                            </ActionIcon>
                                        </Table.Td>
                                    )}
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={columns.length + (onRowPreview ? 1 : 0)}>
                                    <div className="text-center py-12">
                                        <FiSearch size={48} className="mx-auto text-gray-300 mb-4" />
                                        <Text size="lg" fw={500} className="mb-2">No data found</Text>
                                        <Text size="sm" c="dimmed">Try adjusting your search or filter criteria</Text>
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4">
                    <Flex justify="space-between" align="center" wrap="wrap" gap="md">
                        <Text size="sm" c="dimmed">
                            Showing {((currentPage - 1) * rowsPerPage) + 1} to{' '}
                            {Math.min(currentPage * rowsPerPage, sortedData.length)} of{' '}
                            {sortedData.length} results
                        </Text>
                        <Pagination
                            value={currentPage}
                            onChange={setCurrentPage}
                            total={totalPages}
                            siblings={1}
                            boundaries={1}
                        />
                    </Flex>
                </div>
            )}
        </Paper>
    )
}

export default GenericTable
