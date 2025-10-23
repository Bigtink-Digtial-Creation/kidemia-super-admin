import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiTrash2 } from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { apiErrorParser } from "../../utils/errorParser";

interface DeleteRoleModalI {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  role_id: string;
  name: string;
}

export default function DeleteRoleModal({
  isOpen,
  onClose,
  onOpenChange,
  role_id,
  name,
}: DeleteRoleModalI) {
  const queryClient = useQueryClient();

  const deleteRoleMutation = useMutation({
    mutationFn: (role_id: string) =>
      ApiSDK.RolesService.deleteRoleApiV1RolesRoleIdDelete(role_id),
    onSuccess(data) {
      onClose();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.roles] });
      addToast({
        title: data.message,
        color: "success",
      });
    },
    onError(error) {
      onClose();
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
    },
  });
  return (
    <Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody>
          <div className="flex flex-col p-4 space-y-8">
            <div className="rounded-full bg-gray-100 w-14 h-14 flex justify-center items-center mx-auto">
              <div className="rounded-full bg-white w-10 h-10 flex justify-center items-center">
                <FiTrash2 className="text-2xl text-red-400" />
              </div>
            </div>
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-semibold text-kidemia-primary">
                Are you sure you want to delete this {name} Role
              </h3>
              <p className="text-sm  text-kidemia-grey">
                Deleting this role will revoke your access to the role and
                remove all traces of it from Kidemia database.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex gap-3 w-full">
            <Button
              onPress={onClose}
              fullWidth
              className="bg-kidemia-biege border border-kidemia-black3 font-semibold text-kidemia-primary w-full"
              isDisabled={deleteRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              className="bg-red-500 text-kidemia-white font-semibold"
              onPress={() => {
                deleteRoleMutation.mutate(role_id);
              }}
              isLoading={deleteRoleMutation.isPending}
              isDisabled={deleteRoleMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
