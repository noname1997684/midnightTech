"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import Link from "next/link";
import React from "react";

const AdminButton = () => {
  const { user } = useAuth();
  const { data } = useAdmin(user?.email);
  if (!data || data.length === 0) {
    return <></>;
  }
  return (
    <Link
      href={"/admin"}
      className="px-4 py-1 rounded-lg bg-[#7900f5] text-white hover:bg-[#6a00d4] transition-colors duration-300"
    >
      <button className="text-base font-semibold">Admin</button>
    </Link>
  );
};

export default AdminButton;
