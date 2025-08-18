"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const { user } = useAuth();
  if (!user) return <></>;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleLogout = async () => {
    try {
      await toast.promise(signOut(auth), {
        error: (e) => e.message,
        loading: "Logging out...",
        success: "Logged out successfully",
      });
    } catch (error) {
      toast.error("Logout failed" + error.message);
    }
  };
  return (
    <>
      <button
        className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
        onClick={onOpen}
      >
        <LogOut size={20} />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to log out?
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleLogout}>
                  Log Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LogoutButton;
