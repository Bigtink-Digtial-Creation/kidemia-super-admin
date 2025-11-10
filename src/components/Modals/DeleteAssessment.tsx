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

interface DeleteAssessmentI {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  assessment_id: string;
  name: string;
}

export default function DeleteAssessmentModal({
  isOpen,
  onClose,
  onOpenChange,
  assessment_id,
  name,
}: DeleteAssessmentI) {
  const queryClient = useQueryClient();

  const deleteAsstMutation = useMutation({
    mutationFn: (assessment_id: string) =>
      ApiSDK.AssessmentsService.deleteAssessmentApiV1AssessmentsAssessmentIdDelete(
        assessment_id,
      ),
    onSuccess(data) {
      onClose();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.allAssessment] });
      addToast({
        title: data.message,
        color: "success",
      });
    },
    onError(error) {
      onClose();
      let parsedMessage = "Something went wrong";
      try {
        const parsedError = apiErrorParser(error);
        parsedMessage = parsedError?.message || parsedMessage;
      } catch (e) {
        console.error("Error parsing API error:", e);
      }
      addToast({
        title: "An error occurred",
        description: parsedMessage,
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
                Are you sure you want to delete {name}
              </h3>
              <p className="text-sm  text-kidemia-grey">
                Deleting this assessment will revoke your access to the
                assessment and remove all traces of it from Kidemia database.
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
              isDisabled={deleteAsstMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              className="bg-red-500 text-kidemia-white font-semibold"
              onPress={() => {
                deleteAsstMutation.mutate(assessment_id);
              }}
              isLoading={deleteAsstMutation.isPending}
              isDisabled={deleteAsstMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
