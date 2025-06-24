"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addReviews } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Button } from "@heroui/react";
import { Rating } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

const AddReviews = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
    const {user} = useAuth()
    const {data: userData} = useUser( user?.uid)
  const handleSubmit = async () => {
    setLoading(true);
    try {
        if(!user){
            throw new Error("You must be logged in to submit a review.");
            
        }   
        await addReviews(
            {
                displayName: userData.displayName,
                photoURL: userData.photoURL,
                uid: user.uid,
                rating,
                message,
                productId
            }
        )
        toast.success("Review submitted successfully!");
        setRating(4);
        setMessage("");
    } catch (error) {
        toast.error("Failed to submit review. Please try again." + error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Rate This Products</h1>
      <Rating value={rating}
      onChange={(e, newValue) => setRating(newValue)}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your thought on this product ..."
        className="w-full border px-4 py-2 focus:outline-none"
      ></textarea>
      <Button onClick={handleSubmit} isLoading={loading} isDisabled={loading}>
        Submit Review
      </Button>
    </div>
  );
};

export default AddReviews;
