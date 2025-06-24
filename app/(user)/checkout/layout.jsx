"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@heroui/react";
import { useSearchParams } from "next/navigation"

const layout = ({children}) => {
    const searchParams = useSearchParams()
    const type = searchParams.get("type");
    const productId = searchParams.get("productId");
    const {user} = useAuth()
    const {data,error,isLoading} = useUser(user?.uid)

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

    if(type === "cart" && (!data?.carts || data.carts.length === 0)) {
        return (
            <div>
                <h1 className="text-red-500">Your cart is empty</h1>
            </div>
        )

    }

    if(type === "product" && !productId) {
        return (
            <div>
                <h1 className="text-red-500">Product ID is required</h1>
            </div>
        )
    }
  return (
    <>{children}</>
  )
}

export default layout