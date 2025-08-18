"use client";

import { auth } from "@/lib/firestore/firebase";
import { signOut } from "firebase/auth";
import {
  Book,
  LayoutDashboard,
  Library,
  LogOut,
  Package,
  Pocket,
  ShieldUser,
  ShoppingCart,
  Star,
  User,
  FileImage,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const Sidebar = () => {
  const menuList = [
    {
      name: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard />,
    },
    {
      name: "Products",
      link: "/admin/products",
      icon: <Package />,
    },
    {
      name: "Categories",
      link: "/admin/categories",
      icon: <Book />,
    },
    {
      name: "Brands",
      link: "/admin/brands",
      icon: <Pocket />,
    },
    {
      name: "Orders",
      link: "/admin/orders",
      icon: <ShoppingCart />,
    },
    {
      name: "Customers",
      link: "/admin/customers",
      icon: <User />,
    },
    {
      name: "Reviews",
      link: "/admin/reviews",
      icon: <Star />,
    },
    {
      name: "Collections",
      link: "/admin/collections",
      icon: <Library />,
    },
    {
      name: "blogs",
      link: "/admin/blogs",
      icon: <FileImage />,
    },
    {
      name: "Admins",
      link: "/admin/admins",
      icon: <ShieldUser />,
    },
  ];
  return (
    <section className="sticky top-0 bg-white border-r gap-5 px-5 py-3 h-screen overflow-hidden w-[260px] z-50 flex flex-col  justify-between">
      <div className="flex justify-center py-4">
        <Link href={"/"}>
          <img className="h-8" src="/logo.png" alt="logo" />
        </Link>
      </div>
      <ul className="flex-1 flex h-full overflow-y-auto flex-col gap-4">
        {menuList.map((item) => {
          return <Tab item={item} />;
        })}
      </ul>
      <div className="flex justify-center ">
        <button
          className="flex items-center gap-3 font-semibold px-3 py-2 hover:bg-indigo-100 rounded-xl w-full ease-soft-spring transition-all duration-300 "
          onClick={async () => {
            try {
              await toast.promise(signOut(auth), {
                error: (e) => e.message,
                loading: "Logging out...",
                success: "Logged out successfully",
              });
            } catch (error) {
              toast.error("Logout failed" + error.message);
            }
          }}
        >
          <LogOut />
          Logout
        </button>
      </div>
    </section>
  );
};

export default Sidebar;

export const Tab = ({ item }) => {
  const pathname = usePathname();
  const isSelected = pathname === item.link;
  return (
    <Link href={item.link} key={item.name}>
      <li
        className={`list-none flex items-center font-semibold gap-2 px-4 py-2 rounded-lg ease-soft-spring transition-all duration-300
                            ${
                              isSelected
                                ? " bg-[#879fff] text-white"
                                : "bg-white text-black"
                            } 
                            `}
      >
        {item.icon}
        {item.name}
      </li>
    </Link>
  );
};
