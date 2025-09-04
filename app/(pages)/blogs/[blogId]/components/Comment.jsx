import React from "react";
import { formatDistanceToNow } from "date-fns";
const Comment = ({ comment }) => {
  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <img
          src={comment?.photoURL}
          className={"w-10 h-10 rounded-full object-cover"}
          w={40}
        />
        <span className="font-medium">{comment?.displayName}</span>
        <span className="text-sm text-gray-500">
          {" "}
          {comment?.timestamp
            ? formatDistanceToNow(new Date(comment?.timestamp), {
                addSuffix: true,
              })
            : "Unknown date"}
        </span>
      </div>
      <div className="mt-4">
        <p>{comment?.message}</p>
      </div>
    </div>
  );
};

export default Comment;
