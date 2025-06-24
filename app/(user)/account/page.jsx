"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/lib/firestore/orders/read";
import { CircularProgress } from "@heroui/react";

const page = () => {
  const { user } = useAuth();
  const { data: orders, error, isLoading } = useOrders(user?.uid);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  return (
    <main className="flex flex-col gap-4 p-5">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      {(!orders || orders.length === 0) && (
        <div className="flex flex-col items-center justify-center gap-3 py-11">
          <div className="flex justify-center">
            <img className="h-44" src="/svg/Empty.svg" alt="empty" />
          </div>
          <h1>You have no order</h1>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {orders?.map((order, orderIndex) => {
          const totalAmount = order.checkout.line_items.reduce(
            (acc, item) => acc + item.price_data.unit_amount/100 * item.quantity,0
    );
          return (
            <div className="flex flex-col gap-2  border p-4 rounded-lg">
              <div className="flex flex-col gap-2">

              <div className="flex gap-3">
                <h3>{orderIndex + 1}</h3>
                <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
                  {order.paymentMode}
                </h3>
                <h3 className="bg-green-100 text-green-500 text-xs rounded-lg px-2 py-1 uppercase">
                  {order.status || "Pending"}
                </h3>
                <h3 className="text-green-600">$ {totalAmount}</h3>
              </div>
                <h4 className="text-gray-600 text-xs">
                  {order.timestampCreated?.toDate()?.toString()}
                </h4>
              </div>
              <div>
                {order.checkout.line_items.map((product) => {
                  return (
                    <div className="flex gap-2 items-center">
                      <img
                        className="h-10 w-10 rounded-lg"
                        src={product.price_data.product_data.images[0]}
                        alt="Product Image"
                      />
                      <div>
                        <h1 className="font-bold">{product.price_data.product_data.name}</h1>
                        <h1 className="text-xs text-gray-500">
                          $ {product.price_data.unit_amount / 100}{" "}
                          <span>X</span>{" "}
                          <span>{product.quantity.toString()}</span>
                        </h1>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default page;
