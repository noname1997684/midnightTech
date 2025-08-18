"use client";
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React from "react";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import BrandItem from "./BrandItem";
import CategoryItem from "./CategoryItem";
import LoginModal from "./LoginModal";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";

const SliderItem = ({ product }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useAuth();
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row gap-4 bg-[#f8f8f8] p-5 md:px-24 md:py-20 w-full">
        <div className="flex-1 flex flex-col md:gap-10 gap-4">
          <h2 className="text-gray-500 text-xs md:text-base">
            Featured Product
          </h2>
          <div className="flex flex-col gap-4">
            <Link href={`/products/${product.id}`}>
              <h1 className="md:text-4xl text-xl font-bold">{product.title}</h1>
            </Link>
            <h1 className="text-gray-600 md:text-sm text-xs ">
              {product.shortDescription}
            </h1>
          </div>
          <div className="gap-4 items-center flex">
            <AuthContextProvider>
              {user ? (
                <Link href={`/checkout?type=buynow&productId=${product.id}`}>
                  <button className="bg-[#7900f5] text-white md:text-sm text-xs px-8 py-3 rounded-2xl">
                    BUY NOW
                  </button>
                </Link>
              ) : (
                <button
                  className="bg-[#7900f5] text-white md:text-sm text-xs px-8 py-3 rounded-2xl"
                  onClick={onOpen}
                >
                  BUY NOW
                </button>
              )}

              <AddToCartButton productId={product?.id} type={"large"} />
              <FavoriteButton productId={product?.id} />
            </AuthContextProvider>
          </div>
          <div className="">
            <h2 className="text-violet-600 text-5xl font-bold">
              ${product?.salePrice}{" "}
              <span className="line-through text-2xl text-gray-600">
                ${product?.price}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-10 w-full">
            <CategoryItem categoryId={product.categoryId} />
            <BrandItem brandId={product.brandId} />
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center gap-4 ">
          <div className="relative w-96 h-96 rounded-full bg-white shadow-2xl flex justify-center items-center">
            <div className="absolute top-4 right-8 w-20 h-20 rounded-full flex justify-center items-center z-50 ">
              <img src="/svg/new.svg" />
            </div>
            <Link
              href={`/products/${product.id}`}
              className="absolute  bottom-0 left-0  flex-col justify-center items-center"
            >
              <img
                className="md:h-[23rem] h-[14rem] "
                src={product.featureImageURL}
                alt={product.title}
              />
            </Link>
          </div>
        </div>
      </div>
      <LoginModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        type="buy"
      />
    </div>
  );
};

export default SliderItem;
