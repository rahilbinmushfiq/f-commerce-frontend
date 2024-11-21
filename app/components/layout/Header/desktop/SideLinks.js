import { useAuth } from "@/app/contexts/auth";
import TransitionLink from "@/app/components/ui/TransitionLink";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  IoBagOutline,
  IoCartOutline,
  IoHeartOutline,
  IoLogInOutline,
  IoLogOut,
  IoLogOutOutline,
  IoPersonOutline,
} from "react-icons/io5";
import {
  PiTruckLight,
  PiSignInLight,
  PiSignOutLight,
  PiPackageLight,
  PiUserLight,
  PiBellLight,
  PiUserCirclePlusLight,
} from "react-icons/pi";
import { removeSession } from "@/app/actions/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import createErrorMessage from "@/app/utils/createErrorMessage";
import toast from "react-hot-toast";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { updateIsFromCheckout } from "@/app/actions/checkout";
import { useEffect, useState } from "react";
import { useLoading } from "@/app/contexts/loading";

export default function SideLinks({
  cartItems,
  wishlistItems,
  setIsCartModalOpen,
  setIsWishlistModalOpen,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  // const [isFromAuth, setIsFromAuth] = useState(false);

  // useEffect(() => {
  //   console.log("isFromCheckout USEEFFECT", isFromAuth);
  //   if (isFromAuth) {
  //     const updateCheckout = async () => {
  //       await updateIsFromCheckout("false");
  //     };

  //     console.log("isFromCheckout INSIDE", isFromAuth);

  //     updateCheckout();
  //   }
  // }, [isFromAuth]);

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

  // const handleNavigation = async (event) => {
  //   event.preventDefault();

  //   const redirectURL = event?.currentTarget?.href;
  //   const isAnyAuthButtonClicked =
  //     redirectURL.includes("login") || redirectURL.includes("register");
  //   const isFromCheckOut = isAnyAuthButtonClicked ? "false" : "true";

  //   if (isAnyAuthButtonClicked) {
  //     await updateIsFromCheckout(isFromCheckOut, redirectURL);
  //   } else router.push(redirectURL);
  // };

  return (
    <div className="text-neutral-600">
      {/* Navigation links */}
      <ul className="flex items-center gap-x-2.5 text-xs md:text-sm xl:gap-x-4">
        {/* Shop Page Link */}
        <li>
          <TransitionLink
            className={`flex items-center gap-1.5 ${pathname.startsWith("/shop") && !searchParams.get("filterBy") ? "text-neutral-900" : "hover:text-neutral-700"}`}
            href="/shop"
          >
            <IoBagOutline className="text-lg" />
            Shop
          </TransitionLink>
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
            <IoHeartOutline size={18} className="text-neutral-500" />
            <span
              className={`absolute right-0 top-0 flex size-3.5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white ${!wishlistItems?.length ? "hidden" : ""}`}
            >
              {!!wishlistItems?.length &&
                wishlistItems.reduce((accumulator, item) => accumulator + 1, 0)}
            </span>
          </div>
          Wishlist
        </li>
        {/* Cart Slider Button */}
        <li
          className="flex cursor-pointer items-center gap-x-1.5"
          onClick={() => {
            window.dispatchEvent(new Event("storageCart"));
            setIsCartModalOpen(true);
          }}
        >
          <div className="relative">
            <IoCartOutline size={18} className="text-neutral-500" />
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
          Cart
        </li>
        {/* <TransitionLink
            href="/login"
            className="flex items-center gap-1.5 hover:text-neutral-700"
          >
            <IoLogInOutline className="text-lg" />
            Login
          </TransitionLink>
          ) : ( */}
        {/* Login/Logout Button */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger className="z-[0]">
            <span className="flex cursor-pointer items-center gap-1.5 hover:text-neutral-700">
              <IoPersonOutline className="text-lg" />
              {!user ? "Account" : user.displayName?.split(" ")[0] || "User"}
            </span>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownSection title="Order" showDivider>
              <DropdownItem
                key="order-tracking"
                startContent={<PiTruckLight />}
                href="/order-tracking"
                onClick={(event) => {
                  event.preventDefault();
                  event.currentTarget.querySelector("a").click();
                }}
              >
                <TransitionLink href="/order-tracking">
                  Order Tracking
                </TransitionLink>
              </DropdownItem>
              {!!user && (
                <DropdownItem
                  key="orders"
                  startContent={<PiPackageLight />}
                  href="/user/orders"
                  onClick={(event) => {
                    event.preventDefault();
                    event.currentTarget.querySelector("a").click();
                  }}
                >
                  <TransitionLink href="/user/orders">
                    Order History
                  </TransitionLink>
                </DropdownItem>
              )}
            </DropdownSection>
            <DropdownSection title="User">
              {!!user && (
                <DropdownItem
                  key="profile"
                  startContent={<PiUserLight />}
                  href="/user/profile"
                  onClick={(event) => {
                    event.preventDefault();
                    event.currentTarget.querySelector("a").click();
                  }}
                >
                  <TransitionLink href="/user/profile">
                    User Profile
                  </TransitionLink>
                </DropdownItem>
              )}
              {/* {!!user && (
                <DropdownItem
                  key="notifications"
                  startContent={<PiBellLight />}
                  href="/user/notifications"
                  onClick={(event) => {
                    event.preventDefault();
                    event.currentTarget.querySelector("a").click()
                    }}
                >
                  <TransitionLink href="/user/notifications">Notifications</TransitionLink>
                </DropdownItem>
              )} */}
              {!user && (
                <DropdownItem
                  key="login"
                  startContent={<PiSignInLight />}
                  href="/login"
                  onClick={(event) => {
                    event.preventDefault();
                    event.currentTarget.querySelector("a").click();
                  }}
                >
                  <TransitionLink href="/login">Sign In</TransitionLink>
                </DropdownItem>
              )}
              {!user && (
                <DropdownItem
                  key="register"
                  startContent={<PiUserCirclePlusLight />}
                  href="/register"
                  onClick={(event) => {
                    event.preventDefault();
                    event.currentTarget.querySelector("a").click();
                  }}
                >
                  <TransitionLink href="/register">Sign Up</TransitionLink>
                </DropdownItem>
              )}
              {!!user && (
                <DropdownItem
                  startContent={<PiSignOutLight />}
                  key="logout"
                  color="danger"
                  onClick={handleSignOut}
                >
                  Sign Out
                </DropdownItem>
              )}
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </ul>
    </div>
  );
}
