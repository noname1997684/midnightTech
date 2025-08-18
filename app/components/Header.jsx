"use client";
import { Heart, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import LogoutButton from "./LogoutButton";
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import HeaderClientButton from "./HeaderClientButton";
import AdminButton from "./AdminButton";

const Header = () => {
  const { user } = useAuth();
  const menuList = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
    { name: "About", link: "/about-us" },
    { name: "Contact", link: "/contact-us" },
    { name: "Blogs", link: "/blogs" },
  ];
  return (
    <nav className="z-50 bg-white bg-opacity-65 backdrop-blur-2xl sticky top-0 py-2 px-4 md:py-4 md:px-16 border-b flex items-center justify-between">
      <Link
        href={"/"}
        className="flex items-center gap-2 text-lg md:text-xl font-bold text-[#7900f5]"
      >
        <img className="h-8 md:h-8" src="/icon.png" alt="logo" />
        <h1>MIDNIGHT TECH</h1>
      </Link>
      <div className="items-center gap-4 font-semibold hidden  md:flex">
        {menuList.map((item) => (
          <Link href={item.link} key={item.name}>
            <button className="text-base px-4 py-2 rounded-lg hover:bg-gray-50">
              {item.name}
            </button>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <AuthContextProvider>
          <AdminButton />
        </AuthContextProvider>
        <Link href={"/search"}>
          <button
            title="Search Products"
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <Search size={20} />
          </button>
        </Link>
        <AuthContextProvider>
          <HeaderClientButton />
        </AuthContextProvider>
        <Link href={"/account"}>
          <button
            title="My Account"
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <UserCircle2 size={20} />
          </button>
        </Link>
        {user ? (
          <AuthContextProvider>
            <LogoutButton />
          </AuthContextProvider>
        ) : (
          <Link href={"/login"}>
            <button className="text-white bg-[#7900f5] px-4 py-2 rounded-xl text-md font-semibold hover:bg-[#7900f5]/90 transition-colors duration-300 ease-in-out">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
