"use client";

import { useState } from "react";
import AuthLayout from "../components/auth/Layout";
import AuthMethodsDivider from "../components/auth/AuthMethodsDivider";
import AuthProviders from "../components/auth/providers/AuthProviders";
import RegisterSection from "@/app/components/auth/RegisterSection";
import Loader from "../components/layout/Loader";
import SignInWithGoogle from "../components/auth/providers/SignInWithGoogle";

export default function Register() {
  return (
    <AuthLayout>
      <RegisterSection>
        <AuthMethodsDivider />
        <SignInWithGoogle isConnected={false} buttonText="Sign up" />
      </RegisterSection>
    </AuthLayout>
  );
}
