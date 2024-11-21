import TransitionLink from "@/app/components/ui/TransitionLink";
import Image from "next/image";
import { PiBag, PiPhone } from "react-icons/pi";
import logoImage from "/public/logos/logo.png";

export default function AuthHeader() {
  return (
    <header className="mb-10 flex w-full items-center justify-between py-2">
      {/* Logo */}
      <TransitionLink href="/">
        <Image
          className="h-10 w-auto sm:max-lg:h-8"
          src={logoImage}
          alt="F-commerce logo"
        />
      </TransitionLink>
      <nav>
        <ul className="flex items-center gap-x-5 text-xs text-neutral-600 sm:text-[13px] sm:max-lg:gap-x-3">
          <li className="transition-color duration-300 ease-in-out hover:text-black">
            <TransitionLink
              className="flex items-center gap-x-1.5 sm:max-lg:gap-x-1"
              href="/shop"
            >
              <PiBag className="-mb-0.5 text-base" />
              Shop
            </TransitionLink>
          </li>
          <li className="transition-color duration-300 ease-in-out hover:text-black">
            <TransitionLink
              className="flex items-center gap-x-1.5 sm:max-lg:gap-x-1"
              href="/contact-us"
            >
              <PiPhone className="-mb-[1px] -mr-0.5 text-[15px]" />
              Contact
            </TransitionLink>
          </li>
          {/* <li className="transition-color duration-300 ease-in-out hover:text-black">
                  <TransitionLink href="/shop">SHOP</TransitionLink>
                </li>
                <li className="transition-color duration-300 ease-in-out hover:text-black">
                  <TransitionLink href="/contact-us">CONTACT</TransitionLink>
                </li> */}
        </ul>
      </nav>
    </header>
  );
}
