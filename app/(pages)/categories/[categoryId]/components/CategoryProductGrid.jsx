"use client";

import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firestore/firebase";
import { ProductCard } from "@/app/components/Products";

const CategoryProductGrid = ({ initialProducts, categoryId, categoryName }) => {
  const [products, setProducts] = useState(initialProducts.products);
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(initialProducts.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const refetchData = async () => {
      setIsLoading(true);
      try {
        let q = query(
          collection(db, "products"),
          orderBy("timestampCreate", "desc"),
          where("categoryId", "==", categoryId),
          limit(pageLimit + 1)
        );

        const list = await getDocs(q);
        const fetchedProducts = list.docs.map((snap) => {
          const data = snap.data();
          return {
            ...data,
            id: snap.id,
            timestampCreate: data.timestampCreate
              ? data.timestampCreate.toDate().toISOString()
              : null,
            timestampUpdate: data.timestampUpdate
              ? data.timestampUpdate.toDate().toISOString()
              : null,
          };
        });

        setProducts(fetchedProducts.slice(0, pageLimit));
        setHasNextPage(fetchedProducts.length > pageLimit);
        setLastSnapDocList([]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    refetchData();
  }, [pageLimit, categoryId]);

  const fetchProducts = async (lastDocTimestamp = null) => {
    setIsLoading(true);
    try {
      let q = query(
        collection(db, "products"),
        orderBy("timestampCreate", "desc"),
        where("categoryId", "==", categoryId),
        limit(pageLimit + 1)
      );

      if (lastDocTimestamp) {
        q = query(
          collection(db, "products"),
          orderBy("timestampCreate", "desc"),
          where("categoryId", "==", categoryId),
          where("timestampCreate", "<", new Date(lastDocTimestamp)),
          limit(pageLimit + 1)
        );
      }

      const list = await getDocs(q);
      const fetchedProducts = list.docs.map((snap) => {
        const data = snap.data();
        return {
          ...data,
          id: snap.id,
          timestampCreate: data.timestampCreate
            ? data.timestampCreate.toDate().toISOString()
            : null,
          timestampUpdate: data.timestampUpdate
            ? data.timestampUpdate.toDate().toISOString()
            : null,
        };
      });

      setProducts(fetchedProducts.slice(0, pageLimit));
      setHasNextPage(fetchedProducts.length > pageLimit);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = async () => {
    if (hasNextPage && !isLoading && products.length > 0) {
      const lastProduct = products[products.length - 1];
      const newStack = [...lastSnapDocList];
      newStack.push(lastProduct.timestampCreate);
      setLastSnapDocList(newStack);

      await fetchProducts(lastProduct.timestampCreate);
    }
  };

  const handlePreviousPage = async () => {
    if (lastSnapDocList.length > 0) {
      const newStack = [...lastSnapDocList];
      newStack.pop();
      setLastSnapDocList(newStack);

      const lastTimestamp =
        newStack.length > 0 ? newStack[newStack.length - 1] : null;
      await fetchProducts(lastTimestamp);
    }
  };

  return (
    <div className="max-w-[900px] p-5 flex flex-col gap-6">
      {categoryName && (
        <h1 className="text-center font-semibold text-4xl">{categoryName}</h1>
      )}

      {products.length === 0 ? (
        <div className=" flex flex-col gap-2 items-center justify-center text-center py-8 ">
          <img src="../svg/empty.svg" alt="" />
          <h1 className="text-lg font-semibold">
            No products found in this category
          </h1>
          <button className="bg-violet-500 text-white px-4 py-2 rounded mt-4">
            Go to Home
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}
      {products.length > 0 && (
        <div className="flex justify-between items-center text-sm py-3">
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
            className="px-5 rounded-xl border"
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
            isDisabled={isLoading || !hasNextPage}
            size="sm"
            variant="bordered"
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryProductGrid;
