import CategoryProductGrid from "@/app/(pages)/categories/[categoryId]/components/CategoryProductGrid";
import { ProductCard } from "@/app/components/Products";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import React from "react";

const RelatedProducts = async ({ categoryId }) => {
  const products = await getProductsByCategory(categoryId, 10);

  return (
    <div className=" flex flex-col items-center justify-center p-5 md:px-10 md:py-5 w-full">
      <h1 className="text-lg font-semibold mb-5">Related Products</h1>
      <CategoryProductGrid initialProducts={products} categoryId={categoryId} />
    </div>
  );
};

export default RelatedProducts;
