import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { MdOutlineMessage, MdSubject } from "react-icons/md";
import { PiLockKeyFill } from "react-icons/pi";

interface AddRoleModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

const roleType = [
  { key: "custom", label: "Custom" },
  { key: "system", label: "System" },
];
export default function AddRoleModal({
  isOpen,
  onOpenChange,
  onClose,
}: AddRoleModalI) {
  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="py-8">
          <div className="flex flex-col justify-center px-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center">
                Add a Role
              </h3>
              <p className="text-kidemia-grey text-md text-center ">
                Fill the form to add a role
              </p>
            </div>

            <Form className="py-4 space-y-2">
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Name of Role"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  description="A unique role name"
                />
              </div>
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Role Display Name"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  description="Human-readable role name"
                />
              </div>

              <div className="pb-2 w-full">
                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Role Type"
                  startContent={
                    <PiLockKeyFill className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                >
                  {roleType.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="pb-2 w-full">
                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Role Permissions"
                  startContent={
                    <PiLockKeyFill className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                >
                  {roleType.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="pb-2 w-full">
                <Textarea
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Role Description"
                  startContent={
                    <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                />
              </div>

              <div className="py-4 w-full">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                >
                  Add Role
                </Button>
              </div>
            </Form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
