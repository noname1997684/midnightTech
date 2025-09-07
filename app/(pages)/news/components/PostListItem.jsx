import React from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const PostListItem = ({ blog }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="md:hidden xl:block xl:w-1/3">
        <img
          src={blog?.featureImageURL || "/featured2.jpeg"}
          className={"rounded-2xl object-cover"}
          w={735}
        />
      </div>
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link href={`/news/${blog?.id}`} className="text-4xl font-semibold">
          {blog?.title ||
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Writtent by</span>
          <div className="text-violet-800">
            {blog?.displayName || "John Doe"}
          </div>
          <span>on</span>
          <Link className="text-violet-800" href={`/news?f=${blog?.category}`}>
            {blog?.category || "Technology"}
          </Link>
          <span>
            {blog?.timestampCreate
              ? formatDistanceToNow(new Date(blog?.timestampCreate), {
                  addSuffix: true,
                })
              : "Unknown date"}
          </span>
        </div>
        <p>
          {blog?.shortDescription ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip"}
        </p>
        <Link
          className="underline text-violet-800 text-sm"
          href={`/news/${blog?.id}`}
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
