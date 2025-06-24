"use client";

import useGetPicture from "@/hooks/useGetPicture";
import { getAdmin } from "@/lib/firestore/admins/read_server";
import { createNewAdmin, updateAdmin } from "@/lib/firestore/admins/write";
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
      const res = await getAdmin(id);
      if (!res) {
        toast.error("Admin not found");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error("Error fetching admin data:", error.message);
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
      await createNewAdmin(data, picURL);
      toast.success("Admin created successfully");
      setData(null);
      setPicURL(null);
      
    } catch (error) {
      toast.error("Error creating admin:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async (e) => {
    setLoading(true);
    try {
      await updateAdmin(data, picURL);
      toast.success("Admin updated successfully");
      setData(null);
      setPicURL(null);
      router.push("/admin/admins");
    } catch (error) {
      toast.error("Error updating admin:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-5 rounded-xl w-full md:w-[400px] flex flex-col gap-3">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Admin</h1>
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
          <label htmlFor="admin-image" className="text-gray-500 text-sm">
            Image <span className="text-red-500">*</span>
          </label>
          {picURL && (
            <div className="flex justify-center items-center p-3">
              <img className="h-16" src={picURL} alt="admin-image" />
            </div>
          )}
          <input
          required
            onChange={handlePicChange}
            id="admin-image"
            name="admin-image"
            type="file"
            placeholder="Enter Image"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-name" className="text-gray-500 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
          required
            id="admin-name"
            name="admin-name"
            type="text"
            placeholder="Enter Name"
            value={data?.name || ""}
            onChange={(e) => handleData("name", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-email" className="text-gray-500 text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
          required
            id="admin-email"
            name="admin-email"
            type="email"
            placeholder="Enter Email"
            value={data?.email || ""}
            onChange={(e) => handleData("email", e.target.value)}
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
