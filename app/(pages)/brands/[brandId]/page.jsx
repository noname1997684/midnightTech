import { getProductsByBrands } from "@/lib/firestore/products/read_server";
import React from "react";
import BrandProductGrid from "./components/BrandProductGrid";
import { getBrand } from "@/lib/firestore/brands/read_server";

export async function generateMetadata({ params }) {
  const { brandId } = params;
  const brand = await getBrand(brandId);

  return {
    title: `${brand?.name} | brand`,
    openGraph: {
      images: [brand?.imageURL],
    },
  };
}

const page = async ({ params }) => {
  const { brandId } = params;
  const brand = await getBrand(brandId);
  const initialProducts = await getProductsByBrands(brandId, 10);
  if (!brand) {
    return (
      <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Brand not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className=" flex justify-center p-5 md:px-10 md:py-5 w-full">
      <BrandProductGrid
        initialProducts={initialProducts}
        brandId={brandId}
        brandName={brand.name}
      />
    </main>
  );
};

export default page;
