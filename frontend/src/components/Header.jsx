import React, { useState } from "react";
import { Link } from "react-router-dom";
import carousel1 from "./images/carousel/carousel1.png";
import carousel2 from "./images/carousel/carousel2.jpg";
import carousel3 from "./images/carousel/carousel3.jpg";

export const Header = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { src: carousel3, link: "/books/tag/Harry%20Potter" },
    { src: carousel2, link: "/books/tag/Kids%20Books" },
    { src: carousel1, link: "/books/tag/Programming" },
  ];

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative w-full px-4 md:px-8 mt-12">
      <div className="relative w-full" id="default-carousel" data-carousel="slide">
        <div className="absolute z-30 flex -translate-x-1/2 top-[92%] left-1/2 space-x-3 rtl:space-x-reverse">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex ? "bg-gray-800" : "bg-gray-300"
              }`}
              aria-current={index === currentImageIndex}
              aria-label={`Slide ${index + 1}`}
              data-carousel-slide-to={index}
              onClick={() => handleImageChange(index)}
            ></button>
          ))}
        </div>

        {/* Carousel Images */}
        <div className="relative overflow-hidden -mt-5 mb-10 rounded-lg h-[calc(65vh-74px)]">
          {images.map((image, index) => (
            <Link
              key={index}
              to={image.link}
              className={`absolute inset-0 transition-opacity ${
                index === currentImageIndex ? "opacity-100 z-20" : "opacity-0 z-10"
              }`}
              data-carousel-item
            >
              <img
                src={image.src}
                className="w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
            </Link>
          ))}
        </div>

        {/* Previous and Next Buttons */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
          onClick={() =>
            handleImageChange((currentImageIndex - 1 + images.length) % images.length)
          }
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
          onClick={() =>
            handleImageChange((currentImageIndex + 1) % images.length)
          }
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
};