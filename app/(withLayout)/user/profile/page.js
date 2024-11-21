"use client";

import DeliveryAddresses from "@/app/components/user/profile/DeliveryAddresses";
import PersonalInfo from "@/app/components/user/profile/PersonalInfo";
import { useAuth } from "@/app/contexts/auth";
import { useState } from "react";
import { parseDate } from "@internationalized/date";

export default function Profile() {
  const { user } = useAuth();
  const [additionalUserInfo, setAdditionalUserInfo] = useState({
    phoneNumber: "",
    altPhoneNumber: "",
    // hometown: "Bogura",
    // dob: parseDate("1998-05-18"),
    deliveryAddresses: [
      {
        id: "916247bc2ca49",
        nickname: "Home",
        addressLineOne: "House 32, Road 11, Sector 5",
        addressLineTwo: "Uttara, Dhaka",
        city: "Dhaka",
        postalCode: 1230,
      },
    ],
  });

  return (
    <div className="user-info bottom-5 top-5 min-h-full grow space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-3.5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl lg:sticky lg:p-5 [&_input]:text-sm [&_label]:text-sm [&_label]:text-neutral-500">
      <PersonalInfo
        user={user}
        additionalUserInfo={additionalUserInfo}
        setAdditionalUserInfo={setAdditionalUserInfo}
      />
      <DeliveryAddresses
        setAdditionalUserInfo={setAdditionalUserInfo}
        deliveryAddresses={additionalUserInfo?.deliveryAddresses}
      />
    </div>
  );
}
