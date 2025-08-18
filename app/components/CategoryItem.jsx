import { useCategory } from "@/lib/firestore/categories/read";
import { CircularProgress } from "@heroui/react";
import Link from "next/link";
import React from "react";

const CategoryItem = ({ categoryId }) => {
  const { data: category, isLoading } = useCategory(categoryId);
  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  return (
    <Link href={`/categories/${category?.id}`} className="flex-1">
      <div className="flex bg-white items-center gap-4  border px-3 py-1 rounded-full">
        <img src={category?.imageURL} className="h-12 " alt={category?.name} />
        <h4 className="text-lg font-bold">
          {category?.name ?? "Uncategorized"}
        </h4>
      </div>
    </Link>
  );
};

export default CategoryItem;
