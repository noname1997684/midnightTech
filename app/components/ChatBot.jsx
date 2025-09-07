"use client";
import React, { useEffect, useRef, useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { companyInfo, WebsiteWorkFlow } from "@/public/companyInfo";
const ChatBot = ({ products, blogs, brands, categories, collections }) => {
  const prompt = `${companyInfo} 
  ${WebsiteWorkFlow}
  Here another data that you can use to answer the user's questions:
  Products: ${JSON.stringify(products)}
  Blogs: ${JSON.stringify(blogs)}
  Brands: ${JSON.stringify(brands)}
  Categories: ${JSON.stringify(categories)}
  Collections: ${JSON.stringify(collections)}
  To calculate the remaining stock, subtract the number of orders (if any) from the stock quantity.
  if stock subtract orders is 0 or less than 0, say that the product is out of stock.
  If you the question is not related to the above data, politely inform the user that you are unable to assist with that particular inquiry.
  If you don't know the answer, tell the user to contact customer support for further assistance, the email is midnighttechsupport@gmail.com or call +84123456789.
  Remember to answer in a friendly and professional manner, providing accurate and helpful information to enhance the user's experience.
  `;
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: prompt,
    },
  ]);
  const [showChatBot, setShowChatBot] = useState(false);
  const chatBotRef = useRef(null);
  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text: text, isError },
      ]);
    };
    history = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: history,
      }),
    };
    try {
      const response = await fetch("/api/chatbot", requestOptions);
      const data = await response.json();
      if (data.error) {
        console.error("Error:", data.error);
        return;
      }
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBotRef.current.scrollTo({
      top: chatBotRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button
        className={`${
          showChatBot && "rotate-90"
        } fixed bottom-7 right-7 z-50 border-none h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer bg-violet-600`}
        onClick={() => setShowChatBot(!showChatBot)}
      >
        {!showChatBot && (
          <div className="absolute bg-violet-500 p-2 fill-violet-500 rounded-full w-max">
            <SmartToyIcon fontSize="large" className="text-white" />
          </div>
        )}
        {showChatBot && (
          <div className="absolute text-white">
            <CloseIcon fontSize="large" />
          </div>
        )}
      </button>
      <div
        className={`chatbot-popup fixed ${
          showChatBot
            ? "opacity-100 pointer-events-auto scale-100"
            : "opacity-0 pointer-events-none scale-[0.2]"
        } bottom-24 right-9  bg-white w-[420px] overflow-hidden rounded-2xl origin-bottom-right shadow-2xl transition-all duration-300 ease-in-out z-50`}
      >
        <div className="chat-header flex justify-between py-4 px-6 items-center bg-violet-600">
          <div className="header-info flex gap-2 items-center">
            <div className="bg-white p-2 fill-violet-500 rounded-full ">
              <SmartToyIcon fontSize="large" className="text-violet-500" />
            </div>
            <h2 className="logo-text text-white text-lg font-semibold">
              Chatbot
            </h2>
          </div>
          <button
            onClick={() => setShowChatBot(!showChatBot)}
            className=" flex justify-center items-center h-10 w-10 border-none outline-none text-white text-3xl cursor-pointer pt-1 -mr-2 bg-none rounded-full transition-all duration-300 ease-in-out hover:bg-violet-500"
          >
            <KeyboardArrowDownIcon />
          </button>
        </div>
        <div
          ref={chatBotRef}
          className="chatbot-body flex flex-col gap-5 mb-20 py-6 px-6 overflow-y-auto h-[460px] chat-scollbar"
        >
          <div className="message bot-message flex gap-3 items-center">
            <div className="bg-violet-500 p-2 fill-violet-500 rounded-full w-max">
              <SmartToyIcon fontSize="large" className="text-white" />
            </div>
            <p
              style={{ borderRadius: "13px 13px 13px 3px" }}
              className="mesage-text bg-slate-200 py-3 px-4 max-w-[75%] break-words whitespace-pre-line text-sm"
            >
              Hey there! I'm your friendly chatbot assistant. How can I help you
              today?
            </p>
          </div>
          {chatHistory.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-footer absolute bottom-0 w-full bg-white pt-4 pb-6 px-5">
          <ChatForm
            setChatHistory={setChatHistory}
            chatHistory={chatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
