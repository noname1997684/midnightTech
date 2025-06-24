import { ProductCard } from '@/app/components/Products';
import { getCategory } from '@/lib/firestore/categories/read_server';
import { getProductsByCategory } from '@/lib/firestore/products/read_server';
import React from 'react'

export async function generateMetadata({params}) {
  const {categoryId} = params;
    const category = await getCategory(categoryId);

  return {
    title: `${category?.name} | category`,  
    openGraph:{
      images:[category?.imageURL] 
    }
  }
}


const page = async({params}) => {
    const {categoryId} = params;
    const category = await getCategory(categoryId);
    const products = await getProductsByCategory(categoryId)

    return (
    <main className=' flex justify-center p-5 md:px-10 md:py-5 w-full'>
        <div className="max-w-[900px] p-5 flex flex-col gap-6">
                  <h1 className="text-center font-semibold text-4xl">{category.name}</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 justify-self-center justify-center items-center  lg:grid-cols-4 ">
                    {products.map((product) => (
                      <ProductCard product={product} key={product.id} />
                    ))}
                  </div>
                </div>
        </main>
  )
}

export default page