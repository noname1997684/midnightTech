"use client";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import ModeIcon from "@mui/icons-material/Mode";
import {
  Avatar,
  Button,
  DatePicker,
  Input,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { getUser } from "@/lib/firestore/user/read_server";
import toast from "react-hot-toast";
import useGetPicture from "@/hooks/useGetPicture";
import { parseDate } from "@internationalized/date";
import { updateUser } from "@/lib/firestore/user/write";
import { User2Icon } from "lucide-react";
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
  const { picURL: featureImage, setPicURL, handlePicChange } = useGetPicture();
  const picRef = useRef(null);
  function dateObjToString(dateObj) {
    if (!dateObj) return "";
    if (typeof dateObj === "string") return dateObj;
    const mm = String(dateObj.month).padStart(2, "0");
    const dd = String(dateObj.day).padStart(2, "0");
    const yyyy = dateObj.year;
    return `${yyyy}-${mm}-${dd}`;
  }
  const fetchData = async () => {
    try {
      const res = await getUser(user?.uid);
      if (!res) {
        toast.error("User not found");
        return;
      } else {
        setData(res);
        setPicURL(res?.photoURL || null);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };
  useEffect(() => {
    if (user?.uid) {
      fetchData();
      console.log("User ID:", user.uid);
    }
  }, [user?.uid]);
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateUser({
        uid: user?.uid,
        data: data,
        photoURL: featureImage,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      setData(null);
      setPicURL(null);
    } finally {
      setEdit(false);
      setLoading(false);
    }
  };
  return (
    <section className="flex flex-col items-center justify-center ">
      <div className="w-full flex flex-col justify-start px-10">
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>
      <div className="w-full h-0.5 bg-violet-700 mt-4" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="flex flex-col px-10 items-start justify-start w-full py-6 gap-4 relative"
      >
        <div className="w-24 h-24  flex  relative ">
          <Avatar
            src={featureImage}
            name={data?.displayName}
            className="object-cover w-full h-full rounded-full bg-gray-300"
            showFallback
            fallback={<User2Icon fontSize={64} size={64} />}
          />
          {edit && (
            <div>
              <button
                type="button"
                className="absolute bottom-0 -right-1 bg-white rounded-full p-1 h-10 w-10 shadow-md border-violet-600 border-1"
                onClick={() => {
                  picRef.current.click();
                }}
              >
                <ModeIcon />
              </button>
              <input
                type="file"
                className="hidden"
                ref={picRef}
                onChange={handlePicChange}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col w-3/4 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Name</h1>
            <Input
              type="text"
              placeholder={data?.displayName}
              value={data?.displayName}
              onChange={(e) => handleData("displayName", e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Date Of Birth</h1>
            <DatePicker
              isDisabled={!edit}
              value={data?.dateOfBirth ? parseDate(data.dateOfBirth) : null}
              onChange={(date) => {
                handleData("dateOfBirth", dateObjToString(date));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Gender</h1>
            <RadioGroup
              orientation="horizontal"
              isDisabled={!edit}
              value={data?.gender}
              onChange={(e) => handleData("gender", e.target.value)}
            >
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Email</h1>
            {edit && (
              <h1 className="text-sm text-red-600">
                This field cannot be edited
              </h1>
            )}
            <Input type="email" placeholder={data?.email} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">Phone Number</h1>
            <Input
              type="tel"
              placeholder={data?.phoneNumber || ""}
              disabled={!edit}
              onChange={(e) => handleData("phoneNumber", e.target.value)}
              value={data?.phoneNumber || ""}
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
            {edit ? "Cancel" : "Edit Profile"}
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
