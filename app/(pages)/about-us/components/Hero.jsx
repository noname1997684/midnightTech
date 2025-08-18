"use client";

import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <div
      className=" container flex h-[calc(100vh-68px)] bg-fixed bg-cover"
      style={{ backgroundImage: `url('/featured1.jpeg')` }}
    >
      <div className="px-36 flex  bg-[linear-gradient(256deg,transparent_34%,rgba(0,0,0,0.8)_10%)]">
        <div className="py-4 flex flex-col justify-center  gap-3 w-2/3 text-white">
          <img src="/icon.png" alt="logo" className="h-24 w-24" />
          <h3 className="text-2xl">
            Bringing the future of tech closer to you
          </h3>
          <h1 className="text-5xl font-semibold uppercase w-[80%] my-3 ">
            We deliver cutting-edge technology for modern life.
          </h1>
          <p className="text-justify">
            We pride ourselves on offering a wide range of high-quality products
            at competitive prices, ensuring that you stay ahead in the
            fast-evolving world of tech. Let us be your trusted partner in
            bringing convenience, efficiency, and modernity to your everyday
            life.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/")}
              className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 hover:scale-95 transform transition duration-300 ease-in-out"
            >
              Home Page
            </button>
            <button
              onClick={() => router.push("/contact-us")}
              className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 hover:scale-95 transform transition duration-300 ease-in-out"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
