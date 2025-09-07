"use client";
import AddToCartButton from "@/app/components/AddToCartButton";
import FavoriteButton from "@/app/components/FavoriteButton";

import AuthContextProvider from "@/contexts/AuthContext";

import Link from "next/link";
import React, { Suspense } from "react";
import Category from "./Category";
import Brand from "./Brand";
import RatingReview from "./RatingReview";

const Details = ({ product }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-3">
        <Category categoryId={product.categoryId} />
        <Brand brandId={product.brandId} />
      </div>
      <h1 className="font-semibold text-xl md:text-4xl">{product.title}</h1>
      <Suspense>
        <RatingReview product={product} />
      </Suspense>
      <h2 className=" text-gray-600 text-sm md:line-clamp-4 line-clamp-3">
        {product.shortDescription}
      </h2>
      <h3 className="text-green-500 font-bold text-lg">
        {product.salePrice}${" "}
        <span className="line-through text-gray-700 text-sm">
          {product.price}$
        </span>
      </h3>
      <div className="flex items-center gap-4 flex-wrap">
        {product?.stock <= (product?.orders || 0) ? (
          <button className="bg-red-500 text-white rounded-lg px-4 py-1.5">
            Out of Stock
          </button>
        ) : (
          <>
            <Link href={`/checkout?type=buynow&productId=${product.id}`}>
              <button
                className="bg-violet-500 text-white rounded-lg px-4 py-1.5 "
                disabled={product?.stock <= (product?.orders || 0)}
              >
                Buy Now
              </button>
            </Link>
            <AuthContextProvider>
              <AddToCartButton type={"small"} productId={product.id} />
            </AuthContextProvider>
          </>
        )}

        <AuthContextProvider>
          <FavoriteButton productId={product.id} />
        </AuthContextProvider>
      </div>
      <div className="flex flex-col gap-2 py-2">
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: product.description }}
        ></div>
      </div>
    </div>
  );
};
export default Details;
