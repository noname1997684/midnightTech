import { useBrand } from "@/lib/firestore/brands/read";
import { getBrand } from "@/lib/firestore/brands/read_server";
import { CircularProgress } from "@heroui/react";
import Link from "next/link";
import React from "react";

const BrandItem = ({ brandId }) => {
  const { data: brand, isLoading } = useBrand(brandId);
  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  return (
    <Link
      href={`/brands/${brand?.id}`}
      className="flex flex-1 bg-white items-center gap-4  border px-3 py-1 rounded-full"
    >
      <img src={brand?.imageURL} className="h-12" alt={brand?.name} />
      <h4 className="text-lg font-bold">{brand?.name ?? "Uncategorized"}</h4>
    </Link>
  );
};

export default BrandItem;
