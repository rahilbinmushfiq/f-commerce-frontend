import TransitionLink from "@/app/components/ui/TransitionLink";
import Image from "next/image";
import MainLinks from "./MainLinks";
import SideLinks from "./SideLinks";
import logoImage from "/public/logos/logo.png";
import Search from "./Search";

export default function DesktopNavbar({
  cartItems,
  wishlistItems,
  setIsCartModalOpen,
  setIsWishlistModalOpen,
}) {
  return (
    <nav className="flex w-full items-center justify-between text-sm max-lg:hidden md:text-[15px]">
      {/* Logo */}
      <TransitionLink href="/">
        <Image
          className="h-10 w-auto"
          src={logoImage}
          alt="YouthLink logo with white text"
        />
      </TransitionLink>
      <MainLinks />
      <Search />
      <SideLinks
        cartItems={cartItems}
        wishlistItems={wishlistItems}
        setIsCartModalOpen={setIsCartModalOpen}
        setIsWishlistModalOpen={setIsWishlistModalOpen}
      />
    </nav>
  );
}
