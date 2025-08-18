import Link from "next/link";
import React from "react";
import MainCategory from "./components/MainCategory";
import FeaturedPosts from "./components/FeaturedPosts";
import PostList from "./components/PostList";
import { getBlogs, getFeaturedBlogs } from "@/lib/firestore/blogs/read_server";

const page = async ({ searchParams }) => {
  const f = searchParams.f || null;

  const [featuredPosts] = await Promise.all([getFeaturedBlogs()]);

  let initialBlogs;

  if (f === null) {
    initialBlogs = await getBlogs({
      category: null,
      pageLimit: 10,
    });
  } else {
    initialBlogs = await getBlogs({
      category: f,
      pageLimit: 10,
    });
  }

  return (
    <div className="mt-4 flex flex-col gap-4 p-5 overflow-x-hidden">
      <div className="flex gap-4">
        <Link
          href={"/"}
          className="text-black hover:underline hover:text-violet-700 ease-in-out duration-300 transition-all"
        >
          Home
        </Link>
        <span>•</span>
        <span className="text-violet-700">Blog and Articles</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-2xl md:text-5xl lg:text-6xl font-bold">
            The latest insights, trends, and innovations shaping the tech world.
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Explore articles, tutorials, and reviews designed to keep you ahead
            in the digital age.
          </p>
        </div>
        <Link href={"/"} className="relative hidden md:block">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            className="text-lg tracking-widest animate-spin "
            style={{ animationDuration: "5000ms !important" }}
          >
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                Update latest •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share new tech •
              </textPath>
            </text>
          </svg>
          <button className="bg-violet-800 rounded-full flex items-center justify-center absolute top-0 right-0 bottom-0 left-0 w-20 h-20 m-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50"
              height="50"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <line x1="6" y1="18" x2="18" y2="6" />
              <polyline points="9 6 18 6 18 15" />
            </svg>
          </button>
        </Link>
      </div>
      <MainCategory />
      <FeaturedPosts featuredPosts={featuredPosts} />
      <div>
        <h1 className="my-8 text-2xl font-bold">
          {f === null
            ? "Recent Posts"
            : f.charAt(0).toUpperCase() + f.slice(1) + " Posts"}
        </h1>
        <PostList initialBlogs={initialBlogs} />
      </div>
    </div>
  );
};

export default page;
