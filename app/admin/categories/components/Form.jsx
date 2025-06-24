"use client";

import useGetPicture from "@/hooks/useGetPicture";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { createNewcategory, updateCategory } from "@/lib/firestore/categories/write";
import { Button } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Form = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const fetchData = async () => {
    try {
      const res = await getCategory(id);
      if (!res) {
        toast.error("Category not found");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error("Error fetching category data:", error.message);
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
      await createNewcategory(data, picURL);
      toast.success("Category created successfully");
      setData(null);
      setPicURL(null);
      
    } catch (error) {
      toast.error("Error creating category:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async (e) => {
    setLoading(true);
    try {
      await updateCategory(data, picURL);
      toast.success("Category updated successfully");
      setData(null);
      setPicURL(null);
      router.push("/admin/categories");
    } catch (error) {
      toast.error("Error updating category:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-5 rounded-xl w-full md:w-[400px] flex flex-col gap-3">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Category</h1>
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
          <label htmlFor="category-image" className="text-gray-500 text-sm">
            Image <span className="text-red-500">*</span>
          </label>
          {picURL && (
            <div className="flex justify-center items-center p-3">
              <img className="h-16" src={picURL} alt="category-image" />
            </div>
          )}
          <input
          required
            onChange={handlePicChange}
            id="category-image"
            name="category-image"
            type="file"
            placeholder="Enter Image"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category-name" className="text-gray-500 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
          required
            id="category-name"
            name="category-name"
            type="text"
            placeholder="Enter Name"
            value={data?.name || ""}
            onChange={(e) => handleData("name", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category-slug" className="text-gray-500 text-sm">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
          required
            id="category-slug"
            name="category-slug"
            type="text"
            placeholder="Enter Slug"
            value={data?.slug || ""}
            onChange={(e) => handleData("slug", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <Button type="submit" isLoading={loading} isDisabled={loading}>
          {id?"Update":"Create"}
        </Button>
      </form>
    </div>
  );
};

export default Form;
