"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const s = searchParams.get("s");
  const [searchQuery, setSearchQuery] = useState(s || "");
  const router = useRouter();
  return (
    <div className="flex w-full justify-center">
      <div className="bg-gray-100 p-2 rounded-full flex items-center justify-center gap-2 w-fit">
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
          placeholder="search a news..."
          className="bg-transparent outline-none hover:outline-none focus:outline-none"
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

export default SearchInput;
