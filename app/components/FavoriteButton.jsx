"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateFavorites } from "@/lib/firestore/user/write";
import { Button, useDisclosure } from "@heroui/react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";

const FavoriteButton = ({ productId }) => {
  const { user } = useAuth();
  const { data } = useUser(user?.uid);
  const [isLoading, setIsLoading] = useState(false);
  const isLiked = data?.favorites?.includes(productId);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        return;
      }
      if (isLiked) {
        const newList = data.favorites.filter((id) => id !== productId);
        await updateFavorites(user.uid, newList);
      } else {
        await updateFavorites(user.uid, [
          ...(data?.favorites || []),
          productId,
        ]);
      }
    } catch (error) {
      toast.error("Failed to add to favorites", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={user ? handleClick : onOpen}
        isIconOnly
        size="sm"
        variant="light"
        color="danger"
        className="rounded-full"
      >
        {isLiked ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderOutlinedIcon fontSize="small" />
        )}
      </Button>
      <LoginModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        type="favorite"
      />
    </>
  );
};

export default FavoriteButton;
