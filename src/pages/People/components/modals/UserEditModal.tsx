import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { RoleResponse, UserListResponse, UserUpdate } from '../../../../sdk/generated';

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserListResponse | null;
    availableRoles: RoleResponse[];
    onSave: (userId: string, data: UserUpdate) => Promise<void>;
    onUpdateRole: (userId: string, roleId: string) => Promise<void>;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
    isOpen,
    onClose,
    user,
    availableRoles,
    onSave,
    onUpdateRole,
}) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        phone_number: '',
        email: '',
        roleId: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                middle_name: user.middle_name || '',
                phone_number: user.phone_number || '',
                email: user.email || '',
                roleId: user.role?.id || '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setError(null);

        try {
            const roleChanged = formData.roleId !== user.role?.id;

            // Check if any user data changed
            const userDataChanged =
                formData.first_name !== (user.first_name || '') ||
                formData.last_name !== (user.last_name || '') ||
                formData.middle_name !== (user.middle_name || '') ||
                formData.phone_number !== (user.phone_number || '');

            // Update basic info if changed
            if (userDataChanged) {
                const updateData: UserUpdate = {
                    first_name: formData.first_name || null,
                    last_name: formData.last_name || null,
                    middle_name: formData.middle_name || null,
                    phone_number: formData.phone_number || null,
                };

                await onSave(user.id, updateData);
            }

            // Update role if changed
            if (roleChanged) {
                await onUpdateRole(user.id, formData.roleId);
            }

            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update user');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="fixed inset-0 backdrop-blur-sm"
                    onClick={onClose}
                />
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Edit User
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, first_name: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, last_name: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Middle Name
                            </label>
                            <input
                                type="text"
                                value={formData.middle_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, middle_name: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phone_number}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone_number: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="+234 XXX XXX XXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                required
                                disabled
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Email cannot be changed
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.roleId}
                                onChange={(e) =>
                                    setFormData({ ...formData, roleId: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select a role</option>
                                {availableRoles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.display_name.charAt(0).toUpperCase() + role.display_name.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {formData.roleId !== user?.role?.id && (
                                <p className="mt-1 text-xs text-kidemia-primary">
                                    Changing role will update user permissions immediately
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 px-4 py-2 bg-kidemia-primary text-white rounded-lg hover:bg-kidemia-primary/90 transition-colors flex items-center 
                               justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};