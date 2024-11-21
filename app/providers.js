"use client";

import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./contexts/auth";
import { LoadingProvider } from "./contexts/loading";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
// import { VisitedUrlsProvider } from "./contexts/visitedUrls";

export function Providers({ children }) {
  return (
    <Suspense>
      <NextUIProvider>
        <AuthProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </AuthProvider>
        <Toaster
          toastOptions={{
            duration: 3000,
          }}
        />
      </NextUIProvider>
    </Suspense>
  );
}
