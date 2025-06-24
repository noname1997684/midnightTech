"use client";
import {
  average,
  collection,
  count,
  getAggregateFromServer,
  getCountFromServer,
} from "firebase/firestore";

import useSWR from "swr";
import { db } from "../firebase";

export const getUsersCount = async () => {
  const ref = collection(db, `users`);
  const data = await getCountFromServer(ref);
  return data.data().count;
};

export function useUsersCount() {
    const {data,error,isLoading}= useSWR("users_count",(key)=> getUsersCount())
    if(error) {
        console.error("Error fetching user count:", error.message);
    }
    return {
        data,
        error,
        isLoading
    }
}
