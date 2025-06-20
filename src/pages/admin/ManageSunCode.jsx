import React, { useState, useEffect } from 'react';
import {
    getAllSunCodes,
    createSunCode,
    updateSunCode,
    deleteSunCode,
    uploadSunCodes,
    bulkDeleteSunCodes,
    bulkUpdateStatus
} from '../../services/suncodes.service';

const ManageSunCode = () => {
    const [sunCodes, setSunCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [itemsPerPage] = useState(10);

    // Search
    const [searchTerm, setSearchTerm] = useState('');

    // Form states
    const [showAddForm, setShowAddForm] = useState(false);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [editingCode, setEditingCode] = useState(null);
    const [selectedCodes, setSelectedCodes] = useState([]);

    // Form data
    const [formData, setFormData] = useState({
        code: '',
        label: '',
        is_active: true
    });
    const [bulkCodes, setBulkCodes] = useState('');
    const [bulkLabel, setBulkLabel] = useState('');

    useEffect(() => {
        fetchSunCodes();
    }, [currentPage, searchTerm]);

    const fetchSunCodes = async () => {
        setLoading(true);
        try {
            const result = await getAllSunCodes(currentPage, itemsPerPage, searchTerm);
            if (result.error) {
                setError(result.error.message);
            } else {
                setSunCodes(result.data);
                setTotalCount(result.count);
            }
        } catch (err) {
            setError('Failed to fetch sun codes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            let result;
            if (editingCode) {
                result = await updateSunCode(editingCode.id, formData);
            } else {
                result = await createSunCode(formData.code, formData.label, formData.is_active);
            }

            if (result.error) {
                setError(result.error.message);
            } else {
                setSuccess(editingCode ? 'Sun code updated successfully' : 'Sun code created successfully');
                setFormData({
                    code: '',
                    label: '',
                    is_active: true
                });
                setEditingCode(null);
                setShowAddForm(false);
                fetchSunCodes();
            }
        } catch (err) {
            setError('Failed to save sun code');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (code) => {
        setEditingCode(code);
        setFormData({
            code: code.code,
            label: code.label || '',
            is_active: code.is_active
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sun code?')) return;

        setLoading(true);
        try {
            const result = await deleteSunCode(id);
            if (result.error) {
                setError(result.error.message);
            } else {
                setSuccess('Sun code deleted successfully');
                fetchSunCodes();
            }
        } catch (err) {
            setError('Failed to delete sun code');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!bulkCodes.trim()) return;

        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const codes = bulkCodes.split('\n').map(code => code.trim()).filter(code => code);

            if (codes.length === 0) {
                setError('Please enter at least one code');
                setLoading(false);
                return;
            }

            const result = await uploadSunCodes(codes, bulkLabel);

            if (result.success) {
                setSuccess(`${codes.length} sun codes uploaded successfully`);
                setBulkCodes('');
                setBulkLabel('');
                setShowBulkUpload(false);
                fetchSunCodes();
            } else {
                setError(result.error?.message || 'Failed to upload sun codes');
            }
        } catch (err) {
            setError('Failed to upload sun codes: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedCodes.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedCodes.length} sun codes?`)) return;

        setLoading(true);
        try {
            const result = await bulkDeleteSunCodes(selectedCodes);
            if (result.error) {
                setError(result.error.message);
            } else {
                setSuccess(`${selectedCodes.length} sun codes deleted successfully`);
                setSelectedCodes([]);
                fetchSunCodes();
            }
        } catch (err) {
            setError('Failed to delete sun codes');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkStatusUpdate = async (isActive) => {
        if (selectedCodes.length === 0) return;
        const action = isActive ? 'activate' : 'deactivate';
        if (!window.confirm(`Are you sure you want to ${action} ${selectedCodes.length} sun codes?`)) return;

        setLoading(true);
        try {
            const result = await bulkUpdateStatus(selectedCodes, isActive);
            if (result.error) {
                setError(result.error.message);
            } else {
                setSuccess(`${selectedCodes.length} sun codes ${action}d successfully`);
                setSelectedCodes([]);
                fetchSunCodes();
            }
        } catch (err) {
            setError(`Failed to ${action} sun codes`);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCodes(sunCodes.map(code => code.id));
        } else {
            setSelectedCodes([]);
        }
    };

    const handleSelectCode = (id) => {
        setSelectedCodes(prev =>
            prev.includes(id)
                ? prev.filter(codeId => codeId !== id)
                : [...prev, id]
        );
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Sun Codes</h1>
                <div className="space-x-2">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Sun Code
                    </button>
                    <button
                        onClick={() => setShowBulkUpload(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Bulk Upload
                    </button>
                    {selectedCodes.length > 0 && (
                        <>
                            <button
                                onClick={() => handleBulkStatusUpdate(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Activate Selected ({selectedCodes.length})
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate(false)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                                Deactivate Selected ({selectedCodes.length})
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete Selected ({selectedCodes.length})
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search sun codes or labels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {/* Add/Edit Form */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCode ? 'Edit Sun Code' : 'Add Sun Code'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Code</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Label</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter label..."
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingCode(null);
                                        setFormData({
                                            code: '',
                                            label: '',
                                            is_active: true
                                        });
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Upload Form */}
            {showBulkUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Bulk Upload Sun Codes</h2>
                        <form onSubmit={handleBulkUpload}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Codes (one per line)
                                </label>
                                <textarea
                                    value={bulkCodes}
                                    onChange={(e) => setBulkCodes(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                                    placeholder="Enter codes, one per line..."
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Label</label>
                                <input
                                    type="text"
                                    value={bulkLabel}
                                    onChange={(e) => setBulkLabel(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter label for all codes..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBulkUpload(false);
                                        setBulkCodes('');
                                        setBulkLabel('');
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                    {loading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedCodes.length === sunCodes.length && sunCodes.length > 0}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Label
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
                            </tr>
                        ) : sunCodes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">No sun codes found</td>
                            </tr>
                        ) : (
                            sunCodes.map((code) => (
                                <tr key={code.id}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCodes.includes(code.id)}
                                            onChange={() => handleSelectCode(code.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {code.code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {code.label || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${code.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {code.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(code)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(code.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 border border-gray-300 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSunCode;