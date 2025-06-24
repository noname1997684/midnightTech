import Link from 'next/link'
import React from 'react'
import ListView from './components/ListView'

const page = () => {
  return (
    <main className='flex flex-col gap-4 p-5'>
       <div className='flex justify-between items-center'>
        <h1 className='text-xl'>Users</h1>
        
       </div>
       <ListView/>
    </main>
  )
}

export default page