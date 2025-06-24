"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import { CircularProgress } from "@heroui/react";
import Link from "next/link";

const layout = ({ children }) => {
  return (
    <main>
      <Header />

      <AuthContextProvider>
        <UserChecking>
          <section className="min-h-screen">{children}</section>
        </UserChecking>
      </AuthContextProvider>
      <Footer />
    </main>
  );
};

const UserChecking = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="h-screen w-full flex justify-center items-center flex-col gap-3">
        <h1 className="text-sm text-gray-600">Please login to continue</h1>
        <Link href={"/login"}>
          <button className="text-white bg-blue-500 px-4 py-2 rounded-xl text-sm">
            Login
          </button>
        </Link>
      </div>
    );
  }
  return <>{children}</>;
};

export default layout;
