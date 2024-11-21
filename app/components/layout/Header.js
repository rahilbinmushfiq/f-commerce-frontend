"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CgArrowUp } from "react-icons/cg";
import Cart from "./Header/subcomponents/Cart";
import { useAuth } from "@/app/contexts/auth";
import Loader from "./Loader";
import DesktopNavbar from "./Header/desktop/DesktopNavbar";
import NavMenu from "./Header/mobile/NavMenu";
import MobileNavbar from "./Header/mobile/MobileNavbar";
import Wishlist from "./Header/subcomponents/Wishlist";
import arrowIcon from "@/public/bg-banner/vector2.png";
import { PiChatText } from "react-icons/pi";
import Image from "next/image";
import { useLoading } from "@/app/contexts/loading";

let isPageFirstTimeLoaded = true;

export default function Header() {
  const pathname = usePathname();
  const { setIsPageLoading } = useLoading();
  const [cartItems, setCartItems] = useState(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(null);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isMobileSearchSelected, setIsMobileSearchSelected] = useState(false);
  const { isUserLoading } = useAuth();

  useEffect(() => {
    const handleOnScroll = () => {
      const scrollToTopButton = document.getElementById("scroll-top");

      if (scrollToTopButton) {
        if (window.scrollY > 200) {
          scrollToTopButton.style.pointerEvents = "auto";
          scrollToTopButton.style.opacity = "1";
        } else {
          scrollToTopButton.style.pointerEvents = "none";
          scrollToTopButton.style.opacity = "0";
        }
      }
    };

    window.addEventListener("scroll", handleOnScroll);

    return () => {
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, []);

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cartItems")));

    const handleStorageUpdate = () => {
      setCartItems(JSON.parse(localStorage.getItem("cartItems")));
      if (!pathname.includes("checkout")) setIsCartModalOpen(true);
    };

    window.addEventListener("storageCart", handleStorageUpdate);

    return () => {
      window.removeEventListener("storageCart", handleStorageUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    setWishlistItems(JSON.parse(localStorage.getItem("wishlistItems")));

    const handleStorageUpdate = () =>
      setWishlistItems(JSON.parse(localStorage.getItem("wishlistItems")));

    window.addEventListener("storageWishlist", handleStorageUpdate);

    return () => {
      window.removeEventListener("storageWishlist", handleStorageUpdate);
    };
  }, []);

  // useEffect(() => {
  //   if (cartItems) {
  //     if (!isPageFirstTimeLoaded && !pathname.includes("checkout"))
  //       setIsCartModalOpen(true);
  //   }

  //   if (isPageFirstTimeLoaded) isPageFirstTimeLoaded = false;
  // }, [cartItems]);

  // if (isUserLoading) return <Loader />;

  useEffect(() => setIsPageLoading(isUserLoading), [isUserLoading]);

  return (
    <>
      <button
        id="scroll-top"
        className="pointer-events-none fixed bottom-3 right-3 z-[1] rounded-md bg-[#fae3d2] p-3 text-neutral-800 opacity-0 transition-[opacity,background-color] hover:bg-neutral-700 hover:text-neutral-50"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <CgArrowUp size={22} />
      </button>
      <button className="fixed right-3 top-1/2 z-[20] -translate-y-1/2 space-y-4 rounded-md bg-[#ced0fb] p-3 text-neutral-700 opacity-60 transition-[background-color,opacity] hover:bg-[#b3b3f1] hover:text-neutral-900 hover:opacity-100 lg:right-5">
        <PiChatText className="size-8 transition-[color] duration-300 ease-in-out" />
      </button>
      <header
        className={`absolute z-10 w-full bg-white px-5 pt-4 text-black shadow-[5px_5px_24px_0_rgba(0,0,0,0.035)] transition-[padding-bottom] duration-300 ease-in-out sm:px-8 sm:pt-5 lg:px-12 lg:py-6 ${isMobileSearchSelected ? "pb-16 sm:pb-20" : "pb-4 sm:pb-5"}`}
      >
        {/* Header wrapper */}
        <div className="mx-auto flex items-center justify-between xl:max-w-[1200px]">
          {/* Logo */}
          {/* <TransitionLink href="/">
            <Image
              className="h-10 w-auto"
              src={logoImage}
              alt="YouthLink logo with white text"
            />
          </TransitionLink> */}
          {/* Search Icon */}
          {/* <div className="group relative flex items-center lg:hidden">
            <svg
              className="icon absolute left-4 h-3 w-3 fill-[#9e9ea7] lg:h-4 lg:w-4"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              placeholder="Search Products"
              type="search"
              className="h-7 w-[150px] rounded-lg border-2 border-transparent bg-[#f3f3f4] pl-[2.5rem] text-xs text-[#0d0c22] outline-none transition duration-300 ease-in-out hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 hover:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] focus:outline-none md:w-full lg:h-10 lg:px-4 lg:text-base"
            />
          </div> */}
          <MobileNavbar
            cartItems={cartItems}
            wishlistItems={wishlistItems}
            setIsCartModalOpen={setIsCartModalOpen}
            setIsWishlistModalOpen={setIsWishlistModalOpen}
            isMobileSearchSelected={isMobileSearchSelected}
            setIsMobileSearchSelected={setIsMobileSearchSelected}
          />
          <DesktopNavbar
            cartItems={cartItems}
            wishlistItems={wishlistItems}
            setIsCartModalOpen={setIsCartModalOpen}
            setIsWishlistModalOpen={setIsWishlistModalOpen}
          />
        </div>
        <Cart
          isCartModalOpen={isCartModalOpen}
          setIsCartModalOpen={setIsCartModalOpen}
          cartItems={cartItems}
        />
        <Wishlist
          isWishlistModalOpen={isWishlistModalOpen}
          setIsWishlistModalOpen={setIsWishlistModalOpen}
          wishlistItems={wishlistItems}
        />
      </header>
    </>
  );
}
