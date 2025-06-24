"use client";

import { Button } from "@heroui/react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const router = useRouter()
  useEffect(() => {
    setQuery(q);
  }, [q]);
  const handleSubmit =()=>{
    router.push(`/search?q=${query}`);
    router.refresh();
  }
  return (
    <form onSubmit={(e)=>{
        e.preventDefault();
        handleSubmit();
    }} className="flex w-full justify-center gap-3 items-center ">
      <input
        value={query}
        placeholder="Search for products..."
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        className="border px-5 py-3 rounded-lg bg-white focus:outline-none"
      />
      <Button type="submit">
        <Search size={13}/>
        Search
      </Button>
    </form>
  );
};

export default SearchBox;
