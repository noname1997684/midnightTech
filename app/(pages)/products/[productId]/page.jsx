import { getProduct } from "@/lib/firestore/products/read_server";
import React from "react";
import Photos from "./components/Photos";
import Details from "./components/Details";
import Reviews from "./components/Reviews";
import RelatedProducts from "./components/RelatedProducts";
import AddReviews from "./components/AddReviews";
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";

export async function generateMetadata({ params }) {
  const { productId } = params;
  const product = await getProduct(productId);

  return {
    title: `${product?.title} | product`,
    description:
      product?.shortDescription ??
      "An E Commerce Website built with Next.js, React, and Tailwind CSS",
    openGraph: {
      images: [product?.featureImageURL],
    },
  };
}

const page = async ({ params }) => {
  const { productId } = params;
  const product = await getProduct(productId);
  return (
    <main className="p-5 md:p-10">
      <section className="flex flex-col-reverse md:flex-row gap-3">
        <Photos
          imageList={[product.featureImageURL, ...(product.imagesURLs ?? [])]}
        />
        <Details product={product} />
      </section>
      <div className="flex justify-center py-10">
        <AuthContextProvider>
          <div className="flex flex-col md:flex-row gap-4 md:max-w-[900px] w-full">
            <AddReviews productId={productId} />
            <Reviews productId={productId} />
          </div>
        </AuthContextProvider>
      </div>
      <RelatedProducts categoryId={product.categoryId} productId={productId} />
    </main>
  );
};

export default page;
