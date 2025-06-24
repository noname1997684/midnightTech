"use client";
import { useAllOrders } from "@/lib/firestore/orders/read";
import { useProducts } from "@/lib/firestore/products/read";
import { deleteProduct } from "@/lib/firestore/products/write";
import { useUser } from "@/lib/firestore/user/read";
import { Avatar, Button, CircularProgress } from "@heroui/react";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ListView = () => {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);
  const {
    data: orders,
    error,
    isLoading,
    lastSnapDoc,
  } = useAllOrders(
    pageLimit,
    lastSnapDocList.length === 0
      ? null
      : lastSnapDocList[lastSnapDocList.length - 1]
  );

  const handleNextPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.push(lastSnapDoc);
    setLastSnapDocList(newStack);
  };
  const handlePreviousPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.pop();
    setLastSnapDocList(newStack);
  };

  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="bg-white p-5 rounded-xl flex-1 ">
        <h1>{error}</h1>
      </div>
    );
  return (
    <div className="md:pr-5 md:px-0 px-5 rounded-xl flex-1 flex flex-col gap-5 w-full overflow-x-auto">
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Customer
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Total Price
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Total Products
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Payment Mode
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Status
            </th>

            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order, index) => (
            <Row
              index={index + lastSnapDocList?.length * pageLimit}
              order={order}
              key={order.id}
            />
          ))}
        </tbody>
      </table>
      <div className="flex justify-between text-sm py-3">
        <Button
          isDisabled={isLoading || lastSnapDocList.length === 0}
          size="sm"
          variant="bordered"
          onClick={handlePreviousPage}
        >
          Previous
        </Button>
        <select
          value={pageLimit}
          onChange={(e) => {
            setPageLimit(e.target.value);
          }}
          className="px-5 rounded-xl"
          name="perpage"
          id="perpage"
        >
          <option value="3">3 items</option>
          <option value="5">5 items</option>
          <option value="10">10 items</option>
          <option value="20">20 items</option>
          <option value="100">100 items</option>
        </select>
        <Button
          isDisabled={isLoading || orders?.length === 0}
          size="sm"
          variant="bordered"
          onClick={handleNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

function Row({ order, index }) {
  const [loading, setLoading] = useState(false);
  const totalAmount = order.checkout.line_items.reduce(
    (acc, item) => acc + (item.price_data.unit_amount / 100) * item.quantity,
    0
  );
  const { data: user } = useUser(order.uid);
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        <div className="flex gap-1 items-center ">
          <Avatar size="sm" src={user?.photoURL} />
          <div className="flex flex-col ">
            <h1>{user?.displayName}</h1>
            <h1 className="text-xs text-gray-500">{user?.email}</h1>
          </div>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">$ {totalAmount}</td>
      <td className="border-y bg-white px-3 py-2">
        {order.checkout.line_items.length}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex">
          <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
            {order.paymentMode}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex">
          <h3 className="bg-green-100 text-green-500 text-xs rounded-lg px-2 py-1 uppercase">
            {order.status || "Pending"}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex">
          <Link href={`/admin/orders/${order.id}`}>
            <button className="bg-black text-white px-3 py-2 rounded-lg text-xs">
              View
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
}

export default ListView;
