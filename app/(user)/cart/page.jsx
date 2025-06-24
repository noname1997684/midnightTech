"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button, CircularProgress } from "@heroui/react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const page = () => {
  const { user } = useAuth();
  const { data, isLoading } = useUser(user?.uid);
  if (isLoading) {
    return (
      <div className=" p-10 flex justify-center items-center h-screen w-full">
        <CircularProgress />
      </div>
    );
  }
  return (
    <main className="flex flex-col justify-center items-center gap-3 p-5">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {!data?.carts ||
        (data?.carts?.length === 0 && (
          <div className="flex gap-5 flex-col justify-center py-20 items-center h-full w-full">
            <div className="flex justify-center">
              <img src="/svg/Empty.svg" alt="empty" className="h-[200px]" />
            </div>
            <h1 className="text-sm text-gray-500 font-semibold">
              You have no products in cart yet.
            </h1>
          </div>
        ))}
      <div className=" gap-4 p-5 w-full md:max-w-[900px] grid grid-cols-2 md:grid-cols-2 ">
        {data?.carts?.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
      </div>
      <div>
         <Link href="/checkout?type=cart">
        <button className="bg-blue-500 px-5 py-2 text-sm rounded-lg text-white">
          Checkout
        </button>
        </Link>
      </div>
    </main>
  );
};

const ProductItem = ({ item }) => {
  const { user } = useAuth();
  const { data } = useUser(user?.uid);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: product } = useProduct(item.id);
  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this item from your cart?")) {
      return;
    }
    setIsRemoving(true);
    try {
      const newList = data.carts.filter((product) => product?.id !== item?.id);
      await updateCarts(user.uid, newList);
    } catch (error) {
      toast.error("Failed to add to favorites", error.message);
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
      await updateCarts(user.uid, newList);
    } catch (error) {
      toast.error("Failed to add to favorites", error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="flex gap-3 items-center border px-3 py-3 rounded-xl">
      <div className="h-14 w-14 p-1">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={product?.featureImageURL}
          alt={product?.title}
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <h1 className="text-sm font-semibold">{product?.title}</h1>
        <h1 className="text-green-500 text-sm">
          ${product?.salePrice}{" "}
          <span className="line-through text-xs text-gray-500">
            ${product?.price}
          </span>
        </h1>
        <div className="flex text-xs items-center gap-2 ">
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
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          isIconOnly
          color="danger"
          size="sm"
          onClick={handleRemove}
          isLoading={isRemoving}
          isDisabled={isRemoving}
        >
          <X size={13} />
        </Button>
      </div>
    </div>
  );
};

export default page;
