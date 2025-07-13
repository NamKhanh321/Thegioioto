"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/image-slider1.webp",
  "/image-slider2.webp",
  "/image-slider3.webp",
  "/image-slider4.webp"
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  function prev() {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }
  function next() {
    setDirection(1);
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]); // Optionally, you can use [] to run only once


  return (
    <div className="relative w-full mx-auto h-[300px] flex justify-center  sm:h-[400px] xl:h-[450px] overflow-hidden">
      <div
        key={current}
        className={`inset-0 transition-all duration-500
          ${direction === 1 ? "animate-slide-in-right" : ""}
          ${direction === -1 ? "animate-slide-in-left" : ""}
        `}
      >
        <Image
          src={images[current]}
          alt={`Slide ${current + 1}`}
          width={900}
          height={450}
          className="rounded object-cover"
          priority
        />
      </div>
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full z-10"
        aria-label="Previous"
      >
        &#8592;
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full z-10"
        aria-label="Next"
      >
        &#8594;
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`block w-2 h-2 rounded-full ${idx === current ? "bg-green-500" : "bg-gray-300"}`}
          />
        ))}
    </div>
    </div>
  );
}