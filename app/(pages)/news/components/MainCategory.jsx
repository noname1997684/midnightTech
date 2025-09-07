"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const MainCategory = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const f = searchParams.get("f");
  const [searchQuery, setSearchQuery] = React.useState("");
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
  const handleCategoryClick = (query) => {
    const params = new URLSearchParams(searchParams);

    if (query === "") {
      params.delete("f");
    } else {
      params.set("f", query);
    }
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-between gap-4">
      <div className="flex-1 flex items-center justify-between flex-wrap">
        {categories.map((category) => (
          <Button
            key={category.query}
            onClick={() => handleCategoryClick(category.query)}
            className={`${
              f === category.query || (f === null && category.query === "")
                ? "bg-violet-800 text-white"
                : "text-black bg-transparent"
            } rounded-full px-4 py-2 text-medium font-semibold`}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <span className="text-xl font-medium">|</span>

      <div className="bg-gray-100 p-2 rounded-full flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="gray"
        >
          <circle cx="10.5" cy="10.5" r="7.5" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
        <input
          type="text"
          placeholder="search a post..."
          className="bg-transparent focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/news/search?s=${encodeURIComponent(searchQuery)}`);
            }
          }}
        />
      </div>
    </div>
  );
};

export default MainCategory;
