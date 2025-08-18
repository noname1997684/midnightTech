import { Tab } from "@/app/admin/components/Sidebar";
import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BusinessIcon from "@mui/icons-material/Business";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firestore/firebase";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
const SideBar = () => {
  const sideBarMenu = [
    {
      name: "Profile Details",
      icon: <AccountCircleIcon />,
      link: "/account",
    },
    {
      name: "Order History",
      icon: <ReceiptLongIcon />,
      link: "/account/orders",
    },
    { name: "Address", icon: <BusinessIcon />, link: "/account/address" },
  ];
  return (
    <section className="bg-white border-r flex flex-col gap-5 px-5 py-3 rounded-lg w-[260px] h-screen sticky top-0 shadow-lg">
      <ul className=" flex overflow-y-auto flex-col gap-4 ">
        {sideBarMenu.map((item) => {
          return <Tab item={item} key={item.name} />;
        })}
      </ul>
      <hr />
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

export default SideBar;
