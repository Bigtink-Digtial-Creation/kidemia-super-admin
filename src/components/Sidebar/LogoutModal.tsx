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
import { ApiSDK } from "../../sdk";

interface ModalProp {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

export default function LogoutModal({
  isOpen,
  onOpenChange,
  onClose,
}: ModalProp) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const logOut = async () => {
    setIsLoading(true);

    try {
      await ApiSDK.AuthenticationService.logoutAllDevicesApiV1AuthLogoutAllPost();
      localStorage.clear();

      addToast({
        title: "Logged out successfully",
        color: "success",
      });

      onClose();
      navigate(AuthRoutes.login);
    } catch (error: any) {
      addToast({
        title: error?.message || "Logout failed",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
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
            <div className="p-6 bg-kidemia-beige rounded-full">
              <AiOutlineLogout className="w-8 h-8 text-kidemia-secondary" />
            </div>
            <div className="px-6 space-y-3">
              <h3 className="text-kidemia-secondary text-xl font-semibold text-center">
                Are you sure you want to log out?
              </h3>
              <p className="text-sm text-kidemia-grey text-center">
                You'll need to log in again to access your account.
              </p>
            </div>
          </div>

          <div className="py-4 w-full flex flex-col md:flex-row gap-6 items-center">
            <Button
              variant="faded"
              size="md"
              radius="sm"
              className="bg-kidemia-beige border border-enita-black2 font-medium text-kidemia-primary w-full"
              onPress={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="md"
              radius="sm"
              className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
              onPress={logOut}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Log out
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}