"use client";

import { Button } from "@heroui/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
export default function Collections({ collections }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  if (collections.length === 0) {
    return <></>;
  }
  return (
    <div className="w-screen overflow-hidden p-5 md:p-10">
      <Slider {...settings}>
        {(collections.length <= 2
          ? [...collections, ...collections, ...collections]
          : collections
        ).map((collection) => (
          <div className="px-2" key={collection.id}>
            <div
              className="flex gap-4  p-7 w-full rounded-xl h-full min-h-[190px] relative"
              style={{
                backgroundImage: `url(${collection.imageURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-xl z-[1]" />
              <div className="w-full flex flex-col gap-6 z-[2] items-center justify-center">
                <div className="flex flex-col gap-3 items-center ">
                  <h1 className="md:text-2xl text-lg  font-semibold text-white">
                    {collection.title}
                    <div className="w-full h-[2px] rounded-full mt-1 bg-white"></div>
                  </h1>
                  <h1 className="text-gray-200 md:text-base text-sm  ">
                    {collection.subTitle}
                  </h1>
                </div>
                <div className="gap-4 flex">
                  <Link href={`/collections/${collection.id}`}>
                    <Button
                      color="secondary"
                      className="flex items-center justify-center gap-1"
                    >
                      <h1 className="text-white md:text-base text-sm">
                        View Collection
                      </h1>
                      <KeyboardArrowRightIcon className="text-white" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
