"use client";
import React, { useEffect, useState } from "react";
import PostListItem from "./PostListItem";
import { useBlogs } from "@/lib/firestore/blogs/read";
import { Button, CircularProgress } from "@heroui/react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firestore/firebase";
import { useSearchParams } from "next/navigation";
const PostList = ({ initialBlogs }) => {
  const [blogs, setBlogs] = useState(initialBlogs?.blogs);
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(initialBlogs.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const f = searchParams.get("f");
  const s = searchParams.get("s");
  useEffect(() => {
    const refetchData = async () => {
      setIsLoading(true);
      try {
        let q;
        if (f === null) {
          q = query(
            collection(db, "blogs"),
            orderBy("timestampCreate", "desc"),
            limit(pageLimit + 1)
          );
        } else if (s) {
          q = query(
            collection(db, "blogs"),
            where("title", ">=", s),
            where("title", "<=", s + "\uf8ff"),
            orderBy("title"),
            orderBy("timestampCreate", "desc"),
            limit(pageLimit + 1)
          );
        } else {
          q = query(
            collection(db, "blogs"),
            where("category", "==", f),
            orderBy("timestampCreate", "desc"),
            limit(pageLimit + 1)
          );
        }
        const list = await getDocs(q);
        let fetchedBlogs = list.docs.map((snap) => {
          const data = snap.data();
          return {
            ...data,
            id: snap.id,
            timestampCreate: data.timestampCreate
              ? data.timestampCreate.toDate().toISOString()
              : null,
            timestampUpdate: data.timestampUpdate
              ? data.timestampUpdate.toDate().toISOString()
              : null,
          };
        });
        if (s) {
          fetchedBlogs = fetchedBlogs.filter((blog) =>
            blog.title.toLowerCase().includes(s.toLowerCase())
          );
        }
        setBlogs(fetchedBlogs.slice(0, pageLimit));
        setHasNextPage(fetchedBlogs.length > pageLimit);
        setLastSnapDocList([]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    refetchData();
  }, [pageLimit, f, s]);

  const fetchBlogs = async (lastDocTimestamp = null) => {
    setIsLoading(true);
    try {
      let q;
      if (f === null) {
        q = query(
          collection(db, "blogs"),
          orderBy("timestampCreate", "desc"),
          limit(pageLimit + 1)
        );
      } else if (s) {
        q = query(
          collection(db, "blogs"),
          where("title", ">=", s),
          where("title", "<=", s + "\uf8ff"),
          orderBy("title"),
          orderBy("timestampCreate", "desc"),
          limit(pageLimit + 1)
        );
      } else {
        q = query(
          collection(db, "blogs"),
          where("category", "==", f),
          orderBy("timestampCreate", "desc"),
          limit(pageLimit + 1)
        );
      }

      if (lastDocTimestamp) {
        if (f === null) {
          q = query(
            collection(db, "blogs"),
            orderBy("timestampCreate", "desc"),
            where("timestampCreate", "<", new Date(lastDocTimestamp)),
            limit(pageLimit + 1)
          );
        } else {
          q = query(
            collection(db, "blogs"),
            where("category", "==", f),
            orderBy("timestampCreate", "desc"),
            where("timestampCreate", "<", new Date(lastDocTimestamp)),
            limit(pageLimit + 1)
          );
        }
      }

      const list = await getDocs(q);
      let fetchedBlogs = list.docs.map((snap) => {
        const data = snap.data();
        return {
          ...data,
          id: snap.id,
          timestampCreate: data.timestampCreate
            ? data.timestampCreate.toDate().toISOString()
            : null,
          timestampUpdate: data.timestampUpdate
            ? data.timestampUpdate.toDate().toISOString()
            : null,
        };
      });
      if (s) {
        fetchedBlogs = fetchedBlogs.filter((blog) =>
          blog.title.toLowerCase().includes(s.toLowerCase())
        );
      }
      setBlogs(fetchedBlogs.slice(0, pageLimit));
      setHasNextPage(fetchedBlogs.length > pageLimit);
    } catch (error) {
      console.error("Error fetching newss:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNextPage = async () => {
    if (hasNextPage && !isLoading && blogs.length > 0) {
      const lastBlog = blogs[blogs.length - 1];
      const newStack = [...lastSnapDocList];
      newStack.push(lastBlog.timestampCreate);
      setLastSnapDocList(newStack);

      await fetchBlogs(lastBlog.timestampCreate);
    }
  };

  const handlePreviousPage = async () => {
    if (lastSnapDocList.length > 0) {
      const newStack = [...lastSnapDocList];
      newStack.pop();
      setLastSnapDocList(newStack);

      const lastTimestamp =
        newStack.length > 0 ? newStack[newStack.length - 1] : null;
      await fetchBlogs(lastTimestamp);
    }
  };
  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  return (
    <div className="flex flex-col gap-12 mb-8 ">
      {blogs?.map((blog, index) => (
        <PostListItem key={blog.id} blog={blog} />
      ))}
      <div className="flex justify-center w-full items-center">
        <div className="flex justify-between text-sm py-3 max-w-[900px] w-full">
          <Button
            isDisabled={isLoading || lastSnapDocList.length === 0}
            size="sm"
            variant="bordered"
            onClick={handlePreviousPage}
          >
            Previous
          </Button>
          <select
            value={pageLimit}
            onChange={(e) => {
              setPageLimit(parseInt(e.target.value));
            }}
            className="px-5 rounded-xl"
            name="perpage"
            id="perpage"
          >
            <option value="3">3 items</option>
            <option value="5">5 items</option>
            <option value="10">10 items</option>
            <option value="20">20 items</option>
            <option value="100">100 items</option>
          </select>
          <Button
            isDisabled={isLoading || !hasNextPage}
            size="sm"
            variant="bordered"
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostList;
