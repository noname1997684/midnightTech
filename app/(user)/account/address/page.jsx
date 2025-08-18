"use client";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "@heroui/react";
import { getUser } from "@/lib/firestore/user/read_server";
import toast from "react-hot-toast";
import { updateAddress } from "@/lib/firestore/user/write";
const page = () => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const handleData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  const fetchData = async () => {
    try {
      const res = await getUser(user?.uid);
      if (!res) {
        toast.error("User not found");
        return;
      } else {
        setData(res?.address);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };
  useEffect(() => {
    if (user?.uid) {
      fetchData();
    }
  }, [user?.uid]);
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateAddress({
        uid: user?.uid,
        data: data,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setEdit(false);
      setData(null);
      setLoading(false);
    }
  };
  return (
    <section className="flex flex-col items-center justify-center ">
      <div className="w-full flex flex-col justify-start px-10">
        <h1 className="text-2xl font-bold">Address Details</h1>
      </div>
      <div className="w-full h-0.5 bg-violet-700 mt-4" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="flex flex-col px-10 items-start justify-start w-full py-6 gap-4 relative"
      >
        <div className="flex flex-col w-3/4 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Address Line 1</h1>
            <Input
              type="text"
              placeholder={data?.addressLine1}
              value={data?.addressLine1}
              onChange={(e) => handleData("addressLine1", e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Address Line 2</h1>
            <Input
              type="text"
              placeholder={data?.addressLine2}
              value={data?.addressLine2}
              onChange={(e) => handleData("addressLine2", e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Pincode</h1>
            <Input
              type="text"
              placeholder={data?.pincode}
              value={data?.pincode}
              onChange={(e) => handleData("pincode", e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">City</h1>
            <Input
              type="text"
              placeholder={data?.city}
              value={data?.city}
              onChange={(e) => handleData("city", e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">State</h1>
            <Input
              type="text"
              placeholder={data?.state}
              value={data?.state}
              onChange={(e) => handleData("state", e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Delivery Notes</h1>
            <textarea
              type="text"
              placeholder={data?.orderNote}
              value={data?.orderNote || ""}
              disabled={!edit}
              onChange={(e) => handleData("orderNote", e.target.value)}
              className="border px-4 py-2 rounded-lg w-full focus:outline-none"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 p-5 flex gap-4">
          <Button
            type="button"
            onClick={() => setEdit(!edit)}
            color={!edit ? "secondary" : "primary"}
            className="font-semibold text-medium"
          >
            {edit ? "Cancel" : "Edit Address"}
          </Button>
          {edit && (
            <Button
              type="submit"
              color="secondary"
              className="font-semibold text-medium"
              isLoading={loading}
              isDisabled={loading}
            >
              Save Changes
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default page;
