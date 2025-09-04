"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useGetProductsByLikeandOrder } from "@/lib/firestore/products/read";
import React from "react";
import { ProductCard } from "./Products";
import { CircularProgress } from "@heroui/react";
import Slider from "react-slick";

const LikeProducts = () => {
  const { user } = useAuth();
  const { data: products, isLoading } = useGetProductsByLikeandOrder(user?.uid);
  if (!user || !products || products.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  return (
    <section className="w-full flex flex-col items-center gap-4 justify-center">
      <div className="max-w-[1000px] p-5 flex flex-col gap-5">
        <h1 className="text-center font-semibold text-lg">May be you like</h1>
        <Slider {...settings} className="w-full">
          {(products.length <= 2
            ? [...products, ...products, ...products]
            : products
          ).map((product) => (
            <ProductCard product={product} key={product?.id} />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default LikeProducts;
