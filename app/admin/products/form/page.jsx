"use client";

import { useEffect, useState } from "react";
import BasicDetails from "./components/BasicDetails";
import Images from "./components/Images";
import Description from "./components/Decription";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { createNewProduct, updateProduct } from "@/lib/firestore/products/write";
import useGetPicture from "@/hooks/useGetPicture";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/firestore/products/read_server";
import { useRouter } from "next/navigation";

const page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter()
  const id = searchParams.get("id");

 
  const {
    picURL: featureImage,
    setPicURL,
    handlePicChange,
    handleMultiplePicChange,
    picURLs,
    setPicURLs,
  } = useGetPicture();
   const fetchData = async () => {
    try {
      const res = await getProduct(id);
      if (!res) {
        toast.error("Product not found");
        return;
      } else {
        setData(res);
        setPicURLs(res.imagesURLs || []);
        setPicURL(res.featureImageURL || null);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  const handleCreate = async () => {
    setLoading(true);
    try {
      await createNewProduct(data, featureImage, picURLs);
      toast.success("Product created successfully");
       router.push("/admin/products");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setData(null);
      setPicURLs([]);
      setPicURL(null);
    }
  };
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateProduct(data, featureImage, picURLs);
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setData(null);
      setPicURLs([]);
      setPicURL(null);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if(id){
          handleUpdate();
        }else{
        handleCreate();
        }
      }}
      className="flex flex-col gap-4 p-5"
    >
      <div className="flex items-center justify-between w-full">
        <h1 className=" font-semibold">
          {id ? "Update Product" : "Create New Product"}
        </h1>
        <Button type="submit" isLoading={loading} isDisabled={loading}>
          {id?"Update":"Create"}
        </Button>
      </div>
      <div className="flex gap-5 flex-col md:flex-row">
        <div className="flex flex-1">
          <BasicDetails data={data} handleData={handleData} />
        </div>
        <div className="flex flex-col gap-5 flex-1 h-full">
          <Images
            featureImage={featureImage}
            handlePicChange={handlePicChange}
            handleMultiplePicChange={handleMultiplePicChange}
            picURLs={picURLs}
          />
          <Description data={data} handleData={handleData} />
        </div>
      </div>
    </form>
  );
};

export default page;
