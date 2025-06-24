"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/lib/firestore/admins/read'
import Link from 'next/link'
import React from 'react'

const AdminButton = () => {
  const {user} = useAuth()
  const {data} = useAdmin(user?.email)
  if(!data || data.length === 0) {
    return <></>
  }
    return (
    <Link href={"/admin"}>
    <button className='text-xs font-semibold'>Admin</button>
    </Link>
  )
}

export default AdminButton