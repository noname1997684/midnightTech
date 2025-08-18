"use client";

import Link from "next/link";
import Slider from "react-slick";

export default function Categories({ categories }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  if (categories.length === 0) {
    return <></>;
  }
  return (
    <div className="w-screen overflow-hidden md:p-10 p-5 flex flex-col gap-8 justify-center">
      <div className="text-lg font-semibold flex justify-center">
        {" "}
        Shop By Category
      </div>
      <Slider {...settings}>
        {(categories.length <= 2
          ? [...categories, ...categories, ...categories]
          : categories
        ).map((category) => (
          <div key={category.id}>
            <div className="px-2">
              <Link
                href={`/categories/${category.id}`}
                className="flex flex-col gap-2 items-center justify-center"
              >
                <div className="md:h-32 md:w-32 h-24 w-24 rounded-full md:p-5 p-2 border overflow-hidden">
                  <img src={category.imageURL} alt={category.name} />
                </div>
                <h1 className="font-semibold">{category.name}</h1>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
