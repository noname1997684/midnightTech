"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button, useDisclosure } from "@heroui/react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";

const AddToCartButton = ({ productId, type, isDisabled }) => {
  const { user } = useAuth();
  const { data } = useUser(user?.uid);
  const [isLoading, setIsLoading] = useState(false);
  const isAdded = data?.carts?.find((product) => product.id === productId);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        return;
      }
      if (isAdded) {
        const newList = data.carts.filter(
          (product) => product.id !== productId
        );
        await updateCarts(user.uid, newList);
      } else {
        await updateCarts(user.uid, [
          ...(data?.carts || []),
          {
            id: productId,
            quantity: 1,
          },
        ]);
      }
    } catch (error) {
      toast.error("Failed to add to favorites", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (type === "large") {
    return (
      <>
        <Button
          isLoading={isLoading}
          isDisabled={isLoading || isDisabled}
          onClick={user ? handleClick : onOpen}
          color="secondary"
          size="md"
          variant="bordered"
        >
          {isAdded ? (
            <ShoppingCartIcon className="text-xs" />
          ) : (
            <AddShoppingCartIcon className="text-xs" />
          )}
          {isAdded ? "Remove from Cart" : "Add to Cart"}
        </Button>
        <LoginModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onOpen={onOpen}
          type="cart"
        />
      </>
    );
  }
  if (type === "small") {
    return (
      <>
        <Button
          isLoading={isLoading}
          isDisabled={isLoading || isDisabled}
          onClick={user ? handleClick : onOpen}
          variant="bordered"
        >
          {isAdded ? "Remove from Cart" : "Add to Cart"}
        </Button>
        <LoginModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onOpen={onOpen}
          type="cart"
        />
      </>
    );
  }

  return (
    <>
      <Button
        isLoading={isLoading}
        isDisabled={isLoading || isDisabled}
        onClick={user ? handleClick : onOpen}
        isIconOnly
        size="sm"
        variant="flat"
      >
        {isAdded ? (
          <ShoppingCartIcon className="text-xs" />
        ) : (
          <AddShoppingCartIcon className="text-xs" />
        )}
      </Button>
      <LoginModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        type="cart"
      />
    </>
  );
};

export default AddToCartButton;
