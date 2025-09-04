import { getCategory } from "@/lib/firestore/categories/read_server";
import Link from "next/link";
import React from "react";

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

export default Category;
