"use client";

import { useEffect, useState } from "react";
import AuthLayout from "../components/auth/Layout";
import { useAuth } from "../contexts/auth";
import AuthMethodsDivider from "../components/auth/AuthMethodsDivider";
import LoginSection from "../components/auth/LoginSection";
import AuthProviders from "../components/auth/providers/AuthProviders";
import VerificationSection from "../components/auth/VerificationSection";
import Loader from "../components/layout/Loader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVisitedUrls } from "../contexts/visitedUrls";
import SignInWithGoogle from "../components/auth/providers/SignInWithGoogle";
import { useLoading } from "../contexts/loading";

export default function Login() {
  // const router = useRouter();
  // const visitedUrls = useVisitedUrls();
  const { setIsPageLoading } = useLoading();
  const { user, isUserLoadedFirstTime } = useAuth();

  // console.log(
  //   "isCheckoutPageLastVisited:",
  //   localStorage.getItem("isCheckoutPageLastVisited"),
  // );

  // useEffect(() => {
  //   if (user?.emailVerified) router.push("/");
  // }, [user]);

  // useEffect(() => {
  //   let interval = setInterval(async () => {
  //     if (user?.emailVerified) {
  //       clearInterval(interval);
  //       toast.success("Email verification successful.", {
  //         duration: 4000,
  //         position: "bottom-left",
  //         style: {
  //           background: "black",
  //           color: "white",
  //           // margin: "20px",
  //         },
  //       });
  //       router.push("/");
  //     }
  //     if (!user?.emailVerified) await user?.reload();
  //   }, 2000);

  //   return () => {
  //     if (user && interval) clearInterval(interval);
  //   };
  // }, [user, router]);

  // if (!isUserLoadedFirstTime) return <Loader />;

  useEffect(
    () => setIsPageLoading(!isUserLoadedFirstTime),
    [isUserLoadedFirstTime],
  );

  return (
    <AuthLayout>
      <LoginSection>
        <AuthMethodsDivider />
        <SignInWithGoogle isConnected={false} buttonText="Sign in" />
      </LoginSection>
    </AuthLayout>
  );
}
