"use client";
import { useProducts } from "@/lib/firestore/products/read";
import { deleteProduct } from "@/lib/firestore/products/write";
import { Button, CircularProgress } from "@heroui/react";
import { Edit2, Trash2 } from "lucide-react";
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
    data: products,
    error,
    isLoading,
    lastSnapDoc,
    length,
  } = useProducts(
    pageLimit,
    lastSnapDocList.length === 0
      ? null
      : lastSnapDocList[lastSnapDocList.length - 1]
  );
  const isLastPage = length < pageLimit;
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
            <th className="font-semibold border-y bg-white px-3 py-2">Image</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Title
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Price
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Stock
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Orders
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
          {products?.map((product, index) => (
            <Row
              index={index + lastSnapDocList?.length * pageLimit}
              product={product}
              key={product.id}
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
          isDisabled={isLoading || products?.length === 0 || isLastPage}
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

function Row({ product, index }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      await deleteProduct(product.id);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product:" + " " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    router.push(`/admin/products/form?id=${product.id}`);
  };
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex justify-center">
          <img
            className="h-10  object-cover"
            src={product.featureImageURL}
            alt={product.title}
          />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        {product.title}{" "}
        {product.isFeatured === true && (
          <span className=" ml-2 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-[10px] px-2 py-1 rounded-lg">
            Featured
          </span>
        )}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <span className="text-xs text-gray-500 line-through whitespace-nowrap">
          $ {product.price}
        </span>{" "}
        $ {product.salePrice}
      </td>
      <td className="border-y bg-white px-3 py-2">{product.stock}</td>
      <td className="border-y bg-white px-3 py-2">{product.orders || 0}</td>
      <td className="border-y bg-white px-3 py-2">
        {product.stock - (product.orders || 0) <= 0 ? (
          <div className="flex items-center">
            <span className="px-2 py-1 text-xs font-bold text-red-500 bg-red-100">
              Out of Stock
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="px-2 py-1 text-xs font-bold text-green-500 bg-green-100 rounded-md">
              Available
            </span>
          </div>
        )}
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 items-center">
          <Button
            isIconOnly
            onClick={handleUpdate}
            size="sm"
            isDisabled={loading}
          >
            <Edit2 size={13} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={loading}
            isDisabled={loading}
            isIconOnly
            size="sm"
            color="danger"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default ListView;
