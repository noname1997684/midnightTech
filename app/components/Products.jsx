
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { getProductReviewsCount } from "@/lib/firestore/products/count/read";
import { Suspense } from "react";
import MyRating from "./MyRating";

const ProductsGridView = ({ products }) => {
  return (
    <section className="w-full flex justify-center">
      <div className="max-w-[900px] p-5 flex flex-col gap-5">
        <h1 className="text-center font-semibold text-lg">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4  lg:grid-cols-4 ">
          {products.map((product) => (
            <ProductCard product={product} key={product?.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col gap-3 border p-4 rounded-lg">
      <div className="relative w-full">
        <img
          src={product?.featureImageURL}
          className="rounded-lg h-48 w-full object-cover"
          alt={product?.title}
        />
        <div className="absolute top-1 right-1">
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </div>
      <Link href={`/products/${product?.id}`}>
        <h1 className="font-semibold line-clamp-2 text-sm">{product?.title}</h1>
      </Link>
      <div className="">
        <h2 className="text-green-500 text-sm font-semibold">
          ${product?.salePrice}{" "}
          <span className="line-through text-xs text-gray-600">
            ${product?.price}
          </span>
        </h2>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2">
        {product?.shortDescription}
      </p>
      <Suspense>
        <RatingReview product={product} />
      </Suspense>
        {product?.stock <= (product?.orders || 0 ) && (
        <div className="flex">
          <h3 className="text-red-500  rounded-lg text-xs font-semibold">
            Out Of Stock
          </h3>
        </div>
      )}
      <div className="flex items-center gap-4 w-full">
        <div className="w-full">
          <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
            <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-xs w-full">
              Buy Now
            </button>
          </Link>
        </div>
        <AuthContextProvider>
          <AddToCartButton productId={product?.id} />
        </AuthContextProvider>
      </div>
    </div>
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

export default ProductsGridView;
