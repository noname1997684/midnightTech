"use client";
import { ProductCard } from "@/app/components/Products";
import { useProductsFilter } from "@/lib/firestore/products/read";
import { Button, CircularProgress } from "@heroui/react";
import React, { useEffect, useState } from "react";

const ProductsGridList = ({ filter }) => {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit, filter]);
  const {
    data: products,
    error,
    isLoading,
    lastSnapDoc,
    length,
  } = useProductsFilter(
    filter,
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
  if (!products || products.length === 0) {
    return (
      <div className="bg-white p-5 rounded-xl flex-1 items-center flex-col justify-center flex">
        <img
          src="../svg/empty.svg"
          alt="No products found"
          className="h-64 w-64"
        />
        <h1 className="text-lg font-semibold">No products found</h1>
      </div>
    );
  }
  return (
    <section className="w-full flex flex-col items-center gap-4 justify-center">
      <div className="max-w-[900px] p-5 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4  lg:grid-cols-4 ">
          {products.map((product) => (
            <ProductCard product={product} key={product?.id} />
          ))}
        </div>
      </div>
      <div className="flex justify-between text-sm py-3 px-4 max-w-[900px] w-full ">
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
            setPageLimit(parseInt(e.target.value));
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
    </section>
  );
};

export default ProductsGridList;
