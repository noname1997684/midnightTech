"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useGetOrdersCountByUser } from "@/lib/firestore/orders/read_count";
import { useUser } from "@/lib/firestore/user/read";
import { Divider } from "@heroui/react";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import React from "react";

const UserInfo = () => {
  const { user } = useAuth();
  const { data: userData } = useUser(user?.uid);
  const { data: ordersCount } = useGetOrdersCountByUser(user?.uid);
  return (
    <section className="flex min-h-24 w-full bg-white rounded-lg items-center shadow-lg ">
      <div className="flex items-center justify-between gap-4 p-5 flex-1">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={userData?.photoURL}
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-semibold text-medium">{userData?.displayName}</p>
            <p className="text-sm text-gray-500">{userData?.email}</p>
          </div>
        </div>
        <div className="w-1.5 h-24 bg-violet-700 rounded-lg " />
      </div>
      <div className="flex items-center justify-between gap-4 p-5 flex-1">
        <div className="flex items-center gap-16">
          <div className="flex items-center justify-center w-16 h-16 bg-violet-700 rounded-full">
            <ShoppingBasketIcon className="text-white" fontSize="large" />
          </div>
          <div className="flex flex-col items-start justify-center ">
            <p className="font-semibold text-lg">Total orders placed</p>
            <p className="font-bold text-2xl text-violet-600">
              {ordersCount?.totalOrders}
            </p>
          </div>
        </div>
        <div className="w-1.5 h-24 bg-violet-700 rounded-lg " />
      </div>
      <div className="flex  items-center justify-start gap-16 flex-1">
        <div className="flex items-center justify-center w-16 h-16 bg-violet-700 rounded-full">
          <LocalAtmIcon className="text-white" fontSize="large" />
        </div>
        <div className="flex flex-col items-start justify-center ">
          <p className="font-semibold text-lg">Money spent</p>
          <p className="font-bold text-2xl text-violet-600">
            {(ordersCount?.totalRevenue / 100).toFixed(0)}$
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserInfo;
