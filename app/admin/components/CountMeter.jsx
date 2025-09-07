"use client";

import { useOrdersCount } from "@/lib/firestore/orders/read_count";
import { useProductsCount } from "@/lib/firestore/products/count/read_client";
import { useUsersCount } from "@/lib/firestore/user/read_count";
import React from "react";

const CountMeter = () => {
  const { data: totalProduct } = useProductsCount();
  const { data: totalUser } = useUsersCount();
  const { data: ordersCount } = useOrdersCount();
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <Card
        imageURL={"/product.png"}
        title={"Products"}
        value={totalProduct || 0}
      />
      <Card
        imageURL={"/order.png"}
        title={"Orders"}
        value={ordersCount?.totalOrders || 0}
      />
      <Card
        imageURL={"/revenue.png"}
        title={"Revenue"}
        value={`$ ${(ordersCount?.totalRevenue / 100).toFixed(2) || 0}`}
      />
      <Card
        imageURL={"/customer.png"}
        title={"Customers"}
        value={totalUser || 0}
      />
    </section>
  );
};

function Card({ title, value, imageURL }) {
  return (
    <div className=" flex gap-2 px-4 py-2 justify-between w-full items-center bg-white shadow rounded-xl">
      <div className="flex flex-col">
        <h1 className="font-semibold text-xl">{value}</h1>
        <h1 className="tex-sm text-gray-600">{title}</h1>
      </div>
      <img className="h-10" src={imageURL} alt={title} />
    </div>
  );
}

export default CountMeter;
