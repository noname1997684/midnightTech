"use client";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { Button } from "@heroui/react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const handleData = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSendEmail = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Reset link has been sent to your email");
    } catch (error) {
      toast.error(
        "Something went wrong, please try again later." + error.message
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="w-full flex justify-center items-center bg-gray-300 md:p-24 p-10 min-h-screen">
      <section className="flex flex-col gap-3">
        <div className="flex justify-center">
          <img className="h-12" src="/logo.png" alt="logo" />
        </div>
        <div className="flex flex-col gap-3 bg-white md:p-10 p-5 rounded-xl md:min-w-[440px] w-full">
          <h1 className="font-bold text-xl">Forgot Password</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              name="user-email"
              id="user-email"
              value={data.email || ""}
              onChange={(e) => handleData("email", e.target.value)}
              placeholder="Enter your Email"
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />

            <Button
              isLoading={loading}
              isDisabled={loading}
              type="submit"
              color="secondary"
            >
              Sent Reset Link
            </Button>
          </form>
          <div className="flex justify-between">
            <Link href={"/login"}>
              <button className="font-semibold text-sm text-violet-700">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
