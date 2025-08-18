"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import { CircularProgress } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const layout = ({ children }) => {
  return (
    <main>
      <AuthContextProvider>
        <Header />
        <UserChecking>
          <section className="min-h-screen">{children}</section>
        </UserChecking>
      </AuthContextProvider>
      <Footer />
    </main>
  );
};

const UserChecking = ({ children }) => {
  const pathname = usePathname();
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
      <div className="h-screen w-full flex justify-center items-center flex-col gap-10">
        <h1 className="text-2xl text-gray-600 font-bold">
          Please login to{" "}
          {pathname === "/favorites"
            ? "view your favorites"
            : pathname === "/cart"
            ? "view your cart"
            : pathname === "/checkout"
            ? "proceed to checkout"
            : pathname === "/account"
            ? "view your account"
            : pathname === "/saved"
            ? "view your saved posts"
            : "continue"}
        </h1>
        <img src="../svg/login.svg" alt="" className="h-64 w-64" />
        <Link href={"/login"}>
          <button className="text-white bg-[#7900f5] px-4 py-2 rounded-xl text-md font-semibold hover:bg-[#7900f5]/90 transition-colors duration-300 ease-in-out">
            Login
          </button>
        </Link>
      </div>
    );
  }
  return <>{children}</>;
};

export default layout;
