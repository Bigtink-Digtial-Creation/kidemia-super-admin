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

interface DeleteSubjectModalI {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  id: string;
  name: string;
}

export default function DeleteSubjectModal({
  isOpen,
  onClose,
  onOpenChange,
  id,
  name,
}: DeleteSubjectModalI) {
  const queryClient = useQueryClient();

  const deleteSubjectMutation = useMutation({
    mutationFn: (id: string) =>
      ApiSDK.SubjectsService.deleteSubjectApiV1SubjectsSubjectIdDelete(id),
    onSuccess(data) {
      onClose();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.subjects] });
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
                Are you sure you want to delete this subject({name})
              </h3>
              <p className="text-sm  text-kidemia-grey">
                Deleting this subject will revoke your access to the subject and
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
              className="bg-kidemia-biege border border-kidemia-black3 font-medium text-kidemia-primary w-full"
              isDisabled={deleteSubjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              className="bg-kidemia-secondary text-kidemia-white font-medium"
              onPress={() => {
                deleteSubjectMutation.mutate(id);
              }}
              isLoading={deleteSubjectMutation.isPending}
              isDisabled={deleteSubjectMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
