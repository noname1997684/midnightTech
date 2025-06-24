"use client";

import { useState } from "react";

const Photos = ({imageList}) => {
    const [selectedImage, setSelectedImage] = useState(imageList[0]);
    if(imageList.length === 0) {
        return <></>
    }
  return (
    <div className='flex flex-col gap-3 w-full '>
        <div className='flex justify-center w-full'>

        <img className='md:h-[430px] h-[350px] object-cover' src={selectedImage} alt='photo' />
        </div>
        <div className="flex flex-wrap gap-3 justify-center items-center">
            {imageList.map((image)=>(
                <div className="w-[80px] border rounded p-2" onClick={()=>setSelectedImage(image)} key={image}>
                    <img className="object-cover " src={image} alt="photo" />
                </div>
            ) )}
        </div>
    </div>
  )
}

export default Photos