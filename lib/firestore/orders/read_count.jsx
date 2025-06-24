"use client";
import {
  average,
  collection,
  count,
  getAggregateFromServer,
  getCountFromServer,
  query,
  sum,
  where,
} from "firebase/firestore";

import useSWR from "swr";
import { db } from "../firebase";

export const getOrdersCount = async ({ date }) => {
  const ref = collection(db, `orders`);
  let q = query(ref);
  if (date) {
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(date);
    toDate.setHours(23, 59, 59, 999);
    q = query(
      ref,
      where("timestampCreated", ">=", fromDate),
      where("timestampCreated", "<=", toDate)
    );
  }
  const data = await getAggregateFromServer(q, {
    totalRevenue: sum("payment.amount"),
    totalOrders: count(),
  });
  if (date) {
    return {
      date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
      data: data.data(),
    };
  }
  return data.data();
};

export function useOrdersCount() {
  const { data, error, isLoading } = useSWR("orders_count", (key) =>
    getOrdersCount({ date: null })
  );
  if (error) {
    console.error("Error fetching user count:", error.message);
  }
  return {
    data,
    error,
    isLoading,
  };
}

const getTotalOrdersCount = async (dates) => {
  let promisesList = [];
  for (const date of dates) {
    promisesList.push(getOrdersCount({ date }));
  }
  const list = await Promise.all(promisesList);
  return list;
};

export function useOrdersCountByTotalDays({ dates }) {
  const { data, error, isLoading } = useSWR(
    ["orders_count_by_dates", dates],
    ([key, dates]) => getTotalOrdersCount(dates.sort((a, b) => a.getTime() - b.getTime()))
  );
  if (error) {
    console.error("Error fetching user count:", error.message);
  }
  return {
    data,
    error,
    isLoading,
  };
}
