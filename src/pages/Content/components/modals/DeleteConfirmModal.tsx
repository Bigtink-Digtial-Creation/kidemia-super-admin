import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalBody className="py-8 px-6">
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                        <p className="text-gray-600">{message}</p>
                        <div className="flex gap-3">
                            <Button
                                variant="flat"
                                size="lg"
                                radius="sm"
                                className="flex-1"
                                onPress={onClose}
                                isDisabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="lg"
                                radius="sm"
                                className="flex-1 bg-red-600 text-white"
                                onPress={onConfirm}
                                isLoading={isLoading}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};