import { ProductCard } from "@/app/components/Products";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import React from "react";

const RelatedProducts = async ({ categoryId }) => {
  const products = await getProductsByCategory(categoryId);
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[900px] p-5 flex flex-col gap-5">
        <h1 className="text-center font-semibold text-lg">Related Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4  lg:grid-cols-4 ">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
