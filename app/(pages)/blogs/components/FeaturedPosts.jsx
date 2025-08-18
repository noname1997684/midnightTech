import React from "react";

import Link from "next/link";

import { formatDistanceToNow } from "date-fns";
const FeaturedPosts = async ({ featuredPosts }) => {
  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <img
          src={featuredPosts[0]?.featureImageURL}
          className={"rounded-3xl object-cover"}
          w={895}
        />
        <div className=" flex items-center gap-4">
          <h1 className="font-semibold lg:text-lg">01.</h1>
          <Link
            href={`/blogs/${featuredPosts[0]?.id}`}
            className="text-violet-800 lg:text-lg"
          >
            {featuredPosts[0]?.category.charAt(0).toUpperCase() +
              featuredPosts[0]?.category.slice(1)}
          </Link>
          <span className="text-gray-500">
            {featuredPosts[0]?.timestampCreate
              ? formatDistanceToNow(
                  new Date(featuredPosts[0]?.timestampCreate),
                  { addSuffix: true }
                )
              : "Unknown date"}
          </span>
        </div>
        <Link
          href={`/blogs/${featuredPosts[0]?.id}`}
          className="text-xl lg:text-3xl font-semibold lg:font-bold "
        >
          {featuredPosts[0]?.title ||
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
        </Link>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="flex justify-between gap-4 lg:h-1/3">
          <div className="w-1/3 aspect-video">
            <img
              src={featuredPosts[1]?.featureImageURL || "/featured2.jpeg"}
              className={"rounded-3xl object-cover w-full h-full"}
              w={298}
            />
          </div>
          <div className="w-2/3">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">02.</h1>
              <Link
                href={`/blogs/${featuredPosts[1]?.id}`}
                className="text-violet-800"
              >
                {featuredPosts[1]?.category.charAt(0).toUpperCase() +
                  featuredPosts[1]?.category.slice(1)}
              </Link>
              <span className="text-gray-500 text-sm">
                {featuredPosts[1]?.timestampCreate
                  ? formatDistanceToNow(
                      new Date(featuredPosts[1]?.timestampCreate),
                      { addSuffix: true }
                    )
                  : "Unknown date"}
              </span>
            </div>
            <Link
              href={`/blogs/${featuredPosts[1]?.id}`}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              {featuredPosts[1]?.title ||
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
            </Link>
          </div>
        </div>
        <div className="flex justify-between gap-4 lg:h-1/3">
          <div className="w-1/3 aspect-video">
            <img
              src={featuredPosts[2]?.featureImageURL || "/featured2.jpeg"}
              className={"rounded-3xl object-cover w-full h-full"}
              w={298}
            />
          </div>
          <div className="w-2/3">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">03.</h1>
              <Link
                href={`/blogs/${featuredPosts[2]?.id}`}
                className="text-violet-800"
              >
                {featuredPosts[2]?.category.charAt(0).toUpperCase() +
                  featuredPosts[2]?.category.slice(1)}
              </Link>
              <span className="text-gray-500 text-sm">
                {featuredPosts[2]?.timestampCreate
                  ? formatDistanceToNow(
                      new Date(featuredPosts[2]?.timestampCreate),
                      { addSuffix: true }
                    )
                  : "Unknown date"}
              </span>
            </div>
            <Link
              href={`/blogs/${featuredPosts[2]?.id}`}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              {featuredPosts[2]?.title ||
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
            </Link>
          </div>
        </div>
        <div className="flex justify-between gap-4 lg:h-1/3">
          <div className="w-1/3 aspect-video">
            <img
              src={featuredPosts[3]?.featureImageURL || "/featured2.jpeg"}
              className={"rounded-3xl object-cover w-full h-full "}
              w={298}
            />
          </div>

          <div className="w-2/3">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">04.</h1>
              <Link
                href={`/blogs/${featuredPosts[3]?.id}`}
                className="text-violet-800"
              >
                {featuredPosts[3]?.category.charAt(0).toUpperCase() +
                  featuredPosts[3]?.category.slice(1)}
              </Link>
              <span className="text-gray-500 text-sm">
                {featuredPosts[3]?.timestampCreate
                  ? formatDistanceToNow(
                      new Date(featuredPosts[3]?.timestampCreate),
                      { addSuffix: true }
                    )
                  : "Unknown date"}
              </span>
            </div>
            <Link
              href={`/blogs/${featuredPosts[3]?.id}`}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              {featuredPosts[3]?.title ||
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;
