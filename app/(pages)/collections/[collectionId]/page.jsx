import { ProductCard } from "@/app/components/Products";
import { getCollection } from "@/lib/firestore/collections/read_server";
import { getProduct } from "@/lib/firestore/products/read_server";
import React from "react";

export async function generateMetadata({ params }) {
  const { collectionId } = params;
  const collection = await getCollection(collectionId);

  return {
    title: `${collection?.title} | collection`,
    description: collection?.subTitle ?? "Midnigt Tech",
    openGraph: {
      images: [collection?.imageURL],
    },
  };
}

const page = async ({ params }) => {
  const { collectionId } = params;
  const collection = await getCollection(collectionId);
  return (
    <main className=" flex flex-col justify-center items-center w-full">
      <div
        className=" container flex w-full h-[calc(50vh-68px)] bg-cover bg-center bg-no-repeat relative "
        style={{ backgroundImage: `url(${collection.imageURL})` }}
      >
        <div className="absolute inset-0 bg-black/40  z-[1]" />
        <div className="flex flex-col justify-center items-center w-full h-full text-white z-10 ">
          <h1 className="text-center font-semibold text-4xl">
            {collection.title}
          </h1>
          <h1 className="text-center text-gray-300">{collection.subTitle}</h1>
        </div>
      </div>
      <div className="max-w-[1000px] p-5  flex flex-col gap-6 items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 justify-self-center justify-center items-center  lg:grid-cols-4 ">
          {collection.products.map((productId) => (
            <Product productId={productId} key={productId} />
          ))}
        </div>
      </div>
    </main>
  );
};

const Product = async ({ productId }) => {
  const product = await getProduct(productId);
  return <ProductCard product={product} />;
};

export default page;
