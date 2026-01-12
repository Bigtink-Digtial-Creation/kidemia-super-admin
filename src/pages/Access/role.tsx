import { useState, useEffect, useMemo } from 'react';
import {
    Button,
    Chip,
    useDisclosure,
    Input,
    addToast,
    ModalContent,
    ModalHeader,
    ModalBody,
    Modal,
    ModalFooter,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from '@heroui/react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Plus,
    Search,
    X,
    AlertCircle,
} from 'lucide-react';
import { useAddPermissionsToRole, usePermissions, useRemovePermissionFromRole, useRole } from '../../hooks/useRoles';
import BallSpinner from '../../components/Spinner/BallSpinner';
import { formatDateToDDMMYYYY } from '../../utils';
import { DeleteRoleModal } from './components/modals/DeleteRoleModal';
import { UpdateRoleModal } from './components/modals/UpdateRoleModal';
import { SidebarRoutes } from '../../routes';

export default function RoleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [modalSearch, setModalSearch] = useState('');

    // State for permissions selected in the modal
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    const updateModal = useDisclosure();
    const deleteModal = useDisclosure();
    const addPermModal = useDisclosure();

    const { role, isLoading } = useRole(id);
    const { permissions: allPermissions } = usePermissions();
    const addPermissions = useAddPermissionsToRole();
    const removePermission = useRemovePermissionFromRole();

    useEffect(() => {
        if (addPermModal.isOpen && role?.permissions) {
            const currentIds = role.permissions.map((p: any) => p.id.toString());
            setSelectedKeys(new Set(currentIds));
        }
    }, [addPermModal.isOpen, role]);

    const handleRemovePermission = async (permissionId: string) => {
        if (!id) return;
        try {
            await removePermission.mutateAsync({ roleId: id, permissionId });
            addToast({ title: 'Success', description: 'Permission removed', color: 'success' });
        } catch (error: any) {
            addToast({ title: 'Error', description: error.message, color: 'danger' });
        }
    };

    const handleUpdatePermissions = async () => {
        if (!id) return;
        const permissionIds = Array.from(selectedKeys);
        try {
            await addPermissions.mutateAsync({ roleId: id, permissionIds });
            addToast({ title: 'Success', description: 'Permissions updated', color: 'success' });
            addPermModal.onClose();
        } catch (error: any) {
            addToast({ title: 'Error', description: 'Failed to update', color: 'danger' });
        }
    };

    const filteredRolePermissions = useMemo(() => {
        return role?.permissions?.filter((perm: any) =>
            perm.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            perm.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
    }, [role, searchTerm]);

    const filteredAvailablePermissions = useMemo(() => {
        return allPermissions.filter((perm) =>
            perm.display_name?.toLowerCase().includes(modalSearch.toLowerCase()) ||
            perm.name?.toLowerCase().includes(modalSearch.toLowerCase())
        );
    }, [allPermissions, modalSearch]);

    if (isLoading && !role) return <div className="h-screen flex items-center justify-center"><BallSpinner /></div>;
    if (!role) return <div className="h-screen flex items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <Button color="warning" onPress={() => navigate(SidebarRoutes.roles)}>Back to Roles</Button>
    </div>;

    return (
        <main className="max-w-[1400px] mx-auto pb-10">

            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="light" onPress={() => navigate(SidebarRoutes.roles)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-medium text-gray-900">{role.display_name}</h1>
                    <Chip size="sm" variant="flat" color={role.is_system ? 'default' : 'primary'}>
                        {role.is_system ? 'System' : 'Custom'}
                    </Chip>
                </div>
                <div className="flex gap-2">
                    <Button className='bg-kidemia-primary text-white' size="sm" startContent={<Edit className="h-4 w-4" />} onPress={updateModal.onOpen}>Edit Role</Button>
                    {!role.is_system && (
                        <Button variant="bordered" color="danger" size="sm" startContent={<Trash2 className="h-4 w-4" />} onPress={deleteModal.onOpen}>Delete</Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-12 mb-10 text-sm">
                <div className="col-span-1">
                    <span className="text-gray-500 block mb-1">Label</span>
                    <span className="font-mono text-gray-900">{role.name}</span>
                </div>
                <div className="col-span-1">
                    <span className="text-gray-500 block mb-1">Created</span>
                    <span className="text-gray-900">{formatDateToDDMMYYYY(role.created_at)}</span>
                </div>
                <div className="col-span-1">
                    <span className="text-gray-500 block mb-1">Status</span>
                    <span className="text-gray-900">Enabled</span>
                </div>
                <div className="col-span-1 md:col-span-4">
                    <span className="text-gray-500 block mb-1">Description</span>
                    <span className="text-gray-900">{role.description || 'No description provided.'}</span>
                </div>
            </div>

            <div className="bg-white rounded-none border border-gray-200">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="text-lg font-medium text-gray-800">Permissions</h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Input
                            placeholder="Filter permissions..."
                            size="sm"
                            startContent={<Search className="h-4 w-4 text-gray-400" />}
                            className="max-w-xs"
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                        <Button
                            color="primary"
                            size="sm"
                            className="bg-kidemia-primary rounded-md"
                            startContent={<Plus className="h-4 w-4" />}
                            onPress={addPermModal.onOpen}
                        >
                            Add Permissions
                        </Button>
                    </div>
                </div>

                <Table aria-label="Permissions table" removeWrapper className="min-h-[200px]">
                    <TableHeader>
                        <TableColumn className="bg-transparent border-b">PERMISSION</TableColumn>
                        <TableColumn className="bg-transparent border-b">RESOURCE</TableColumn>
                        <TableColumn className="bg-transparent border-b">ACTION</TableColumn>
                        <TableColumn className="bg-transparent border-b text-right">REMOVE</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No permissions found for this role."}>
                        {filteredRolePermissions.map((permission: any) => (
                            <TableRow key={permission.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <TableCell>
                                    <div>
                                        <div className="font-medium text-gray-900">{permission.display_name}</div>
                                        <div className="text-xs text-gray-500">{permission.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-600">{permission.resource}</TableCell>
                                <TableCell>
                                    <Chip size="sm" variant="flat" className="capitalize">{permission.action}</Chip>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleRemovePermission(permission.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={addPermModal.isOpen} onClose={addPermModal.onClose} size="3xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 border-b">
                        <span>Add Permissions</span>
                        <p className="text-xs font-normal text-gray-500">Select permissions to grant to this role. Pre-checked Permissions are already assigned.</p>
                    </ModalHeader>
                    <ModalBody className="p-0">
                        <div className="p-4 border-b bg-gray-50">
                            <Input
                                placeholder="Filter by permission name or ID"
                                variant="bordered"
                                size="sm"
                                value={modalSearch}
                                onValueChange={setModalSearch}
                                startContent={<Search className="h-4 w-4 text-gray-400" />}
                            />
                        </div>
                        <div className="max-h-[500px]">
                            <Table
                                removeWrapper
                                aria-label="Available permissions selection"
                                selectionMode="multiple"
                                selectedKeys={selectedKeys}
                                onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
                            >
                                <TableHeader>
                                    <TableColumn>PERMISSION NAME</TableColumn>
                                    <TableColumn>DESCRIPTION</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {filteredAvailablePermissions.map((perm) => (
                                        <TableRow key={perm.id.toString()} className="border-b border-gray-100 last:border-0">
                                            <TableCell>
                                                <div className="font-medium text-kidemia-primary text-xs">{perm.name}</div>
                                                <div className="text-xs text-gray-500">{perm.display_name}</div>
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-600 truncate max-w-xs">{perm.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </ModalBody>
                    <ModalFooter className="border-t">
                        <Button variant="light" size="sm" onPress={addPermModal.onClose}>Cancel</Button>
                        <Button color="primary" size="sm" className="bg-kidemia-primary" onPress={handleUpdatePermissions}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <UpdateRoleModal isOpen={updateModal.isOpen} onClose={updateModal.onClose} role={role} />
            <DeleteRoleModal
                isOpen={deleteModal.isOpen}
                onClose={() => { deleteModal.onClose(); navigate(SidebarRoutes.roles); }}
                roleId={id || ''}
                roleName={role.display_name || role.name}
            />
        </main>
    );
}