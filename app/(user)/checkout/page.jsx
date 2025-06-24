"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useProductsById } from '@/lib/firestore/products/read'
import { useUser } from '@/lib/firestore/user/read'
import { CircularProgress } from '@heroui/react'
import { useSearchParams } from 'next/navigation'
import Checkout from './components/Checkout'


const page = () => {
    const {user} = useAuth()
    const {data} = useUser(user?.uid)
     const searchParams = useSearchParams()
    const type = searchParams.get("type");
    const productId = searchParams.get("productId");
    const productIdsList = type === 'buynow' ? [productId] : data.carts.map(item=> item.id) 
    const {data:products, error, isLoading} = useProductsById(productIdsList)
    if(isLoading) {
        return (
            <div>
                <CircularProgress/>
            </div>
        )
    }
    if(error) {
        return (
            <div>
                <h1 className="text-red-500">Error: {error.message}</h1>
            </div>
        )
    }

    if(productIdsList.length === 0 && !productIdsList) {
        return (
            <div>
                <h1 className="text-red-500">No products found in your cart</h1>
            </div>
        )
    }

    const productList = type === 'buynow' ?[
        {
            id: productId,
            quantity: 1,
            product: products[0]
        }
    ]: data.carts.map(item => {
        return {
            ...item,
            product: products.find(product => product.id === item.id)
        }
    })
    return (
    <main className='p-5 flex flex-col gap-4'>
        <h1 className='text-xl'>Checkout</h1>
        <Checkout producList={productList}/>
    </main>
  )
}

export default page