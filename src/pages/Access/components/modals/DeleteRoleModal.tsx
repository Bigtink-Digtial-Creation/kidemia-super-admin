import { AlertTriangle } from 'lucide-react';
import { useDeleteRole } from '../../../../hooks/useRoles';
import {
    addToast, Button, Modal, ModalBody,
    ModalContent, ModalFooter, ModalHeader
} from '@heroui/react';

interface DeleteRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    roleId: string;
    roleName: string;
}

export const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
    isOpen,
    onClose,
    roleId,
    roleName,
}) => {
    const deleteRole = useDeleteRole();

    const handleDelete = async () => {
        try {
            await deleteRole.mutateAsync(roleId);
            addToast({
                title: 'Success',
                description: 'Role deleted successfully',
                color: 'success',
            });
            onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to delete role',
                color: 'danger',
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader className="flex gap-2 items-center border-b pb-4">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600">Delete Role</span>
                </ModalHeader>
                <ModalBody className="py-6">
                    <p className="text-gray-700">
                        Are you sure you want to delete the role{' '}
                        <span className="font-semibold text-kidemia-primary">
                            {roleName}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> Deleting this role will remove all
                            associated permissions and may affect users assigned to this role.
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter className="border-t">
                    <Button
                        variant="flat"
                        color="default"
                        onPress={onClose}
                        isDisabled={deleteRole.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="danger"
                        onPress={handleDelete}
                        isLoading={deleteRole.isPending}
                    >
                        Delete Role
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};