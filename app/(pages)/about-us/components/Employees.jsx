"use client";
import Link from "next/link";
import React from "react";

const Employees = () => {
  const employees = [
    "/employee1.png",
    "/employee2.png",
    "/employee3.png",
    "/employee4.png",
    "/employee5.png",
    "/employee6.png",
    "/employee7.png",
    "/employee8.png",
    "/employee9.png",
    "/employee10.png",
  ];
  return (
    <section className="bg-[#F3E6FA] min-h-screen flex flex-col px-64 items-center gap-10  py-20">
      <h1 className="text-4xl font-semibold text-center">
        Driven by innovation, our employees are committed to providing
        top-quality tech products and support.
      </h1>
      <div className="grid grid-cols-5 mt-10 gap-5  ">
        {employees.map((employee, index) => (
          <div
            className="flex items-center justify-center w-[160px]  "
            key={index}
          >
            <img
              src={employee}
              alt=""
              className="w-full h-full rounded-md shadow-lg object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      <Link href={"/contact-us"}>
        <button
          onClick={() => router.push("/contact-us")}
          className="bg-white text-[#4a3e96] border-[#4a3e96] border px-8 py-4 rounded-full mt-10 hover:bg-[#4a3e96] hover:text-white hover:border-white hover:border  transition-colors duration-300 flex items-center gap-3"
        >
          <span className="ml-2">📞</span>
          <h1 className="text-lg font-semibold">Contact Us</h1>
        </button>
      </Link>
    </section>
  );
};

export default Employees;
