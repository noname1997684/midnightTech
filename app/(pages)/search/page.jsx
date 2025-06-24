import { ProductCard } from "@/app/components/Products"
import { algoliasearch } from "algoliasearch"
import SearchBox from "./components/SearchBox"

const getProducts = async (text)=>{
  if(!text) {
    return []
  }
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY
  )
  const search = await client.searchForHits({
    requests:[
      {
        query: text,
        indexName:"products",
        hitsPerPage: 20,
      }
    ]
  })
  const hits = search.results[0].hits
  return hits || []
}
const page = async ({searchParams}) => {
  const {q} = searchParams
  const products = await getProducts(q)
  
    return (
      <main className="min-h-screen p-5 flex flex-col gap-1">
        <SearchBox/>
   {products.length !=0 && <div className="w-full flex justify-center">
         <div className="max-w-[900px] p-5 flex flex-col gap-5">
           <h1 className="text-center font-semibold text-lg">Products for {q}</h1>
           <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4  lg:grid-cols-4 ">
             {products.map((product) => (
               <ProductCard product={product} key={product.id} />
              ))}
           </div>
         </div>
       </div>}
              </main>
  )
}

export default page