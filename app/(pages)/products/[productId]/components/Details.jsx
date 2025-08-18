"use client";
import AddToCartButton from "@/app/components/AddToCartButton";
import FavoriteButton from "@/app/components/FavoriteButton";
import LoginModal from "@/app/components/LoginModal";
import MyRating from "@/app/components/MyRating";
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import { getBrand } from "@/lib/firestore/brands/read_server";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductReviewsCount } from "@/lib/firestore/products/count/read";
import { button, Button, useDisclosure } from "@heroui/react";
import { Rating } from "@mui/material";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

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
        {product.salePrice}{" "}
        <span className="line-through text-gray-700 text-sm">
          {product.price}
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
                disabled
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

const Category = async ({ categoryId }) => {
  const category = await getCategory(categoryId);
  return (
    <Link href={`/categories/${category.id}`}>
      <div className="flex items-center gap-1  border px-3 py-1 rounded-full">
        <img src={category.imageURL} className="h-4 " alt={category.name} />
        <h4 className="text-sm font-semibold">
          {category?.name ?? "Uncategorized"}
        </h4>
      </div>
    </Link>
  );
};
const Brand = async ({ brandId }) => {
  const brand = await getBrand(brandId);
  return (
    <Link href={`/brands/${brand.id}`}>
      <div className="flex items-center gap-1  border px-3 py-1 rounded-full">
        <img src={brand.imageURL} className="h-4 " alt={brand.name} />
        <h4 className="text-sm font-semibold">
          {brand?.name ?? "Uncategorized"}
        </h4>
      </div>
    </Link>
  );
};

async function RatingReview({ product }) {
  const counts = await getProductReviewsCount(product?.id);
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts.averageRating || 0} />
      <h1 className="text-sm text-gray-400">
        <span>{counts.averageRating?.toFixed(1)}</span>({counts.totalreviews})
      </h1>
    </div>
  );
}

export default Details;
