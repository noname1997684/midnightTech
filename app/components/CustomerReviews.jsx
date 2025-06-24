import { Rating } from '@mui/material'
import React from 'react'

const CustomerReviews = () => {
    const list=[
        {
    imageURL:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=3880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Nguyễn Văn A",
    message: "Sản phẩm rất tốt, giao hàng nhanh, sẽ ủng hộ lần sau!",
    rating: 5
  },
  {
    imageURL:"https://plus.unsplash.com/premium_photo-1670071482460-5c08776521fe?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Trần Thị B",
    message: "Chất lượng tạm ổn, đúng như mô tả nhưng đóng gói hơi sơ sài.",
    rating: 3
  },
 
  {
    imageURL:"https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Phạm Thị D",
    message: "Rất hài lòng với dịch vụ và chất lượng. Nhân viên hỗ trợ nhiệt tình.",
    rating: 4
  }
    ]
  return (
    <section className='flex justify-center'>
      
        <div className='w-full p-5 md:max-w-[900px] flex flex-col gap-3'>
      <h1 className='text-center font-semibold text-xl'>Some Customer Reviews</h1>
      <div className=' grid-cols-1 md:grid-cols-3 grid gap-4'>

            {list.map((review)=>(
              <div className='flex flex-col gap-2 p-4 rounded-lg justify-center items-center border'>
                    <img src={review.imageURL} className='h-32 w-32 rounded-full object-cover' alt={review.name} />
                    <h1 className='text-sm font-semibold'>{review.name}</h1>
                     <Rating
                              readOnly
                              size="small"
                              name="customer-rating"
                              defaultValue={review.rating}
                              precision={review.rating}
                              />
                            <p className='text-sm text-gray-500 text-center'>{review.message}</p>
                </div>
            ))}
            </div>
        </div>
    </section>
  )
}

export default CustomerReviews