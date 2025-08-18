import React from "react";

const NumberSection = () => {
  return (
    <div className="bg-gradient-to-b from-[#4a3e96] to-[#F3E6FA] min-h-screen flex flex-col px-36  py-14">
      <h1 className="text-4xl font-semibold text-white mb-6 w-2/3 ">
        We have succeeded in delivering the best tech products with innovations
        and outstanding service
      </h1>
      <div className="flex  gap-16 items-center mt-10">
        <div className="flex flex-col gap-6 ">
          <h1 className="text-[#41387f] font-semibold text-6xl">300+</h1>
          <p className="w-3/4 font-semibold">
            Satisfied enterprise clients who trust our tech solutions
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-[#41387f] font-semibold text-6xl">180+</h1>
          <p className="w-3/4 font-semibold">
            Innovative gadgets and accessories launched to meet modern demands
          </p>
        </div>
      </div>
      <div className="flex gap-4 mt-10">
        <img
          src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2352&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="rounded-lg shadow-lg w-1/2 h-auto object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="rounded-lg shadow-lg w-1/2 h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default NumberSection;
