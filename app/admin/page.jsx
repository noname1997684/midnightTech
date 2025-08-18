"use client";
import React, { useEffect, useState } from "react";
import CountMeter from "./components/CountMeter";
import RevenueChart from "./components/RevenueChart";
import OrderChart from "./components/OrderChart";
import { useOrdersCountByTotalDays } from "@/lib/firestore/orders/read_count";
import RankProducts from "./components/RankProducts";

const page = () => {
  const [dates, setDates] = useState([]);
  useEffect(() => {
    let list = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      list.push(date);
    }
    setDates(list);
  }, []);

  const { data } = useOrdersCountByTotalDays({ dates: dates });
  return (
    <main className="flex flex-col gap-6 p-5">
      <CountMeter />
      <div className="flex flex-col md:flex-row gap-5">
        <RevenueChart items={data} />
        <OrderChart items={data} />
      </div>
      <div>
        <RankProducts />
      </div>
    </main>
  );
};

export default page;
