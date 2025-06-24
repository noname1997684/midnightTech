"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

const LogoutButton = () => {
    const {user} = useAuth()
    if(!user) return <></>
    
  return (
    <button className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-50" onClick={async()=>{
        if(!confirm("Are you sure you want to log out?")) return;   
        try {
                await toast.promise(signOut(auth),{
                    error: (e)=>e.message,
                    loading: "Logging out...",
                    success: "Logged out successfully"
                })
            } catch (error) {
                toast.error("Logout failed" + error.message);
            }
        }}>
          <LogOut size={14}  />
         
        </button>
  )
}

export default LogoutButton