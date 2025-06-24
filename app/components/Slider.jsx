"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import Slider from "react-slick";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";

export default function FeaturedProductSlider({ featuredProducts }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className=" overflow-hidden">
      <Slider {...settings}>
        {featuredProducts.map((product) => (
          <div>
            <div className="flex flex-col-reverse md:flex-row gap-4 bg-[#f8f8f8] p-5 md:px-24 md:py-20 w-full">
              <div className="flex-1 flex flex-col md:gap-10 gap-4">
                <h2 className="text-gray-500 text-xs md:text-base">
                  NEW TECHNOLOGY
                </h2>
                <div className="flex flex-col gap-4">
                  <Link href={`/products/${product.id}`}>
                    <h1 className="md:text-4xl text-xl font-semibold">
                      {product.title}
                    </h1>
                  </Link>
                  <h1 className="text-gray-600 md:text-sm text-xs max-w-9 line-clamp-2">
                    {product.shortDescription}
                  </h1>
                </div>
                <div className="gap-4 items-center flex">
                  <AuthContextProvider>
                    <Link href={`/checkout?type=buynow&productId=${product.id}`}>
                    <button className="bg-blue-500 text-white md:text-sm text-xs px-4 py-1.5 rounded-lg">
                      BUY NOW
                    </button>
                    </Link>
                    <AddToCartButton productId={product?.id} type={"large"} />
                    <FavoriteButton productId={product?.id} />
                  </AuthContextProvider>
                </div>
              </div>
              <div>
                <Link href={`/products/${product.id}`}>
                  <img
                    className="md:h-[23rem] h-[14rem]"
                    src={product.featureImageURL}
                    alt={product.title}
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
