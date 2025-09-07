import { getBrand } from "@/lib/firestore/brands/read_server";
import Link from "next/link";
import React from "react";

const Brand = async ({ brandId }) => {
  const brand = await getBrand(brandId);
  return (
    <Link href={`/brands/${brand.id}`}>
      <div className="flex items-center gap-1  border px-3 py-1 rounded-full">
        <img src={brand.imageURL} className="h-4 " alt={brand.name} />
        <h4 className="text-sm font-semibold">{brand?.name ?? "Unbranded"}</h4>
      </div>
    </Link>
  );
};

export default Brand;
