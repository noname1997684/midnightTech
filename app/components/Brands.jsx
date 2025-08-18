"use client";

import Link from "next/link";
import Slider from "react-slick";

export default function Brands({ brands }) {
  // var settings = {
  //   dots: true,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 7,
  //   slidesToScroll: 7,
  //   initialSlide: 0,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 5,
  //         slidesToScroll: 5,
  //         infinite: true,
  //         dots: true
  //       }
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //         initialSlide: 3
  //       }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 2
  //       }
  //     }
  //   ]
  // };
  // if (brands.length === 0) {
  //   return <></>
  // }
  return (
    <section className="flex-col justify-center items-center w-full">
      <h1 className="text-center text-2xl font-bold">Brands</h1>
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 p-5 justify-items-center">
        {/* <Slider {...settings}> */}
        {(brands.length <= 2 ? [...brands, ...brands, ...brands] : brands).map(
          (brand) => (
            <div className="px-2" key={brand.id}>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Link
                  href={`/brands/${brand.id}`}
                  className="h-20 rounded-lg md:p-5 p-2 border overflow-hidden "
                >
                  <img
                    className="h-full w-full "
                    src={brand.imageURL}
                    alt={brand.name}
                  />
                </Link>
              </div>
            </div>
          )
        )}
        {/* </Slider> */}
      </div>
    </section>
  );
}
