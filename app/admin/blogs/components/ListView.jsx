"use client";
import { useBlogs } from "@/lib/firestore/blogs/read";
import { deleteBlog } from "@/lib/firestore/blogs/write";
import { Button, CircularProgress } from "@heroui/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ListView = () => {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);
  const {
    data: blogs,
    error,
    isLoading,
    lastSnapDoc,
  } = useBlogs(
    pageLimit,
    lastSnapDocList.length === 0
      ? null
      : lastSnapDocList[lastSnapDocList.length - 1]
  );

  const handleNextPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.push(lastSnapDoc);
    setLastSnapDocList(newStack);
  };
  const handlePreviousPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.pop();
    setLastSnapDocList(newStack);
  };

  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="bg-white p-5 rounded-xl flex-1 ">
        <h1>{error}</h1>
      </div>
    );
  return (
    <div className="md:pr-5 md:px-0 px-5 rounded-xl flex-1 flex flex-col gap-5 w-full overflow-x-auto">
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Image</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Title
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Category
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Author
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs?.map((blog, index) => (
            <Row
              index={index + lastSnapDocList?.length * pageLimit}
              blog={blog}
              key={blog.id}
            />
          ))}
        </tbody>
      </table>
      <div className="flex justify-between text-sm py-3">
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
            setPageLimit(e.target.value);
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
          isDisabled={isLoading || blogs?.length === 0}
          size="sm"
          variant="bordered"
          onClick={handleNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

function Row({ blog, index }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setLoading(true);
    try {
      await deleteBlog(blog.id);
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error("Failed to delete blog:" + " " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    router.push(`/admin/blogs/form?id=${blog.id}`);
  };
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex justify-center">
          <img
            className="h-10  object-cover"
            src={blog.featureImageURL}
            alt={blog.title}
          />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        {blog.title.length > 40 ? blog.title.slice(0, 40) + "..." : blog.title}{" "}
        {blog.isFeatured === true && (
          <span className=" ml-2 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-[10px] px-2 py-1 rounded-lg">
            Featured
          </span>
        )}
      </td>
      <td className="border-y bg-white px-3 py-2">{blog.category}</td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex items-center gap-2 ">
          <img src={blog.photoURL} alt="" className="h-8 rounded-full" />
          <h1>{blog.displayName}</h1>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg ">
        <div className="flex gap-2 items-center justify-center">
          <Button
            isIconOnly
            onClick={handleUpdate}
            size="sm"
            isDisabled={loading}
          >
            <Edit2 size={13} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={loading}
            isDisabled={loading}
            isIconOnly
            size="sm"
            color="danger"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default ListView;
