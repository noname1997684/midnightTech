"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  return (
    <div className="bg-gray-100 p-2 rounded-full items-center flex gap-2">
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
        placeholder="Search a post..."
        className="bg-transparent focus:outline-none hover:outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push(
              `/blogs/search?s=${encodeURIComponent(e.target.value)}`
            );
          }
        }}
      />
    </div>
  );
};

export default Search;
