import { useProductRankByOrder } from "@/lib/firestore/products/read";
import { Button, CircularProgress } from "@heroui/react";
import React, { useEffect, useState } from "react";

const RankProducts = () => {
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
  } = useProductRankByOrder(
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
  if (error) return <div>{error.message}</div>;
  return (
    <div className="md:pr-5 md:px-0 px-5 rounded-xl flex-1 flex flex-col gap-5 w-full overflow-x-auto">
      <table className="">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 ">SN</th>
            <th className="font-semibold  bg-white px-3 py-2">Image</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Title
            </th>

            <th className="font-semibold border-y bg-white px-3 py-2  text-center">
              Orders
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => (
            <Row
              index={index + lastSnapDocList?.length * pageLimit}
              product={product}
              key={product?.id}
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
          isDisabled={isLoading || products?.length === 0}
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
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2  text-center">{index + 1}</td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex justify-center">
          <img
            className="h-10  object-cover"
            src={product?.featureImageURL}
            alt={product?.title}
          />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        {product?.title.length > 40
          ? product?.title.slice(0, 40) + "..."
          : product.title}{" "}
        {product?.isFeatured === true && (
          <span className=" ml-2 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-[10px] px-2 py-1 rounded-lg">
            Featured
          </span>
        )}
      </td>
      <td className="border-y bg-white px-3 py-2">{product?.orders || 0}</td>
    </tr>
  );
}

export default RankProducts;
