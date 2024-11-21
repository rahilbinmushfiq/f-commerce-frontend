import TransitionLink from "@/app/components/ui/TransitionLink";
import Image from "next/image";
import { useState } from "react";
import logoImage from "/public/logos/logo.png";
import NavMenu from "./NavMenu";
import {
  IoCartOutline,
  IoHeartOutline,
  IoMenuOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { removeSession } from "@/app/actions/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import createErrorMessage from "@/app/utils/createErrorMessage";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/auth";
import Search from "../desktop/Search";

export default function MobileNavbar({
  cartItems,
  wishlistItems,
  setIsCartModalOpen,
  setIsWishlistModalOpen,
  isMobileSearchSelected,
  setIsMobileSearchSelected,
}) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false); // State for tracking nav menu open/close
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await removeSession();
      toast.success("Successfully logged out.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }
  };

  return (
    <nav className="relative h-full w-full text-sm md:text-[15px] lg:hidden">
      <div className="relative flex h-full w-full items-center justify-between bg-white">
        {/* Logo */}
        <TransitionLink href="/">
          <Image
            className="h-9 w-auto"
            src={logoImage}
            alt="YouthLink logo with white text"
          />
        </TransitionLink>
        <ul className="flex gap-x-4">
          <li
            onClick={() => setIsMobileSearchSelected((prevState) => !prevState)}
          >
            <IoSearchOutline className="text-lg text-neutral-600" />
          </li>
          {/* Wishlist Page Link */}
          <li
            className="flex cursor-pointer items-center gap-x-1.5"
            onClick={() => {
              window.dispatchEvent(new Event("storageWishlist"));
              setIsWishlistModalOpen(true);
            }}
          >
            <div className="relative">
              <IoHeartOutline size={18} className="text-neutral-600" />
              <span
                className={`absolute right-0 top-0 flex size-3.5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white ${!wishlistItems?.length ? "hidden" : ""}`}
              >
                {!!wishlistItems?.length &&
                  wishlistItems.reduce(
                    (accumulator, item) => accumulator + 1,
                    0,
                  )}
              </span>
            </div>
          </li>
          {/* Mobile cart button */}
          <li
            className="flex cursor-pointer items-center gap-x-1.5"
            onClick={() => {
              window.dispatchEvent(new Event("storageCart"));
              setIsCartModalOpen(true);
            }}
          >
            <div className="relative">
              <IoCartOutline size={18} className="text-neutral-600" />
              <span
                className={`absolute right-0 top-0 flex size-3.5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white ${!cartItems?.length ? "hidden" : ""}`}
              >
                {!!cartItems?.length &&
                  cartItems.reduce(
                    (accumulator, item) =>
                      Number(item.selectedQuantity) + accumulator,
                    0,
                  )}
              </span>
            </div>
          </li>
          {/* Login/Logout Button */}
          {/* {!user ? (
            <TransitionLink
              href="/login"
              className="flex items-center gap-1.5 hover:text-neutral-700"
            >
              <IoLogInOutline className="text-lg" />
            </TransitionLink>
          ) : (
            <button
              className="flex items-center gap-1.5 hover:text-neutral-700"
              onClick={handleSignOut}
            >
              <IoPersonOutline className="text-lg" />
            </button>
          )} */}
          {/* Navigation button */}
          <li>
            <IoMenuOutline
              className="h-5 w-auto cursor-pointer sm:h-6 lg:hidden"
              onClick={() => setIsNavMenuOpen(true)}
            />
          </li>
        </ul>
      </div>
      <div
        className={`absolute left-0 right-0 top-0 mt-2 transition-[transform,opacity] duration-300 ease-in-out ${isMobileSearchSelected ? "pointer-events-auto translate-y-full opacity-100" : "pointer-events-none translate-y-0 opacity-0"}`}
      >
        <Search
          isMobile={true}
          setIsMobileSearchSelected={setIsMobileSearchSelected}
        />
      </div>
      <NavMenu
        isNavMenuOpen={isNavMenuOpen}
        setIsNavMenuOpen={setIsNavMenuOpen}
      />
    </nav>
  );
}
