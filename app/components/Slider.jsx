"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import Slider from "react-slick";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import SliderItem from "./SliderItem";

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
          <AuthContextProvider>
            <SliderItem product={product} key={product.id} />
          </AuthContextProvider>
        ))}
      </Slider>
    </div>
  );
}
