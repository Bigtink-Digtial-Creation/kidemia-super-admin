import React from 'react';
import { User, MoreVertical, Edit, Ban, CheckCircle, Trash2, Mail } from 'lucide-react';
import type { UserListResponse } from '../../../../sdk/generated';
import { getFullName, getStatusBadgeColor, getUserStatus } from '../../../../utils';

interface UserTableProps {
    users: UserListResponse[];
    isLoading: boolean;
    onEditUser: (user: UserListResponse) => void;
    onToggleStatus: (userId: string, currentStatus: boolean) => void;
    onDeleteUser: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    isLoading,
    onEditUser,
    onToggleStatus,
    onDeleteUser,
}) => {
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
                ))}
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No users found</h3>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your filters.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* MOBILE LIST VIEW (Visible on < 640px) */}
            <div className="block sm:hidden space-y-3">
                {users.map((user) => (
                    <div key={user.id} className=" p-4 shadow-sm active:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Avatar with Status Indicator */}
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-2xl bg-kidemia-primary/10 flex items-center justify-center text-kidemia-primary font-bold text-lg">
                                        {getFullName(user).charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                </div>

                                <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">
                                        {getFullName(user) || "Anonymous User"}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Mail className="h-3 w-3" />
                                        <span className="text-xs truncate max-w-[150px]">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Actions Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <MoreVertical className="h-5 w-5 text-slate-400" />
                                </button>

                                {openMenuId === user.id && (
                                    <>
                                        {/* Invisible backdrop to close menu */}
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white ring-1 ring-slate-200 z-20 overflow-hidden">
                                            <div className="py-1">
                                                <button onClick={() => { onEditUser(user); setOpenMenuId(null); }} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                                                    <Edit className="h-4 w-4 text-slate-400" /> Edit
                                                </button>
                                                <button onClick={() => { onToggleStatus(user.id, user.is_active); setOpenMenuId(null); }} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                                                    {user.is_active ? <><Ban className="h-4 w-4 text-slate-400" /> Suspend</> : <><CheckCircle className="h-4 w-4 text-slate-400" /> Activate</>}
                                                </button>
                                                <div className="h-px bg-slate-100 my-1" />
                                                <button onClick={() => { onDeleteUser(user.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DESKTOP TABLE VIEW (Visible on > 640px) */}
            <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-xl bg-kidemia-primary/10 flex items-center justify-center text-kidemia-primary font-bold text-sm">
                                            {getFullName(user).charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-slate-900">{getFullName(user) || "Anonymous User"}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                                        {user.role?.display_name || 'No Role'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadgeColor(user.is_active)}`}>
                                        {getUserStatus(user.is_active)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="relative inline-block text-left">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                        >
                                            <MoreVertical className="h-5 w-5 text-slate-400" />
                                        </button>
                                        {openMenuId === user.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white ring-1 ring-slate-200 z-20">
                                                    <div className="py-1">
                                                        <button onClick={() => { onEditUser(user); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                                            <Edit className="h-4 w-4" /> Edit User
                                                        </button>
                                                        <button onClick={() => { onToggleStatus(user.id, user.is_active); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                                            {user.is_active ? <><Ban className="h-4 w-4" /> Suspend</> : <><CheckCircle className="h-4 w-4" /> Activate</>}
                                                        </button>
                                                        <button onClick={() => { onDeleteUser(user.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};