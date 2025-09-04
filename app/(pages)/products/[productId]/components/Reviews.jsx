"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/lib/firestore/reviews/read";
import { deleteReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import {
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Rating } from "@mui/material";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Reviews = ({ productId }) => {
  const { data } = useReviews(productId);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { data: userData } = useUser(user?.uid);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const handleDelete = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("You must be logged in to submit a review.");
      }
      await deleteReview(user.uid, productId);
      toast.success("Review delted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit review. Please try again." + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Reviews</h1>
      <div className="flex flex-col gap-4">
        {data?.map((review) => (
          <div className="flex gap-3">
            <div className="">
              <Avatar src={review.photoURL} />
            </div>
            <div className="flex-1 flex flex-col ">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-semibold">{review.displayName}</h1>
                  <Rating value={review.rating} readOnly size="small" />
                </div>
                {user?.uid === review.uid && (
                  <Button
                    onClick={onOpen}
                    disabled={loading}
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    isDisabled={loading}
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-600 pt-1">{review.message}</p>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 mt-4 text-large font-semibold">
                <h1>Are You Sure You Want to Remove This Item?</h1>
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="secondary"
                  onPress={handleDelete}
                  className="font-semibold"
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Reviews;
