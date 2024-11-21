import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";
import { usePathname, useSearchParams } from "next/navigation";
import { HiOutlineShoppingBag, HiOutlineHeart } from "react-icons/hi2";
import {
  PiBagSimple,
  PiGift,
  PiHouseLine,
  PiLightning,
  PiPackage,
  PiSignIn,
  PiSignOut,
  PiTruck,
  PiUser,
  PiUserCirclePlus,
} from "react-icons/pi";
import newArrivals from "/public/logos/new-arrivals_8294825.svg";
import {
  FaEnvelope,
  FaInstagram,
  FaLinkedin,
  FaSquareFacebook,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import logoImage from "/public/logos/logo.png";
import { useAuth } from "@/app/contexts/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import { removeSession } from "@/app/actions/auth";
import toast from "react-hot-toast";
import createErrorMessage from "@/app/utils/createErrorMessage";
import { useLoading } from "@/app/contexts/loading";
import { IoBagOutline } from "react-icons/io5";
import { useEffect } from "react";
import { LuFacebook } from "react-icons/lu";
import { TbBrandTiktok } from "react-icons/tb";

export default function NavMenu({ isNavMenuOpen, setIsNavMenuOpen }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();

  useEffect(() => {
    document.body.style.overflow = isNavMenuOpen ? "hidden" : "unset";
  }, [isNavMenuOpen]);

  const handleSignOut = async () => {
    setIsPageLoading(true);

    try {
      await signOut(auth);
      await removeSession();
      if (pathname.includes("user")) router.push("/login");
      toast.success("Successfully logged out.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  return (
    <div
      className={`fixed inset-0 h-dvh w-dvw overflow-y-auto overflow-x-hidden text-sm transition-[background-color] duration-500 ease-in-out md:text-base [&::-webkit-scrollbar]:[-webkit-appearance:scrollbarthumb-vertical] ${isNavMenuOpen ? "pointer-events-auto bg-neutral-700/60 delay-0" : "pointer-events-none bg-neutral-700/0 delay-100"}`}
      id="nav-menu-bg"
      onClick={
        (event) => event.target.id === "nav-menu-bg" && setIsNavMenuOpen(false) // If user clicks outside nav menu, close it
      }
    >
      {/* Mobile navigation menu */}
      <nav
        className={`mobile ml-auto flex min-h-full w-2/3 flex-col justify-between rounded-l-lg bg-neutral-50 p-5 pt-7 text-neutral-600 transition-[transform] delay-200 duration-300 ease-in-out min-[480px]:w-1/2 sm:w-2/5 sm:px-6 sm:pt-8 ${isNavMenuOpen ? "translate-x-0 delay-200" : "translate-x-full delay-0"}`}
      >
        {/* Top section - logo and nav links */}
        <div className="space-y-7">
          {/* Logo */}
          <TransitionLink
            className="inline-block"
            href="/"
            hasModal={true}
            setIsModalOpen={setIsNavMenuOpen}
          >
            <Image
              className="h-8 w-auto"
              src={logoImage}
              alt="YouthLink logo with white text"
            />
          </TransitionLink>
          {/* Navigation links */}
          {/* <ul className="space-y-2 md:space-y-3">
            <li>
              <TransitionLink
                className={pathname === "/" ? "active" : ""}
                href="/"
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
              >
                <FaHome />
                Home
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                className={
                  pathname.includes("?filterBy=Popular") ? "active" : ""
                }
                href={{
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
                  pathname: "/shop",
                  query: {
                    filterBy: "Popular",
                  },
                }}
              >
                <FaRegStar />
                Popular
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                className={
                  pathname.includes("?filterBy=New+Arrivals") ? "active" : ""
                }
                href={{
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
                  pathname: "/shop",
                  query: {
                    filterBy: "New Arrivals",
                  },
                }}
              >
                <Image
                  className="h-6 w-auto"
                  src={newArrivals}
                  alt="YouthLink logo with white text"
                />
                New Arrivals
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                className={pathname.startsWith("/shop") ? "active" : undefined}
                href="/shop"
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
              >
                <HiOutlineShoppingBag />
                Shop
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                className={
                  pathname.startsWith("/wishlist") ? "active" : undefined
                }
                href="/wishlist"
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
              >
                <HiOutlineHeart />
                Wishlist
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                className={pathname.startsWith("/cart") ? "active" : undefined}
                href="/cart"
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
              >
                <PiShoppingCartLight />
                Cart
              </TransitionLink>
            </li>
          </ul> */}
          <div>
            {/* <hr className="my-4 h-0.5 w-full bg-neutral-100" /> */}
            <h5 className="text-[10px] font-semibold text-neutral-500">MENU</h5>
            <hr className="my-2 h-0.5 w-full bg-neutral-100" />
            <ul className="space-y-1 text-xs md:text-[13px]">
              <li>
                <TransitionLink
                  href="/"
                  hasModal={true}
                  setIsModalOpen={setIsNavMenuOpen}
                  className={pathname === "/" ? "active" : ""}
                >
                  <PiHouseLine />
                  Home
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/shop"
                  hasModal={true}
                  setIsModalOpen={setIsNavMenuOpen}
                  className={
                    pathname.startsWith("/shop") &&
                    !searchParams.get("filterBy")
                      ? "active"
                      : undefined
                  }
                >
                  <PiBagSimple />
                  Shop
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/shop?filterBy=Popular"
                  hasModal={true}
                  setIsModalOpen={setIsNavMenuOpen}
                  className={
                    searchParams.get("filterBy") === "Popular" ? "active" : ""
                  }
                >
                  <PiLightning />
                  Popular
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  className={
                    searchParams.get("filterBy") === "New Arrivals"
                      ? "active"
                      : ""
                  }
                  href="/shop?filterBy=New+Arrivals"
                  hasModal={true}
                  setIsModalOpen={setIsNavMenuOpen}
                >
                  <PiGift />
                  New Arrivals
                </TransitionLink>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold text-neutral-500">
              ORDER
            </h5>
            <hr className="my-2 h-0.5 w-full bg-neutral-100" />
            <ul className="space-y-2 text-xs md:text-[13px]">
              <li>
                <TransitionLink
                  href="/order-tracking"
                  hasModal={true}
                  setIsModalOpen={setIsNavMenuOpen}
                  className={
                    pathname.includes("order-tracking") ? "active" : ""
                  }
                >
                  <PiTruck />
                  Order Tracking
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/user/orders"
                  hasModal={true}
                  setIsModalOpen={setIsNavMenuOpen}
                  className={pathname.includes("orders") ? "active" : ""}
                >
                  <PiPackage />
                  Order History
                </TransitionLink>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold text-neutral-500">
              ACCOUNT
            </h5>
            <hr className="my-2 h-0.5 w-full bg-neutral-100" />
            {!user ? (
              <ul className="space-y-2 text-xs md:text-[13px]">
                <li>
                  <TransitionLink
                    href="/login"
                    hasModal={true}
                    setIsModalOpen={setIsNavMenuOpen}
                    className={pathname.includes("login") ? "active" : ""}
                  >
                    <PiSignIn />
                    Sign In
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink
                    href="/register"
                    hasModal={true}
                    setIsModalOpen={setIsNavMenuOpen}
                    className={pathname.includes("register") ? "active" : ""}
                  >
                    <PiUserCirclePlus />
                    Sign Up
                  </TransitionLink>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-xs md:text-[13px]">
                <li>
                  <TransitionLink
                    href="/user/profile"
                    hasModal={true}
                    setIsModalOpen={setIsNavMenuOpen}
                    className={pathname.includes("profile") ? "active" : ""}
                  >
                    <PiUser />
                    User Profile
                  </TransitionLink>
                </li>
                <li onClick={handleSignOut}>
                  <PiSignOut />
                  Sign Out
                </li>
              </ul>
            )}
          </div>
        </div>
        {/* Bottom section - social links */}
        {/* <div className="space-y-3">
          <h3 className="text-base font-semibold">Get in Touch</h3>
          <ul className="social-links flex gap-x-1.5">
            <li>
              <TransitionLink
                href="https://www.facebook.com/fashion-commerce/"
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
                target="_blank"
              >
                <LuFacebook />
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                href="https://www.instagram.com/fashion-commerce/"
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
                target="_blank"
              >
                <FaInstagram />
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                href="https://www.twitter.com/fashion-commerce/"
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
                target="_blank"
              >
                <FaXTwitter />
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                href="https://www.tiktok.com/fashion-commerce/"
                hasModal={true}
                      setIsModalOpen={setIsNavMenuOpen}
                target="_blank"
              >
                <TbBrandTiktok />
              </TransitionLink>
            </li>
          </ul>
        </div> */}
      </nav>
    </div>
  );
}
