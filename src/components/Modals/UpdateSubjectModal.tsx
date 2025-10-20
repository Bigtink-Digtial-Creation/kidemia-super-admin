import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { MdOutlineFormatColorFill, MdOutlineMessage, MdSubject } from "react-icons/md";
import { colors, isActiveList, isFeaturedList } from "../../staticData";
import { VscFolderActive } from "react-icons/vsc";

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
      <div className="space-y-8">
        <ModalContent className="px-4">
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-2xl text-kidemia-primary">Subject Details</h3>
            <span className="text-sm text-kidemia-grey">
              You can update the subject details by clicking the edit button
            </span>
          </ModalHeader>
          <ModalBody>
            <Form className="py-4 space-y-2">

              <div className="pb-2 w-full">
                <Input variant="flat" size="lg" radius="sm"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  label="Subject Name"
                  labelPlacement="inside"
                />
              </div>

              <div className="pb-2 w-full">
                <Input variant="flat" size="lg" radius="sm"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  label="Subject Code"
                  labelPlacement="inside"
                />
              </div>

              <div className="pb-2 w-full">
                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Subject Colour"
                  labelPlacement="inside"
                  startContent={
                    <MdOutlineFormatColorFill className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                // selectedKeys={selectedColor ? [selectedColor] : []}
                // onChange={(e) => handleColorChange(e.target.value)}
                >
                  {colors.map((color) => (
                    <SelectItem key={color.key}>{color.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="pb-2 w-full">
                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Subject Active Status"
                  labelPlacement="inside"
                  startContent={
                    <VscFolderActive className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                // selectedKeys={selectedColor ? [selectedColor] : []}
                // onChange={(e) => handleColorChange(e.target.value)}
                >
                  {isActiveList.map((act) => (
                    <SelectItem key={act.key}>{act.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="pb-2 w-full">
                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Subject Featured Status"
                  labelPlacement="inside"
                  startContent={
                    <VscFolderActive className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                // selectedKeys={selectedColor ? [selectedColor] : []}
                // onChange={(e) => handleColorChange(e.target.value)}
                >
                  {isFeaturedList.map((feat) => (
                    <SelectItem key={feat.key}>{feat.label}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="pb-2 w-full">
                <Textarea
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Subject Description"
                  startContent={
                    <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  label="Subject Description"
                  labelPlacement="inside"
                />
              </div>

              <div className="py-4 w-full flex justify-between items-center space-x-12 gap-4">

                <Button
                  className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary"
                  variant="faded"
                  size="md"
                  radius="sm"
                  type="button"
                  fullWidth
                  onPress={() => onClose()}
                >
                  No, Cancel
                </Button>
                <Button
                  className="bg-kidemia-secondary text-kidemia-white font-medium"
                  size="md"
                  radius="sm"
                  type="submit"
                  fullWidth
                  onPress={() => {
                    console.log(id);
                    onClose();
                  }}
                >
                  Edit Subject
                </Button>

              </div>

            </Form>
          </ModalBody>
        </ModalContent>
      </div>
    </Modal>
  );
}
