"use client";

import PostListItem from "@/app/(pages)/news/components/PostListItem";
import { ProductCard } from "@/app/components/Products";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/lib/firestore/blogs/read";
import { getBlog } from "@/lib/firestore/blogs/read_server";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@heroui/react";

const page = () => {
  const { user } = useAuth();
  const { data, isLoading } = useUser(user?.uid);
  if (isLoading) {
    return (
      <div className=" p-10 flex justify-center items-center h-screen w-full">
        <CircularProgress />
      </div>
    );
  }
  return (
    <main className="flex flex-col justify-center items-center gap-3 p-5">
      <h1 className="text-2xl font-semibold">Saved Posts</h1>
      {!data?.savedPosts ||
        (data?.savedPosts?.length === 0 && (
          <div className="flex gap-5 flex-col justify-center py-20 items-center h-full w-full">
            <div className="flex justify-center">
              <img src="/svg/Empty.svg" alt="empty" className="h-[200px]" />
            </div>
            <h1 className="text-sm text-gray-500 font-semibold">
              You have no favorites yet.
            </h1>
          </div>
        ))}
      <div className=" gap-4 p-5 w-full  flex flex-col">
        {data?.savedPosts?.map((postId) => (
          <BlogItem key={postId} blogId={postId} />
        ))}
      </div>
    </main>
  );
};
const BlogItem = ({ blogId }) => {
  const { data: blog } = useBlog(blogId);
  return <PostListItem blog={blog} />;
};

export default page;
