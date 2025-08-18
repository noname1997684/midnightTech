import { ProductCard } from "@/app/components/Products";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import React from "react";
import CategoryProductGrid from "./components/CategoryProductGrid";

export async function generateMetadata({ params }) {
  const { categoryId } = params;
  const category = await getCategory(categoryId);

  return {
    title: `${category?.name} | category`,
    openGraph: {
      images: [category?.imageURL],
    },
  };
}

const page = async ({ params }) => {
  const { categoryId } = params;
  const category = await getCategory(categoryId);
  const initialProducts = await getProductsByCategory(categoryId, 10);
  if (!category) {
    return (
      <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Category not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className=" flex justify-center p-5 md:px-10 md:py-5 w-full">
      <CategoryProductGrid
        initialProducts={initialProducts}
        categoryId={categoryId}
        categoryName={category.name}
      />
    </main>
  );
};

export default page;
