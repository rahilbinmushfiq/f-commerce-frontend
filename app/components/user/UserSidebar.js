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
    <section className="user-sidebar sticky top-5 max-h-[calc(100dvh-24px)] rounded-xl border-2 border-neutral-50/20 bg-white/60 px-2 py-4 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl lg:max-h-[calc(100dvh-112px-24px)] lg:min-w-[300px] lg:p-5">
      <div className="mb-7 flex w-full items-center gap-x-4">
        <div
          className="relative size-10 rounded-full border lg:size-14"
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
        <div className="max-lg:hidden">
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
      {/* <div> */}
      {/* <hr className="my-4 h-0.5 w-full bg-neutral-100" /> */}
      {/* <h5 className="mb-1.5 mt-7 text-[10px] font-semibold text-neutral-400">
          ORDER
        </h5> */}
      {/* <ul className="space-y-2 text-xs [&_svg]:size-[15px] lg:[&_svg]:size-[13px] md:text-[13px]">
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
              Order History
            </TransitionLink>
          </li>
          <li>
            <TransitionLink
              href="/user/order-tracking"
              className={
                pathname.includes("order-tracking")
                  ? "bg-green-100 font-semibold text-green-600"
                  : ""
              }
            >
              <LuTruck />
              Order Tracking
            </TransitionLink>
          </li>
        </ul> */}
      {/* </div> */}
      <div>
        {/* <hr className="my-4 h-0.5 w-full bg-neutral-100" /> */}
        {/* <h5 className="mb-1.5 mt-4 text-[10px] font-semibold text-neutral-400">
          ACCOUNT
        </h5> */}
        <ul className="space-y-2 [&_p]:text-xs max-lg:[&_p]:hidden md:[&_p]:text-[13px] [&_svg]:size-5 max-lg:[&_svg]:mx-auto lg:[&_svg]:size-[13px]">
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
      </div>
    </section>
  );
}
