"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProduct, useProductsById } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import {
  Button,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CartItems from "./components/CartItems";
import Coupon from "./components/Coupon";
import Total from "./components/Total";

const page = () => {
  const { user } = useAuth();
  const { data, isLoading } = useUser(user?.uid);

  const productIdsList = data?.carts.map((item) => item.id);

  if (isLoading) {
    return (
      <div className=" p-10 flex justify-center items-center h-screen w-full">
        <CircularProgress />
      </div>
    );
  }

  if (!data?.carts || data?.carts?.length === 0) {
    return (
      <main className="flex flex-col justify-center items-center gap-3 p-5">
        <h1 className="text-2xl font-semibold">Cart</h1>

        <div className="flex gap-5 flex-col justify-center py-20 items-center h-full w-full">
          <div className="flex justify-center">
            <img src="/svg/Empty.svg" alt="empty" className="h-[200px]" />
          </div>
          <h1 className="text-sm text-gray-500 font-semibold">
            You have no products in cart yet.
          </h1>
        </div>
        <Link href="/">
          <button className="bg-violet-500 px-5 py-2 text-sm rounded-lg text-white">
            Shopping Now
          </button>
        </Link>
      </main>
    );
  }
  return (
    <main className="flex flex-col min-h-screen bg-gray-200 items-center gap-3 p-12">
      <h1 className="text-2xl font-semibold">Cart</h1>

      <div className="flex w-full justify-center  gap-10">
        <div className="flex flex-col w-3/4">
          <h1 className="text-xl font-bold  ">Your Cart Items</h1>
          <h2 className="text-gray-600 mb-5">
            Your have <b>{data?.carts?.length} items</b> in your cart
          </h2>
          <table className="py-5 w-full  flex flex-col rounded-xl bg-white shadow-lg table-auto ">
            <tr className="flex justify-between items-center px-8 py-3  rounded-t-xl w-full">
              <th className="flex justify-center items-center w-full">
                Product
              </th>
              <th className="flex justify-center items-center w-full">Price</th>
              <th className="flex justify-center items-center w-full">
                Quantity
              </th>
              <th className="flex justify-center items-center w-full">
                Total Price
              </th>
              <th className="flex justify-center items-center w-full">
                Actions
              </th>
            </tr>

            {data?.carts?.map((item, index) => (
              <CartItems
                key={item.id}
                item={item}
                lastItem={index === data.carts.length - 1}
              />
            ))}
          </table>
        </div>
        <div className="flex flex-col w-1/4 gap-4">
          <Coupon />
          <Total productIdsList={productIdsList} item={data?.carts} />
          <Link href="/checkout?type=cart">
            <button className="bg-violet-500 px-5 py-2 text-sm rounded-lg text-white w-full">
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default page;
