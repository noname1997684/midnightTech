import { getBlogs } from "@/lib/firestore/blogs/read_server";
import Link from "next/link";
import React from "react";
import PostList from "../components/PostList";
import SearchInput from "./components/SearchInput";

const page = async ({ searchParams }) => {
  const s = searchParams.s || null;
  const initialBlogs = await getBlogs({
    searchQuery: s,
    pageLimit: 10,
  });
  return (
    <main className="flex flex-col gap-4 pt-2 px-10">
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
      <SearchInput />
      <h1>
        You searched for: <span className="text-violet-700">{s}</span>
      </h1>
      <PostList initialBlogs={initialBlogs} />
    </main>
  );
};

export default page;
