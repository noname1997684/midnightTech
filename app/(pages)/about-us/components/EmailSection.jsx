"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const EmailSection = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Email submitted");
    setEmail("");
  };
  return (
    <div className="bg-[#4a3e96] h-max flex flex-col items-center justify-center px-64 py-20 gap-10">
      <h1 className="text-4xl font-semibold text-white">
        Add Your Email to get our weekly updates
      </h1>
      <div className="border border-white rounded-full    w-max">
        <form className="flex items-center gap-4 p-2" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2  bg-transparent focus:bg-transparent focus:outline-none text-white placeholder:text-white"
          />
          <button
            type="submit"
            className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailSection;
