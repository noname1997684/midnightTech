"use client";

import useGetPicture from "@/hooks/useGetPicture";
import { getCollection } from "@/lib/firestore/collections/read_server";
import { createNewCollection, updateCollection } from "@/lib/firestore/collections/write";
import { useProduct, useProducts } from "@/lib/firestore/products/read";
import { Button } from "@heroui/react";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Form = () => {
  const [data, setData] = useState(null);
  const {data:products}= useProducts(2000,null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const fetchData = async () => {
    try {
      const res = await getCollection(id);
      if (!res) {
        toast.error("Collection not found");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error("Error fetching collection data:", error.message);
    }
  };
  const { handlePicChange, picURL, setPicURL } = useGetPicture();
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  const handleData = (key, value) => {
    setData((prev) => {
      return {
        ...(prev || {}),
        [key]: value,
      };
    });
  };
  const handleCreate = async (e) => {
    setLoading(true);
    try {
      await createNewCollection(data, picURL);
      toast.success("Collection created successfully");
      setData(null);
      setPicURL(null);
      
    } catch (error) {
      toast.error("Error creating collection:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async (e) => {
    setLoading(true);
    try {
      await updateCollection(data, picURL);
      toast.success("Collection updated successfully");
      setData(null);
      setPicURL(null);
      router.push("/admin/collections");
    } catch (error) {
      toast.error("Error updating collection:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-5 rounded-xl w-full md:w-[400px] flex flex-col gap-3">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Collection</h1>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if(id){
            handleUpdate();
          }else{

            handleCreate();
          }
        }}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="collection-image" className="text-gray-500 text-sm">
            Image <span className="text-red-500">*</span>
          </label>
          {picURL && (
            <div className="flex justify-center items-center p-3">
              <img className="h-16" src={picURL} alt="collection-image" />
            </div>
          )}
          <input
          required
            onChange={handlePicChange}
            id="collection-image"
            name="collection-image"
            type="file"
            placeholder="Enter Image"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="collection-title" className="text-gray-500 text-sm">
            Title <span className="text-red-500">*</span>
          </label>
          <input
          required
            id="collection-title"
            name="collection-title"
            type="text"
            placeholder="Enter Title"
            value={data?.title || ""}
            onChange={(e) => handleData("title", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="collection-sub-title" className="text-gray-500 text-sm">
            Sub Title <span className="text-red-500">*</span>
          </label>
          <input
          required
            id="collection-sub-title"
            name="collection-sub-title"
            type="text"
            placeholder="Enter Sub Title"
            value={data?.subTitle || ""}
            onChange={(e) => handleData("subTitle", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {data?.products?.map((productId) => {
            return <ProductCard key={productId} productId={productId} setData={setData} />;
          })}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="collection-products" className="text-gray-500 text-sm">
            Select Products <span className="text-red-500">*</span>
          </label>
          <select
          required
            id="collection-products"
            name="collection-products"
           
            onChange={(e) => setData((prev) => {
              let list = [...(prev?.products || [])];
              list.push(e.target.value);
              return {
                ...prev,
                products: list,
              };
            })}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          >
            <option value="">Select Products</option>
            {products?.map((product) => (
              <option disabled={data?.products?.includes(product.id)} value={product.id} key={product.id}>{product.title}</option>
            ))}
          </select>
        </div>
        <Button type="submit" isLoading={loading} isDisabled={loading}>
          {id?"Update":"Create"}
        </Button>
      </form>
    </div>
  );
};

function ProductCard({ productId,setData }) {
  const {data: product} = useProduct(productId);  
  return <div className="flex gap-3 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
    <h2>
    {product?.title}
    </h2>
    <button onClick={(e)=>{
      e.preventDefault();
      setData((prev) => {
        let list = [...(prev?.products || [])];
        list = list.filter((id) => id !== productId);
        return {
          ...prev,
          products: list,
        };
      })
    }}><X size={12}/></button>
    </div>
}

export default Form;
