import { Heart, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import LogoutButton from "./LogoutButton";
import AuthContextProvider from "@/contexts/AuthContext";
import HeaderClientButton from "./HeaderClientButton";
import AdminButton from "./AdminButton";

const Header = () => {
  const menuList = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about-us" },
    { name: "Contact", link: "/contact-us" },
  ];
  return (
    <nav className="z-50 bg-white bg-opacity-65 backdrop-blur-2xl sticky top-0 py-2 px-4 md:py-4 md:px-16 border-b flex items-center justify-between">
      <Link href={"/"}>
      <img className="h-4 md:h-5" src="/logo.png" alt="logo" />
      </Link>
      <div className="items-center gap-2 font-semibold hidden  md:flex">
        {menuList.map((item) => (
          <Link href={item.link} key={item.name}>
            <button className="text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
              {item.name}
            </button>
          </Link>
        ))}
      </div>
     
      <div className="flex items-center gap-1">
         <AuthContextProvider>
      <AdminButton/>
      </AuthContextProvider>
        <Link href={"/search"}>
          <button
            title="Search Products"
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <Search size={14} />
          </button>
        </Link>
        <AuthContextProvider>
        <HeaderClientButton/>
        </AuthContextProvider>
        <Link href={"/account"}>
          <button title="My Account" className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50">
            <UserCircle2 size={14} />
          </button>
        </Link>
        <AuthContextProvider>

        <LogoutButton/>
        </AuthContextProvider>
      </div>
    </nav>
  );
};

export default Header;
