"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useAdmin } from "@/lib/firestore/admins/read"
import { Avatar } from "@heroui/react"
import { Menu } from "lucide-react"


const Header = ({toggleSidebar}) => {
  const {user} = useAuth()
  const {data:admin}= useAdmin(user?.email)
  return (
    <section className='fixed top-0 w-full z-50 flex items-center gap-3 bg-white border-b px-4 py-3'>
        <div className="flex justify-center items-center md:hidden">
            <button onClick={toggleSidebar}>

            <Menu />
            </button>
        </div>
        <div className="w-full md:pr-[260px] pr-0 flex justify-between items-center">

        <h1 className='text-xl font-semibold'>Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="md:flex flex-col items-end hidden">
          <h1 className="text-sm font-semibold">{admin.name}</h1>
          <h1 className="text-xs text-gray-600">{admin.email}</h1>
          </div>
          <Avatar size="sm" src={admin.imageURL}/>
        </div>
        </div>
    </section>
  )
}

export default Header