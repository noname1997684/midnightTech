"use client";
import React from "react";
import UserInfo from "./components/UserInfo";
import SideBar from "./components/SideBar";
import AuthContextProvider from "@/contexts/AuthContext";

const layout = ({ children }) => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-6 py-4 gap-5">
      <AuthContextProvider>
        <UserInfo />
      </AuthContextProvider>
      <div className="flex w-full gap-5">
        <SideBar />
        <div className="bg-white shadow-lg rounded-lg py-4 flex-1">
          <AuthContextProvider>{children}</AuthContextProvider>
        </div>
      </div>
    </main>
  );
};

export default layout;
