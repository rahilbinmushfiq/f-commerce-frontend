"use client";

import Image from "next/image";
import loginImage1 from "@/public/auth/test-1.jpeg";
import loginImage2 from "@/public/auth/test-2.jpg";
import loginImage3 from "@/public/auth/test-3.jpg";
import loginImage4 from "@/public/auth/test-4.jpg";
import { useEffect, useRef, useState } from "react";
import { backendImgUrls } from "@/app/data/backendImgUrls";

// const images = [loginImage1, loginImage2, loginImage3, loginImage4];

export default function SideImageSection() {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const intervalRef = useRef(null);

  const startSlideInterval = () => {
    intervalRef.current = setInterval(() => {
      setActiveSlideIdx((prevIdx) =>
        prevIdx === backendImgUrls.authCarousel.length - 1 ? 0 : prevIdx + 1,
      );
    }, 2000);
  };

  useEffect(() => {
    startSlideInterval();

    const navButtons = document.querySelectorAll("button");

    const handleNavButtonClick = () => {
      clearInterval(intervalRef.current);
      startSlideInterval();
    };

    navButtons.forEach((navButton) => {
      navButton.addEventListener("click", handleNavButtonClick);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (navButtons)
        navButtons.forEach((navButton) => {
          navButton.removeEventListener("click", handleNavButtonClick);
        });
    };
  }, []);

  return (
    <section className="relative hidden grow overflow-hidden rounded-xl sm:flex xl:ml-[2vw]">
      {backendImgUrls.authCarousel.map((image, imageIdx) => {
        return (
          <Image
            key={"Carousel" + image}
            src={image}
            alt={"Test Image " + (imageIdx + 1)}
            width={0}
            height={0}
            sizes="75vw"
            className="pointer-events-none h-full w-full shrink-0 object-cover transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${activeSlideIdx * 100}%)`,
            }}
          />
        );
      })}
      <div className="absolute bottom-0 left-0 right-0 flex h-16 w-full items-center justify-center gap-1.5 bg-gradient-to-b from-transparent via-black/30 to-black/60">
        {backendImgUrls.authCarousel.map((image, imageIdx) => {
          return (
            <button
              key={"Button" + image}
              className={`size-3 cursor-pointer rounded-full transition-[background-color] duration-300 ease-in-out ${activeSlideIdx === imageIdx ? "bg-white" : "bg-neutral-400"}`}
              onClick={() => setActiveSlideIdx(imageIdx)}
            />
          );
        })}
      </div>
    </section>
  );
}
