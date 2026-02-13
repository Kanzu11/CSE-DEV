import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Shield, User, Star, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SuperAdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            setMessage({ type: 'error', text: 'Failed to fetch users' });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
            setMessage({ type: 'success', text: `User role updated to ${newRole}` });

            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Update failed', error);
            setMessage({ type: 'error', text: 'Failed to update user role' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:flex md:items-center md:justify-between"
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                            <Star className="w-8 h-8 text-yellow-500 mr-3" />
                            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
                                Super Admin Dashboard
                            </h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 ml-11">
                            Manage user roles and system privileges.
                        </p>
                    </div>
                </motion.div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-md p-4 mb-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}
                    >
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {message.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                )}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                    {message.text}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Users List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Registered Users ({users.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Role
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                                                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {user.role !== 'superadmin' && (
                                                    <div className="flex justify-end space-x-2">
                                                        {user.role === 'user' && (
                                                            <button
                                                                onClick={() => handleRoleUpdate(user._id, 'admin')}
                                                                className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                                                            >
                                                                Promote to Admin
                                                            </button>
                                                        )}
                                                        {user.role === 'admin' && (
                                                            <button
                                                                onClick={() => handleRoleUpdate(user._id, 'user')}
                                                                className="text-orange-600 hover:text-orange-900 bg-orange-50 px-3 py-1 rounded-full hover:bg-orange-100 transition-colors"
                                                            >
                                                                Demote to User
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {user.email === 'superadmin@example.com' && (
                                                    <span className="text-gray-400 italic text-xs">Primary SuperAdmin</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
