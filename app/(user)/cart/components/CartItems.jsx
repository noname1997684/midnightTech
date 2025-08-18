"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Minus, Plus, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CartItems = ({ item, lastItem }) => {
  const { user } = useAuth();
  const { data } = useUser(user?.uid);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: product } = useProduct(item.id);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const newList = data.carts.filter((product) => product?.id !== item?.id);
      await updateCarts(user?.uid, newList);
    } catch (error) {
      toast.error("Failed to remove item", error.message);
    } finally {
      setIsRemoving(false);
    }
  };
  const handleUpdate = async (quantity) => {
    setIsUpdating(true);
    try {
      const newList = data.carts.map((product) => {
        if (product?.id === item?.id) {
          return {
            ...product,
            quantity: parseInt(quantity),
          };
        }

        return product;
      });
      console.log("newList", newList);
      await updateCarts(user?.uid, newList);
    } catch (error) {
      toast.error("Failed to update cart", error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    // <div
    //   className={`flex gap-3 items-center px-8 py-3 ${
    //     lastItem ? "" : "border-b border-gray-300"
    //   }`}
    // >
    //   <div className="h-14 w-14 p-1">
    //     <img
    //       className="w-full h-full object-cover rounded-lg"
    //       src={product?.featureImageURL}
    //       alt={product?.title}
    //     />
    //   </div>
    //   <div className="flex flex-col gap-1 w-full">
    //     <h1 className="text-sm font-semibold">{product?.title}</h1>
    //     <h1 className="text-green-500 text-sm">
    //       ${product?.salePrice}{" "}
    //       <span className="line-through text-xs text-gray-500">
    //         ${product?.price}
    //       </span>
    //     </h1>
    //     <div className="flex text-xs items-center gap-2 ">
    //       <Button
    //         isIconOnly
    //         isDisabled={isUpdating || item?.quantity <= 1}
    //         size="sm"
    //         className="h-6 w-4"
    //         onClick={() => handleUpdate(item?.quantity - 1)}
    //       >
    //         <Minus size={12} />
    //       </Button>
    //       <h2 className="">{item?.quantity}</h2>
    //       <Button
    //         isDisabled={isUpdating}
    //         isIconOnly
    //         size="sm"
    //         className="h-6 w-4"
    //         onClick={() => handleUpdate(item?.quantity + 1)}
    //       >
    //         <Plus size={12} />
    //       </Button>
    //     </div>
    //   </div>
    //   <div className="flex gap-3 items-center">
    //     <Button
    //       isIconOnly
    //       color="danger"
    //       size="sm"
    //       onClick={onOpen}
    //       isLoading={isRemoving}
    //       isDisabled={isRemoving}
    //     >
    //       <X size={13} />
    //     </Button>
    //   </div>
    //   <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    //     <ModalContent>
    //       {(onClose) => (
    //         <>
    //           <ModalHeader className="flex flex-col gap-1 mt-4 text-large font-semibold">
    //             <h1>Are You Sure You Want to Remove This Item?</h1>
    //           </ModalHeader>
    //           <ModalFooter>
    //             <Button color="danger" variant="light" onPress={onClose}>
    //               Close
    //             </Button>
    //             <Button
    //               color="secondary"
    //               onPress={handleRemove}
    //               className="font-semibold"
    //             >
    //               Remove
    //             </Button>
    //           </ModalFooter>
    //         </>
    //       )}
    //     </ModalContent>
    //   </Modal>
    // </div>
    <tr className="flex justify-between items-center px-8 py-3  rounded-t-xl w-full">
      <td className="flex justify-center items-center w-full">
        <div className="flex gap-3 items-center">
          <div className="w-20">
            <img
              className="w-full h-full  "
              src={product?.featureImageURL}
              alt={product?.featureImageURL}
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h1 className="text-sm font-semibold">{product?.title}</h1>
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
                      onPress={handleRemove}
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
      </td>
      <td className="flex justify-center items-center w-full">
        <h1 className="text-green-500 text-sm">
          ${product?.salePrice}{" "}
          <span className="line-through text-xs text-gray-500">
            ${product?.price}
          </span>
        </h1>
      </td>
      <td className="flex justify-center items-center w-full gap-2">
        <Button
          isIconOnly
          isDisabled={isUpdating || item?.quantity <= 1}
          size="sm"
          className="h-6 w-4"
          onClick={() => handleUpdate(item?.quantity - 1)}
        >
          <Minus size={12} />
        </Button>
        <h2 className="">{item?.quantity}</h2>
        <Button
          isDisabled={isUpdating}
          isIconOnly
          size="sm"
          className="h-6 w-4"
          onClick={() => handleUpdate(item?.quantity + 1)}
        >
          <Plus size={12} />
        </Button>
      </td>
      <td className="flex justify-center items-center w-full">
        ${(item?.quantity * product?.salePrice).toFixed(2)}
      </td>
      <td className="flex justify-center items-center w-full">
        <Button
          isIconOnly
          color="danger"
          size="sm"
          onClick={onOpen}
          isLoading={isRemoving}
          isDisabled={isRemoving}
        >
          <X size={13} />
        </Button>
      </td>
    </tr>
  );
};

export default CartItems;
