import React from "react";

const Coupon = () => {
  return (
    <section className="py-5 px-8 bg-white rounded-xl shadow-md flex flex-col items-center gap-4 justify-center">
      <h1 className="text-lg font-bold">Coupon Code</h1>
      <p className="text-gray-500">
        Enter your coupon code below to get a discount:
      </p>
      <input
        type="text"
        placeholder="Enter coupon code"
        className="border border-gray-300 rounded-md p-2 w-full"
      />
      <button className="bg-black text-white rounded-md px-4 py-2 mt-2 w-full">
        Apply
      </button>
    </section>
  );
};

export default Coupon;
