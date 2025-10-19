import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
interface UpdateSubjectModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  id: string;
}
export default function UpdateSubjectModal({
  isOpen,
  onOpenChange,
  onClose,
  id,
}: UpdateSubjectModalI) {
  return (
    <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <form className="space-y-8">
        <ModalContent className="px-4">
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-2xl text-kidemia-primary">Subject Details</h3>
            <span className="text-sm text-kidemia-grey">
              You can update the subject details by clicking the edit button
            </span>
          </ModalHeader>

          <ModalBody>
            <div>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa in
              dolorem blanditiis tempora commodi atque, deserunt aliquid nisi
              est illum possimus exercitationem harum nobis, id a temporibus,
              ipsum maxime voluptatibus?
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              className="bg-kidemia-secondary text-kidemia-white font-medium"
              type="submit"
              fullWidth
              onPress={() => {
                console.log(id);
                onClose();
              }}
            >
              Edit Subject
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
