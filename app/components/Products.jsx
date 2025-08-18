"use client";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { getProductReviewsCount } from "@/lib/firestore/products/count/read";
import { Suspense, useEffect, useState } from "react";
import MyRating from "./MyRating";
import { useProducts } from "@/lib/firestore/products/read";
import { Button, CircularProgress, useDisclosure } from "@heroui/react";
import RatingReview from "./RatingReview";

const ProductsGridView = () => {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);
  const {
    data: products,
    error,
    isLoading,
    lastSnapDoc,
    length,
  } = useProducts(
    pageLimit,
    lastSnapDocList.length === 0
      ? null
      : lastSnapDocList[lastSnapDocList.length - 1]
  );
  const isLastPage = length < pageLimit;
  const handleNextPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.push(lastSnapDoc);
    setLastSnapDocList(newStack);
  };
  const handlePreviousPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.pop();
    setLastSnapDocList(newStack);
  };

  if (isLoading)
    return (
      <div className="flex justify-center w-full">
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="bg-white p-5 rounded-xl flex-1 ">
        <h1>{error}</h1>
      </div>
    );
  return (
    <section className="w-full flex flex-col items-center gap-4 justify-center">
      <div className="max-w-[900px] p-5 flex flex-col gap-5">
        <h1 className="text-center font-semibold text-lg">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4  lg:grid-cols-4 ">
          {products.map((product) => (
            <ProductCard product={product} key={product?.id} />
          ))}
        </div>
      </div>
      <div className="flex justify-between text-sm py-3 max-w-[900px] w-full ">
        <Button
          isDisabled={isLoading || lastSnapDocList.length === 0}
          size="sm"
          variant="bordered"
          onClick={handlePreviousPage}
        >
          Previous
        </Button>
        <select
          value={pageLimit}
          onChange={(e) => {
            setPageLimit(parseInt(e.target.value));
          }}
          className="px-5 rounded-xl"
          name="perpage"
          id="perpage"
        >
          <option value="3">3 items</option>
          <option value="5">5 items</option>
          <option value="10">10 items</option>
          <option value="20">20 items</option>
          <option value="100">100 items</option>
        </select>
        <Button
          isDisabled={isLoading || products?.length === 0 || isLastPage}
          size="sm"
          variant="bordered"
          onClick={handleNextPage}
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col gap-3 border p-4 rounded-lg max-w-[300px] ">
      <div className="relative w-full">
        <img
          src={product?.featureImageURL}
          className="rounded-lg h-48 w-full "
          alt={product?.title}
        />
      </div>
      <Link href={`/products/${product?.id}`}>
        <h1 className="font-semibold line-clamp-2 text-sm min-h-10">
          {product?.title}
        </h1>
      </Link>
      <div className=" flex items-center justify-between">
        <h2 className="text-green-500 text-sm font-semibold">
          ${product?.salePrice}{" "}
          <span className="line-through text-xs text-gray-600">
            ${product?.price}
          </span>
        </h2>
        <AuthContextProvider>
          <FavoriteButton productId={product?.id} />
        </AuthContextProvider>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2">
        {product?.shortDescription}
      </p>
      <Suspense>
        <RatingReview product={product} />
      </Suspense>
      <div className="flex items-center gap-4 w-full">
        <div className="w-full">
          {product?.stock <= (product?.orders || 0) ? (
            <button
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-xs w-full"
              disabled
            >
              Out of Stock
            </button>
          ) : (
            <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
              <button className="flex-1 bg-[#7900f5] text-white px-4 py-2 rounded-lg text-xs w-full">
                Buy Now
              </button>
            </Link>
          )}
        </div>
        <AuthContextProvider>
          <AddToCartButton
            productId={product?.id}
            isDisabled={product?.stock <= (product?.orders || 0)}
          />
        </AuthContextProvider>
      </div>
    </div>
  );
};

export default ProductsGridView;
