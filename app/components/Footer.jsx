import { Mail, MapPin, PhoneIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col gap-3 w-full bg-blue-100 border-t p-5 md:p-10">
      <div className="border-b w-full flex flex-col md:flex-row md:justify-between gap-3">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-lg md:text-xl font-bold text-[#7900f5]"
        >
          <img className="h-8 md:h-8" src="/icon.png" alt="logo" />
          <h1>MIDNIGHT TECH</h1>
        </Link>
        <div className=" flex-1 flex flex-col md:flex-row justify-end gap-4">
          <div className="flex items-center gap-2">
            <PhoneIcon size={12} className="text-blue-500" />
            <h2 className="text-sm text-gray-600">+09 123 3445 423</h2>
          </div>
          <div size={12} className="flex items-center gap-2">
            <Mail className="text-blue-500" />
            <h2 className="text-sm text-gray-600">admin@gmail.com</h2>
          </div>
          <div size={12} className="flex items-center gap-2">
            <MapPin className="text-blue-500" />
            <h2 className="text-sm text-gray-600">
              123,Truong Chinh,Hai Ba Trung,Ha Noi
            </h2>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-center w-full">
        <h3 className="text-xs text-gray-700">
          @ 2025 . All rights reserved by [admin]
        </h3>
      </div>
    </footer>
  );
};

export default Footer;
