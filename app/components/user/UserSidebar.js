"use client";

import TransitionLink from "@/app/components/ui/TransitionLink";
import { usePathname } from "next/navigation";
import {
  RiUser3Line,
  RiRefund2Line,
  RiBox3Line,
  RiLockLine,
  RiNotification3Line,
  RiImageAddLine,
} from "react-icons/ri";
import { useAuth } from "@/app/contexts/auth";
import Image from "next/image";
import avatarImage from "/public/auth/user.webp";
import toast from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import { FaStar } from "react-icons/fa6";
import getUserStatusInfo from "@/app/utils/getUserStatusInfo";
import { FiTruck } from "react-icons/fi";
import { LuTruck } from "react-icons/lu";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

export default function UserSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const addtionalUserInfo = {
    score: 500,
    altPhoneNumber: null,
    deliveryAddresses: [
      {
        id: "916247bc2ca49",
        nickName: "Home",
        addressLineOne: "House 14, Road 3, Sector 5",
        addressLineTwo: "Uttara, Dhaka",
        city: "Dhaka",
        postalCode: 1230,
      },
      {
        id: "b219c96c42a47",
        nickName: "Office",
        addressLineOne: "Block B, Road 3",
        addressLineTwo: "Niketon, Dhaka",
        city: "Dhaka",
        postalCode: 1482,
      },
    ],
  };

  const userStatus = getUserStatusInfo(addtionalUserInfo.score);

  return (
    <section className="user-sidebar sticky top-5 z-[1] max-h-[calc(100dvh-24px)] gap-3.5 rounded-xl border-2 border-neutral-50/20 bg-white/60 p-3.5 py-4 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] backdrop-blur-2xl max-sm:flex sm:max-h-[calc(100dvh-100px-16px)] sm:min-w-[275px] sm:p-5 sm:shadow-[0_0_20px_0_rgba(0,0,0,0.05)] lg:max-h-[calc(100dvh-112px-24px)] lg:min-w-[300px]">
      <Popover className="sm:hidden" placement="bottom-start" offset={12}>
        <PopoverTrigger className="sm:hidden">
          <div
            className="relative size-12 rounded-full border"
            style={{
              borderColor: userStatus.imgColor,
              backgroundColor: userStatus.imgColor,
            }}
          >
            <Image
              src={avatarImage}
              alt="User avatar"
              className="size-full rounded-full mix-blend-hard-light"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="items-start p-3.5 sm:hidden">
          {/* <div className="flex w-full items-center gap-x-1.5 max-sm:w-fit sm:mb-7 sm:gap-x-4"> */}
          {/* <div
              className="relative size-12 rounded-full border sm:size-14"
              style={{
                borderColor: userStatus.imgColor,
                backgroundColor: userStatus.imgColor,
              }}
            >
              <Image
                src={avatarImage}
                alt="User avatar"
                className="size-full rounded-full mix-blend-hard-light"
              />
            </div> */}
          <p
            className="w-fit rounded-[4px] border p-1 text-xs font-bold"
            style={{
              borderColor: userStatus.borderColor,
              color: userStatus.textColor,
              backgroundColor: userStatus.backgroundColor,
            }}
          >
            {userStatus.title}
          </p>
          <h5 className="mt-1 text-sm font-semibold text-neutral-600">
            {user?.displayName}
          </h5>
          <p className="text-xs font-semibold text-neutral-500">
            {user?.email}
          </p>
          {/* </div> */}
        </PopoverContent>
      </Popover>
      <div className="mb-7 flex w-full items-center gap-x-4 max-sm:hidden">
        <div
          className="relative size-14 rounded-full border"
          style={{
            borderColor: userStatus.imgColor,
            backgroundColor: userStatus.imgColor,
          }}
        >
          <Image
            src={avatarImage}
            alt="User avatar"
            className="size-full rounded-full mix-blend-hard-light"
          />
          {/* <p className="absolute bottom-0 right-0 translate-y-1/2 rounded-[4px] border border-[#f4edd8] bg-[#fff9e4] p-[5px] text-[10px]/[10px] font-bold text-[#b29536]">
            Gold
          </p> */}
          {/* <FaStar className="absolute bottom-0 left-1/2 size-3 -translate-x-1/2 translate-y-1/2 text-[#d4af37]" />
          <FaStar className="absolute bottom-[6.25%] left-[72%] size-3 -translate-x-1/2 translate-y-1/2 text-[#d4af37]" />
          <FaStar className="absolute bottom-[6.25%] right-[72%] size-3 translate-x-1/2 translate-y-1/2 text-[#d4af37]" />
          <FaStar className="absolute bottom-[20%] left-[90%] size-3 -translate-x-1/2 translate-y-1/2 text-[#d4af37]" />
          <FaStar className="absolute bottom-[20%] right-[90%] size-3 translate-x-1/2 translate-y-1/2 text-[#d4af37]" /> */}
        </div>
        <div>
          {/* <h5 className="text-[11px] font-semibold text-neutral-600">
            {user?.displayName.split(" ")[0]}
          </h5> */}
          <h5 className="text-sm font-semibold text-neutral-600">
            {user?.displayName}
          </h5>
          <p className="-mt-1 text-[11px] font-semibold text-neutral-500">
            {user?.email}
          </p>
          {/* <p className="text-[10px] text-neutral-500">
            {additionalUserInfo?.addressLineTwo}
          </p> */}
          {/* <p className="w-fit rounded-[4px] border border-[#efefef] bg-[#f4f4f4] p-[5px] text-[10px]/[10px] font-bold text-[#6e6e6e]">
            Gold
          </p> */}
          <p
            className="w-fit rounded-[4px] border p-[5px] text-[10px]/[10px] font-bold"
            style={{
              borderColor: userStatus.borderColor,
              color: userStatus.textColor,
              backgroundColor: userStatus.backgroundColor,
            }}
          >
            {userStatus.title}
          </p>
        </div>
      </div>
      <div className="min-h-full border-l-2 border-neutral-300 sm:hidden" />
      <ul className="flex grow items-center gap-1 sm:block sm:space-y-2 [&_p]:text-xs max-sm:[&_p]:hidden md:[&_p]:text-[13px] [&_svg]:size-5 max-sm:[&_svg]:mx-auto sm:[&_svg]:size-4">
        <li>
          <TransitionLink
            href="/user/orders"
            className={
              pathname.includes("orders")
                ? "bg-green-100 font-semibold text-green-600"
                : ""
            }
          >
            <RiBox3Line />
            <p>Order History</p>
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            href="/user/profile"
            className={
              pathname.includes("profile")
                ? "bg-green-100 font-semibold text-green-600"
                : ""
            }
          >
            <RiUser3Line />
            <p>Profile</p>
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            href="/user/security"
            className={
              pathname.includes("security")
                ? "bg-green-100 font-semibold text-green-600"
                : ""
            }
          >
            <RiLockLine />
            <p>Security</p>
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            href="/user/notifications"
            className={
              pathname.includes("notifications")
                ? "bg-green-100 font-semibold text-green-600"
                : ""
            }
          >
            <RiNotification3Line />
            <p>Notifications</p>
          </TransitionLink>
        </li>
      </ul>
    </section>
  );
}
