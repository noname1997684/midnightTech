"use client";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { Button } from "@heroui/react";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
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
  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user]);
  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Login successful");
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
          <h1 className="font-bold text-xl">Login with Email</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
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
            <input
              type="password"
              name="user-password"
              id="user-password"
              value={data.password || ""}
              onChange={(e) => handleData("password", e.target.value)}
              placeholder="Enter your Password"
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              isDisabled={loading}
            >
              Login
            </Button>
          </form>
          <div className="flex justify-between">
            <Link href={"/sign-up"}>
              <button className="font-semibold text-sm text-blue-700">
                New? Create Account
              </button>
            </Link>
            <Link href={"/forget-password"}>
              <button className="font-semibold text-sm text-blue-700">
                Forget Password?
              </button>
            </Link>
          </div>
          <hr />
          <SignInWithGoogleComponent />
        </div>
      </section>
    </main>
  );
};

export default page;

function SignInWithGoogleComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = credential.user;
      await createUser({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } catch (error) {
      toast.error("Login failed. Please try again.", error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      color="secondary"
      onClick={handleLogin}
      isLoading={isLoading}
      isDisabled={isLoading}
      className="w-full"
    >
      Sign In with Google
    </Button>
  );
}
