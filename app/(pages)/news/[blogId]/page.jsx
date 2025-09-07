import Link from "next/link";
import React from "react";
import PostsMenuAction from "./components/PostsMenuAction";
import Search from "./components/Search";
import Comments from "./components/Comments";
import { getBlog } from "@/lib/firestore/blogs/read_server";
import { formatDistanceToNow } from "date-fns";
import AuthContextProvider from "@/contexts/AuthContext";
const page = async ({ params }) => {
  const { blogId } = params;
  const blog = await getBlog(blogId);
  const categories = [
    {
      name: "All Posts",
      query: "",
    },
    {
      name: "Technology",
      query: "technology",
    },
    {
      name: "Game",
      query: "game",
    },
    {
      name: "Coding",
      query: "coding",
    },
    {
      name: "Product",
      query: "product",
    },
    {
      name: "Guide",
      query: "guide",
    },
    {
      name: "Review",
      query: "review",
    },
  ];
  return (
    <div className="flex flex-col gap-8 px-5 mt-10">
      <div className="flex gap-8 ">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {blog?.title ||
              "Lorem ipsum dolor sit amet consectetur adipisicing elit."}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written By</span>
            <Link href={"/"} className="text-blue-800">
              {blog?.displayName}
            </Link>
            <span>on</span>
            <Link href={"/"} className="text-blue-800">
              {blog?.category.charAt(0).toUpperCase() + blog?.category.slice(1)}
            </Link>
            <span>
              {blog?.timestampCreate
                ? formatDistanceToNow(new Date(blog?.timestampCreate), {
                    addSuffix: true,
                  })
                : "Unknown date"}
            </span>
          </div>
          <p className="text-gray-500 font-medium">
            {blog?.shortDescription ||
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos aperiam enim mollitia ratione cupiditate in id quis doloremque, perspiciatis ipsum sit expedita quaerat porro neque commodi fugiat rerum deserunt maxime aliquam pariatur impedit illo? Cum architecto, ab eligendi laudantium ducimus porro? Possimus quam vel molestias eius dolorum. Labore, similique doloribus?"}
          </p>
        </div>
        <div className="hidden lg:block w-2/5">
          <img src={blog?.featureImageURL} w={600} className={"rounded-2xl"} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div
          className="lg:text-lg flex flex-col gap-6 text-justify blog-content"
          dangerouslySetInnerHTML={{
            __html: blog?.content || "<p>Blog content goes here...</p>",
          }}
        ></div>
        <div className="px-4 h-max sticky top-20">
          <h1 className=" mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col  gap-4">
            <div className="flex items-center gap-2">
              <img
                src={blog?.photoURL}
                className={"w-12 h-12 rounded-full object-cover"}
                h={48}
                w={48}
              />
              <Link href={"/"} className="text-blue-800">
                {blog?.displayName}
              </Link>
            </div>
            <div className="flex gap-2">
              <Link href={"/"}>
                <img src={"/facebook.svg"} />
              </Link>
              <Link href={"/"}>
                <img src={"/instagram.svg"} />
              </Link>
            </div>
          </div>
          <AuthContextProvider>
            <PostsMenuAction uid={blog?.uid} blogId={blogId} />
          </AuthContextProvider>
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            {categories.map((category) => (
              <Link
                key={category.query}
                href={
                  category.name === "All Posts"
                    ? "/news"
                    : `/news?f=${category.query}`
                }
                className="underline"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      <AuthContextProvider>
        <Comments blogId={blogId} />
      </AuthContextProvider>
    </div>
  );
};

export default page;
