"use client";
import {
  average,
  collection,
  count,
  getAggregateFromServer,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../../firebase";
import useSWR from "swr";

export const getProductsCount = async () => {
  const ref = collection(db, `products`);
  const data = await getCountFromServer(ref);
  return data.data().count;
};

export function useProductsCount() {
    const {data,error,isLoading}= useSWR("products_count",(key)=> getProductsCount())
    if(error) {
        console.error("Error fetching products count:", error.message);
    }
    return {
        data,
        error,
        isLoading
    }
}
