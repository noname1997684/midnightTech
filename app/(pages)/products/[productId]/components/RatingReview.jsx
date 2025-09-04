import MyRating from "@/app/components/MyRating";
import { getProductReviewsCount } from "@/lib/firestore/products/count/read";
import React from "react";

const RatingReview = async ({ product }) => {
  const counts = await getProductReviewsCount(product?.id);
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts.averageRating || 0} />
      <h1 className="text-sm text-gray-400">
        <span>{counts.averageRating?.toFixed(1)}</span>({counts.totalreviews})
      </h1>
    </div>
  );
};

export default RatingReview;
