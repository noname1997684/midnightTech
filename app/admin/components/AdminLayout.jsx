"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { Button, CircularProgress } from "@heroui/react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firestore/firebase";


export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()
  const sidebarRef= useRef(null);
  const {user} = useAuth()
  const {data:admin,error,isLoading} = useAdmin(user?.email)
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  }

  useEffect(()=>{
    toggleSidebar()
  },[pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  },[])

  if(isLoading) {
    return( <div  className="h-screen w-screen flex justify-center items-center">
      <CircularProgress/>
    </div> 
    )
      
  }
  if(error){
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1 className="text-red-500"> {error}</h1>
      </div>
    )
  }

  if(!admin){
    return (
      <div className="h-screen w-screen flex flex-col gap-2 justify-center items-center">
        <h1 className="font-bold "> You are not an admin</h1>
        <h1 className="text-gray-600 text-sm">{user.email}</h1>
        <Button onClick={async()=>{
          await signOut(auth)
        }}>Logout</Button>
      </div>
    )
  }

  return (
    <main className="flex relative ">
        <div className="hidden md:block ">

      <Sidebar />
        </div>
        <div ref={sidebarRef} className={`fixed md:hidden ease-in-out duration-400 transition-all z-50
          ${isOpen ?"translate-x-0":"-translate-x-[260px]"}
          `}>

      <Sidebar />
        </div>
      <section className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header toggleSidebar={toggleSidebar}/>
        <section className="flex-1 bg-[#eff3f4] pt-14">{children}</section>
      </section>
    </main>
  );
}
