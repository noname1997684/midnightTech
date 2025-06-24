import { useCategories } from '@/lib/firestore/categories/read'
import { deleteCategory } from '@/lib/firestore/categories/write'
import { Button, CircularProgress } from '@heroui/react'
import { Edit2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ListView = () => {
  const {data:categories,error,isLoading}= useCategories()
  if(isLoading) return (
    <div>
      <CircularProgress/>
    </div>
  )
  if(error) return (
    <div className='bg-white p-5 rounded-xl flex-1 '>
      <h1>{error}</h1>
    </div>
  )
  return (
    <div className='md:pr-5 md:px-0 px-5 rounded-xl flex-1 flex flex-col gap-5'>
        <h1 className='text-xl'>Categories</h1>
        <table className='border-separate border-spacing-y-3'>
          <thead>
            <tr>
              <th className='font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg'>SN</th>
              <th className='font-semibold border-y bg-white px-3 py-2'>Image</th>
              <th className='font-semibold border-y bg-white px-3 py-2 text-left'>Name</th>
              <th className='font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>

          {categories?.map((category,index) => (
           <Row index={index} category={category} key={category.id}/>
          ))}
          </tbody>
        </table>
    </div>
  )
}

function Row({category,index}){
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleDelete = async ()=>{
    if(!confirm('Are you sure you want to delete this category?')) return
    setLoading(true)
    try {
      await deleteCategory(category.id)
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error('Failed to delete category:' +" "+ error.message)
    } finally{
      setLoading(false)
    }
  }

  const handleUpdate=()=>{
    router.push(`/admin/categories?id=${category.id}`)
  }
  return (
     <tr>
              <td className='border-y bg-white px-3 py-2 border-l rounded-l-lg text-center'>{index+1}</td>
              <td className='border-y bg-white px-3 py-2'>
                <div className='flex justify-center'>
                  <img className='h-10  object-cover' src={category.imageURL} alt={category.name} />
                </div>
              </td>
              <td className='border-y bg-white px-3 py-2'>{category.name}</td>
              <td className='border-y bg-white px-3 py-2 border-r rounded-r-lg'>
                <div className='flex gap-2 items-center'>
                  <Button isIconOnly onClick={handleUpdate} size='sm' isDisabled={loading}>
                    <Edit2 size={13}/>
                  </Button>
                  <Button  onClick={handleDelete} isLoading={loading} isDisabled={loading} isIconOnly size='sm' color='danger'>
                    <Trash2 size={13}/>
                  </Button>
                </div>
              </td>
            </tr>
  )
}

export default ListView