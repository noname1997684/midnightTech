"use client";
import React, { useState } from "react";
import Comment from "./Comment";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { Button, useDisclosure } from "@heroui/react";
import toast from "react-hot-toast";
import { addReviewsBlog } from "@/lib/firestore/reviews/write";
import { useReviewsBlog } from "@/lib/firestore/reviews/read";
import LoginModal from "@/app/components/LoginModal";

const Comments = ({ blogId }) => {
  const { data } = useReviewsBlog(blogId);
  console.log(data);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { data: userData } = useUser(user?.uid);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleSend = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("You must be logged in to submit a comment.");
      }
      await addReviewsBlog({
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        uid: user.uid,
        message,
        blogId,
      });
      toast.success("Comment submitted successfully!");
      setMessage("");
    } catch (error) {
      toast.error(
        "Failed to submit comment. Please try again." + error.message
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <div className="flex items-center justify-between gap-8 w-full">
        <textarea
          className="w-full p-4 rounded-xl border-gray-400 border"
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <Button
          isLoading={loading}
          isDisabled={!message || loading}
          className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl"
          onClick={user ? handleSend : onOpen}
        >
          Send
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {data?.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      <LoginModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        type="comment"
      />
    </div>
  );
};

export default Comments;
