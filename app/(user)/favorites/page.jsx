"use client";

import { ProductCard } from "@/app/components/Products";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@heroui/react";

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
      <h1 className="text-2xl font-semibold">Favorites</h1>
      {!data?.favorites ||
        (data?.favorites?.length === 0 && (
          <div className="flex gap-5 flex-col justify-center py-20 items-center h-full w-full">
            <div className="flex justify-center">
              <img src="/svg/Empty.svg" alt="empty" className="h-[200px]" />
            </div>
            <h1 className="text-sm text-gray-500 font-semibold">
              You have no favorites yet.
            </h1>
          </div>
        ))}
      <div className=" gap-4 p-5 w-full md:max-w-[900px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.favorites?.map((productId) => (
          <ProductItem key={productId} productId={productId} />
        ))}
      </div>
    </main>
  );
};

const ProductItem = ({ productId }) => {
  const { data: product } = useProduct(productId);
  return <ProductCard product={product} />;
};

export default page;
