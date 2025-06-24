import { ProductCard } from "@/app/components/Products";
import { getCollection } from "@/lib/firestore/collections/read_server";
import { getProduct } from "@/lib/firestore/products/read_server";
import React from "react";


export async function generateMetadata({params}) {
  const { collectionId } = params;
  const collection = await getCollection(collectionId);

  return {
    title: `${collection?.title} | collection`,
    description: collection?.subTitle ?? "An E Commerce Website built with Next.js, React, and Tailwind CSS",
    openGraph:{
      images:[collection?.imageURL] 
    }
  }
}

const page = async ({ params }) => {
  const { collectionId } = params;
  const collection = await getCollection(collectionId);
  return (
    <main className=" flex justify-center p-5 md:px-10 md:py-5 w-full">
      <div className="max-w-[900px] p-5 flex flex-col gap-6">
        <div className="w-full flex justify-center">
            <img className="h-[110px]" src={collection.imageURL} alt={collection.title} />
        </div>
        <h1 className="text-center font-semibold text-4xl">{collection.title}</h1>
        <h1 className="text-center text-gray-500">{collection.subTitle}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 justify-self-center justify-center items-center  lg:grid-cols-4 ">
          {collection.products.map((productId) => (
            <Product productId={productId} key={productId} />
          ))}
        </div>
      </div>
    </main>
  );
};

const Product = async ({productId})=>{
    const product = await getProduct(productId);
    return <ProductCard product={product} />
}


export default page;
