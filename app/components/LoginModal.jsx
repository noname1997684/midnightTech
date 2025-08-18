import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import React from "react";

const LoginModal = ({ isOpen, onOpenChange, onOpen, type }) => {
  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 mt-4 text-large font-semibold">
              {type === "favorite" ? (
                <h2>You must login to add this item to your favorites</h2>
              ) : type === "cart" ? (
                <h2>You must login to add this item to your cart</h2>
              ) : type === "buy" ? (
                <h2>You must login to buy this item</h2>
              ) : type === "save" ? (
                <h2>You must login to save this post</h2>
              ) : type === "comment" ? (
                <h2>You must login to comment on this post</h2>
              ) : (
                <h2>You must login to continue</h2>
              )}
            </ModalHeader>
            <ModalBody className="flex justify-center items-center">
              <img src="../svg/login.svg" alt="login" className="w-64 h-64" />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="secondary"
                onPress={() => {
                  router.push("/login");
                }}
                className="font-semibold"
              >
                Login
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
