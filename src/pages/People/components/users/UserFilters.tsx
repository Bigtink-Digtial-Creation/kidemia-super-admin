import { Search, X } from 'lucide-react';
import type { RoleResponse } from '../../../../sdk/generated';

interface UserFiltersProps {
    filters: {
        search: string;
        role: string;
        status: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
    availableRoles: RoleResponse[];
}

export const UserFilters: React.FC<UserFiltersProps> = ({
    filters,
    onFilterChange,
    onClearFilters,
    availableRoles,
}) => {
    const hasActiveFilters =
        filters.search || filters.role !== 'all' || filters.status !== 'all';

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={filters.role}
                        onChange={(e) => onFilterChange('role', e.target.value)}
                        className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white"
                    >
                        <option className='text-sm' value="all">All Roles</option>
                        {availableRoles.map((role) => (
                            <option className='text-sm' key={role.id} value={role.name}>
                                {role.display_name.charAt(0).toUpperCase() + role.display_name.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
