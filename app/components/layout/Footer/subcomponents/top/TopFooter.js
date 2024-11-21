"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
// import footerBannerImg from "@/public/marketing/sample-footer-banner-old.webp";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useLoading } from "@/app/contexts/loading";
import { useAuth } from "@/app/contexts/auth";
import { useEffect, useState } from "react";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function TopFooter() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      newsletterEmail: user?.email || "",
    },
    mode: "onSubmit",
  });
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [subscribedNewsletterEmails, setSubscribedNewsletterEmails] = useState([
    // "rahilbinmushfiq@gmail.com",
    "r.mushfiq@youthlink.tech",
    "t.rahman@youthlink.tech",
  ]);
  const footerImage = {
    url: "/marketing/sample-footer-banner-old.webp",
    position: "center",
  };

  useEffect(() => {
    if (user) setValue("newsletterEmail", user.email);
  }, [user]);

  const onSubmit = async (data) => {
    setIsPageLoading(true);
    try {
      console.log("rhf newsletter", data);
      setSubscribedNewsletterEmails((prevEmails) => [
        ...prevEmails,
        data.newsletterEmail,
      ]);
      setHasSubscribed(true);
      toast.success("Subscribed to newsletter successfully.");
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
    setIsPageLoading(false);
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required")) toast.error("Email is required.");
    else if (errorTypes.includes("pattern")) toast.error("Email is not valid.");
    else toast.error("Something went wrong. Please try again.");
  };

  if (!pathname.includes("checkout"))
    return (
      <div className="bg-[#ebfeeb]">
        {/* bg-[#f7fdf7] */}
        {/* <div className="flex xl:max-w-[1200px] items-center justify-evenly gap-5 overflow-hidden px-5 py-[72px] sm:px-8 lg:px-12 xl:mx-auto xl:px-0"> */}
        <div
          className={`flex items-center justify-evenly overflow-hidden px-5 py-14 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${footerImage.position !== "center" ? "gap-5 py-[72px]" : "flex-col gap-12 py-14"}`}
        >
          <TransitionLink
            className={`relative block h-40 w-full ${footerImage.position === "right" ? "order-last" : ""}`}
            href="/shop?filterBy=On+Sale"
          >
            <Image
              src={footerImage.url}
              className="object-contain"
              alt="Marketing Banner"
              height={0}
              width={0}
              sizes="100vh"
              fill
            />
          </TransitionLink>
          {!hasSubscribed &&
          (!user ||
            !subscribedNewsletterEmails.some(
              (subscribedEmail) => user.email === subscribedEmail,
            )) ? (
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, onError)}
              className="w-full max-w-md"
            >
              <p className="mb-4 text-center text-xs text-neutral-700 md:text-sm">
                Subscribe to our newsletter to get more offers daily!
              </p>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  className="h-10 w-full rounded-lg border-2 border-neutral-200/50 bg-white/90 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-500 focus:border-white/50 md:text-sm"
                  placeholder="Enter your email address"
                  readOnly={!!user}
                  {...register("newsletterEmail", {
                    required: true,
                    pattern:
                      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/,
                  })}
                />
                <button className="block w-fit self-end text-nowrap rounded-lg bg-[#bdf6b4] px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 transition-[background-color] duration-300 hover:bg-[#ade7a4]">
                  Subscribe
                </button>
              </div>
            </form>
          ) : (
            <p
              className={`w-full text-center text-xs text-neutral-700 md:text-sm ${footerImage.position === "center" ? "max-w-lg" : "max-w-sm"}`}
            >
              Thank you for subscribing to our newsletter! You&apos;ll get more
              offers like this daily!
            </p>
          )}
        </div>
      </div>
    );
}
