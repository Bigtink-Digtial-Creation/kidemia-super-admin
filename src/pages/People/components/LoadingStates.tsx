import React from 'react';
import { Users, UserPlus, RefreshCw } from 'lucide-react';

// TypeScript interfaces
interface EmptyStateProps {
    onClearFilters: () => void;
    hasFilters: boolean;
}

interface ErrorStateProps {
    error: Error | null;
    onRetry: () => void;
}

// Loading Skeleton Component
export const TableSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {['User', 'Email', 'Role', 'Status', 'Created', 'Actions'].map((header, i) => (
                                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
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

// Empty State Component
export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters, hasFilters }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {hasFilters ? 'No users found' : 'No users yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                    {hasFilters
                        ? 'Try adjusting your filters to find what you\'re looking for.'
                        : 'Get started by adding your first user to the platform.'}
                </p>
                {hasFilters ? (
                    <button
                        onClick={onClearFilters}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Clear Filters
                    </button>
                ) : (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                        <UserPlus className="h-4 w-4" />
                        Add First User
                    </button>
                )}
            </div>
        </div>
    );
};

// Error State Component
export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-12">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Failed to load users
                </h3>
                <p className="text-gray-600 mb-6">
                    {error?.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
};

// Stats Skeleton
export const StatsSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    );
};




