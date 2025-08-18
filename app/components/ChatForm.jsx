"use client";
import React, { useRef } from "react";

import SendIcon from "@mui/icons-material/Send";
const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef(null);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { role: "model", text: "Thinking..." },
      ]);
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details provided above, please address this query, if you can't see in that information, search in web : ${userMessage}`,
        },
      ]);
    }, 600);
  };
  return (
    <form
      action=""
      className="focus-within:outline-2 focus-within:outline-violet-600 chat-form flex items-center bg-white rounded-3xl outline outline-slate-300 shadow-lg"
      onSubmit={handleFormSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        className="message-input border-none outline-none w-full bg-none h-[47px] px-4 text-sm"
        placeholder="Message..."
      />
      <button className="h-10 w-10 p-4 flex items-center justify-center bg-violet-600 text-white rounded-full border-none outline-none cursor-pointer text-lg mr-2 transition-all duration-300 ease-in-out hover:bg-violet-800">
        <SendIcon />
      </button>
    </form>
  );
};

export default ChatForm;
