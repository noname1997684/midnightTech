"use client";

import LoginModal from "@/app/components/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { addReviews } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Button, useDisclosure } from "@heroui/react";
import { Rating } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

const AddReviews = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { data: userData } = useUser(user?.uid);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!user) {
        return;
      }
      await addReviews({
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        uid: user.uid,
        rating,
        message,
        productId,
      });
      toast.success("Review submitted successfully!");
      setRating(4);
      setMessage("");
    } catch (error) {
      toast.error("Failed to submit review. Please try again." + error.message);
    } finally {
      setLoading(false);
      setRating(4);
      setMessage("");
    }
  };
  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Rate This Products</h1>
      <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your thought on this product ..."
        className="w-full border px-4 py-2 focus:outline-none"
      ></textarea>
      <Button
        onClick={user ? handleSubmit : onOpen}
        isLoading={loading}
        isDisabled={loading}
      >
        Submit Review
      </Button>
      <LoginModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        type="cart"
      />
    </div>
  );
};

export default AddReviews;
