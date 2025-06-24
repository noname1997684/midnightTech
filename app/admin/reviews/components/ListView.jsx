"use client";

import { useProduct } from "@/lib/firestore/products/read";
import { useAllReviews } from "@/lib/firestore/reviews/read";
import { deleteReview } from "@/lib/firestore/reviews/write";
import { Avatar, Button, CircularProgress } from "@heroui/react";
import { Rating } from "@mui/material";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const ListView = () => {
  const { data: reviews } = useAllReviews();

 

  return (
    <div className="md:pr-5 md:px-0 px-5 rounded-xl flex-1 flex flex-col gap-5">
    <div className="flex flex-col gap-4">
        {reviews?.map((review)=>(
          <ReviewCard review={review} key={review.id}/>
        ))}
      </div>
    </div>
  );
};

function ReviewCard({review}){
    const [loading, setLoading] = useState(false);
    const {data:product}= useProduct(review.productId);
  const handleDelete = async () => {
    if(!confirm("Are you sure you want to delete this review?")) return;
    setLoading(true);
    try {
        
        await deleteReview(review.uid, review.productId)
        toast.success("Review deleted successfully!");
        
    } catch (error) {
        toast.error("Failed to submit review. Please try again." + error.message);
    } finally {
      setLoading(false);
    }
  }
return(
  <div className="flex gap-3 bg-white p-5 border rounded-xl">
            <div className="">
            <Avatar src={review.photoURL}/>
            </div>
            <div className="flex-1 flex flex-col ">
              <div className="flex items-center justify-between">
              <div>

              <h1 className="font-semibold">{review.displayName}</h1>
              <Rating value={review.rating} readOnly size="small"/>
              <Link href={`/products/${review.productId}`} >
              <h1 className="text-xs">{product?.title}</h1>
              </Link>
              </div>
            
              <Button 
                onClick={handleDelete} 
                disabled={loading}
                size="sm"
                color="danger"
                variant="flat"
                isIconOnly
                isDisabled={loading}
              >
                <Trash2 size={12}/>
              </Button>
           
              </div>
              <p className="text-sm text-gray-600 pt-1">{review.message}</p>
            </div>
          </div>
)
}

export default ListView;
