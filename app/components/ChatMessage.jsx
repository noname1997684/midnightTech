import React from "react";

import SmartToyIcon from "@mui/icons-material/SmartToy";
const ChatMessage = ({ message }) => {
  return (
    !message.hideInChat && (
      <div
        className={`${
          message.role === "user" ? "flex-col items-end" : "items-end "
        } flex gap-3  `}
      >
        {message.role === "model" && (
          <div className="bg-violet-500 p-2 fill-violet-500 rounded-full w-max">
            <SmartToyIcon fontSize="large" className="text-white" />
          </div>
        )}
        <p
          className={`${
            message.role === "model"
              ? "bg-slate-200"
              : "text-white bg-violet-600"
          } mesage-text py-3 px-4 max-w-[75%] break-words whitespace-pre-line text-sm ${
            message.isError && "text-red-600"
          }`}
          style={
            message.role === "model"
              ? { borderRadius: "13px 13px 13px 3px" }
              : { borderRadius: "13px 13px 3px 13px" }
          }
        >
          {message.text}
        </p>
      </div>
    )
  );
};

export default ChatMessage;
