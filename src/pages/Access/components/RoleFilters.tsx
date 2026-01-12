import { Input, Select, SelectItem, Button } from '@heroui/react';
import { Search, X, Filter } from 'lucide-react';

interface RoleFiltersProps {
    filters: {
        search: string;
        roleType: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
}

export const RoleFilters: React.FC<RoleFiltersProps> = ({
    filters,
    onFilterChange,
    onClearFilters,
}) => {
    const hasActiveFilters = filters.search || filters.roleType !== 'all';

    return (
        <div className="flex flex-col lg:flex-row items-center gap-3 w-full">
            <div className="relative w-full lg:flex-1">
                <Input
                    placeholder="Search roles..."
                    value={filters.search}
                    onValueChange={(val) => onFilterChange('search', val)}
                    startContent={<Search className="h-4 w-4 text-gray-400" />}
                    isClearable
                    onClear={() => onFilterChange('search', '')}
                    variant="bordered"
                    className="w-full"
                    classNames={{
                        inputWrapper: "bg-white hover:border-warning focus-within:!border-warning transition-colors"
                    }}
                />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
                <Select
                    aria-label="Filter by Type"
                    placeholder="All Types"
                    selectedKeys={[filters.roleType]}
                    onChange={(e) => onFilterChange('roleType', e.target.value)}
                    variant="bordered"
                    className="w-full lg:w-44"
                    startContent={<Filter className="h-3.5 w-3.5 text-gray-400" />}
                >
                    <SelectItem key="all" textValue="All Types">All Types</SelectItem>
                    <SelectItem key="system" textValue="System Roles">System Roles</SelectItem>
                    <SelectItem key="custom" textValue="Custom Roles">Custom Roles</SelectItem>
                    <SelectItem key="institution" textValue="Institution Roles">Institution Roles</SelectItem>

                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="light"
                        color="danger"
                        onPress={onClearFilters}
                        startContent={<X className="h-4 w-4" />}
                        className="min-w-unit-20"
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
};