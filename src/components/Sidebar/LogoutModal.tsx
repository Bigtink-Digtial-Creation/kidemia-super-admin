import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router";
import { AuthRoutes } from "../../routes";

interface LogoutModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

export default function LogoutModal({
  isOpen,
  onOpenChange,
  onClose,
}: LogoutModalI) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const logOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      addToast({
        title: "Logout Successful",
        color: "success",
      });
      navigate(AuthRoutes.login);
    }, 2000);
  };

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="py-6">
          <div className="flex flex-col justify-center items-center space-y-4">
            <div className="p-6 bg-kidemia-biege rounded-full">
              <AiOutlineLogout className="w-8 h-8 text-kidemia-secondary" />
            </div>
            <div className="px-6 space-y-3">
              <h3 className="text-kidemia-secondary text-xl font-semibold text-center">
                Are you sure you want to log out?
              </h3>
              <p className="text-sm text-kidemia-grey text-center">
                Logging out will end your current session, and you'll need to
                log in again to access your account.
              </p>
            </div>
          </div>

          <div className="py-4 w-full flex flex-col md:flex-row gap-6 items-center">
            <Button
              variant="faded"
              size="md"
              radius="sm"
              className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
              onPress={onClose}
            >
              No, keep me logged in
            </Button>
            <Button
              color="primary"
              size="md"
              radius="sm"
              className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
              onPress={() => logOut()}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Yes, log me out
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
