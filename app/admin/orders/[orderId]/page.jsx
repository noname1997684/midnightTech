"use client";
import { useOrder } from "@/lib/firestore/orders/read";
import { CircularProgress } from "@heroui/react";
import { useParams } from "next/navigation";
import React from "react";
import ChangeStatus from "./components/ChangeStatus";

const page = () => {
  const { orderId } = useParams();
  const { data: order, error, isLoading } = useOrder(orderId);
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
  const totalAmount = order.checkout.line_items.reduce(
    (acc, item) => acc + (item.price_data.unit_amount / 100) * item.quantity,
    0
  );

  const address = JSON.parse(order.checkout.metadata.address) || {};
  return (
    <main className="flex flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <ChangeStatus order={order} />
        </div>
      <div className="flex flex-col gap-2 bg-white border p-4 rounded-lg">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
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
        <div className="flex flex-col gap-3">
          {order.checkout.line_items.map((product) => {
            return (
              <div className="flex gap-2 items-center">
                <img
                  className="h-10 w-10 rounded-lg"
                  src={product.price_data.product_data.images[0]}
                  alt="Product Image"
                />
                <div>
                  <h1 className="font-bold">
                    {product.price_data.product_data.name}
                  </h1>
                  <h1 className="text-xs text-gray-500">
                    $ {product.price_data.unit_amount / 100} <span>X</span>{" "}
                    <span>{product.quantity.toString()}</span>
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <h1 className="text-2xl font-semibold">Address</h1>
       <div className="flex flex-col gap-2 bg-white border p-4 rounded-lg">
          <table>
            <tbody>
                <tr>
                    <td>Full Name</td>
                    <td>{address.fullName}</td>
                </tr>
                <tr>
                    <td>Mobile</td>
                    <td>{address.mobile}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{address.email}</td>
                </tr>
                <tr>
                    <td>Address Line 1</td>
                    <td>{address.addressLine1}</td>
                </tr>
                <tr>
                    <td>Address Line 2</td>
                    <td>{address.addressLine2}</td>
                </tr>
                <tr>
                    <td>Pincode</td>
                    <td>{address.pincode}</td>
                </tr>
                <tr>
                    <td>City</td>
                    <td>{address.city}</td>
                </tr>
                <tr>
                    <td>State</td>
                    <td>{address.state}</td>
                </tr>
                <tr>
                    <td>Notes</td>
                    <td>{address.note}</td>
                </tr>
            </tbody>
          </table>
       </div>
    </main>
  );
};

export default page;
