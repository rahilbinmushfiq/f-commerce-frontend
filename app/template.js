"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useLoading } from "./contexts/loading";
import Loader from "./components/layout/Loader";

export default function Template({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsPageLoading } = useLoading();

  useEffect(() => {
    setIsPageLoading(false);

    return () => setIsPageLoading(true);
  }, [pathname, searchParams]);

  return (
    <>
      <Loader />
      {children}
    </>
  );
}
