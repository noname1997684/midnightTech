import { getProductReviewsCount } from "@/lib/firestore/products/count/read";
import MyRating from "./MyRating";

export default async function RatingReview({ product }) {
  const counts = await getProductReviewsCount(product?.id);
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts.averageRating || 0} />
      <h1 className="text-sm text-gray-400">
        <span>{counts.averageRating?.toFixed(1)}</span>({counts.totalreviews})
      </h1>
    </div>
  );
}
