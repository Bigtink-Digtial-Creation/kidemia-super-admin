import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Spinner,
    Chip,
    Button,
} from '@heroui/react';
import { formatDateToDDMMYYYY } from '../../../utils';
import { Edit, Trash2, Eye } from 'lucide-react';

interface RoleTableProps {
    roles: any[];
    isLoading: boolean;
    onEdit: (role: any) => void;
    onDelete: (roleId: string, roleName: string) => void;
    onViewDetails: (roleId: string) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
    roles,
    isLoading,
    onEdit,
    onDelete,
    onViewDetails,
}) => {
    return (
        <Table
            aria-label="Roles management table"
            shadow="none"
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            removeWrapper
        >
            <TableHeader>
                <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">ROLE NAME</TableColumn>
                <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">DESCRIPTION</TableColumn>
                <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">TYPE</TableColumn>
                <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-center">PERMISSIONS</TableColumn>
                <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold">CREATED</TableColumn>
                <TableColumn className="bg-gray-50/50 text-gray-500 font-semibold text-right">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                loadingContent={<Spinner color="warning" label="Fetching roles..." />}
                emptyContent={!isLoading && "No roles found matching your criteria."}
            >
                {roles.map((role) => (
                    <TableRow key={role.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-colors group">
                        <TableCell>
                            <button
                                onClick={() => onViewDetails(role.id)}
                                className="font-bold text-gray-900 hover:text-warning transition-colors text-left"
                            >
                                {role.display_name || role.name}
                            </button>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm text-gray-500 truncate max-w-[200px] block">
                                {role.description || '—'}
                            </span>
                        </TableCell>
                        <TableCell className="text-center">
                            <Chip
                                size="sm"
                                variant="flat"
                                color={role.is_system ? "default" : "warning"}
                                className="font-medium"
                            >
                                {role.is_system ? 'System' : 'Custom'}
                            </Chip>
                        </TableCell>
                        <TableCell className="text-center">
                            <div className="flex justify-center">
                                <span className="px-2.5 py-0.5 rounded-full bg-kidemia-secondary text-white text-xs font-bold border border-kidemia-primary/100">
                                    {role.permissions?.length || 0}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                            {formatDateToDDMMYYYY(role.created_at)}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center justify-end gap-1">
                                <Tooltip content="View Details">
                                    <Button isIconOnly size="sm" variant="light" onPress={() => onViewDetails(role.id)}>
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Edit Role">
                                    <Button isIconOnly size="sm" variant="light" color="warning" onPress={() => onEdit(role)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Tooltip>
                                {!role.is_system && (
                                    <Tooltip content="Delete Role" color="danger">
                                        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onDelete(role.id, role.display_name || role.name)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </Tooltip>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};