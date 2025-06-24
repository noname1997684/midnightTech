"use client"
import { Rating } from '@mui/material'
import React, { useEffect, useState } from 'react'

const MyRating = ({value}) => {
    const [visile, setVisible] = useState(false)
    useEffect(()=>{
        setVisible(true)
    },[])
    if (!visile){
        return <></>
    }
  return (
   <Rating
        readOnly
        name="product-rating"
        defaultValue={value}
        precision={0.5}
      />
  )
}

export default MyRating