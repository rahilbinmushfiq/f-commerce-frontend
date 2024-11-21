"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const VisitedUrlsContext = createContext([]);

export const VisitedUrlsProvider = ({ children }) => {
  const pathname = usePathname();
  const [visitedUrls, setVisitedUrls] = useState([]);

  useEffect(() => {
    const prevUrls = JSON.parse(localStorage.getItem("visitedUrls")) || [];
    if (!visitedUrls.length && prevUrls.length) setVisitedUrls(prevUrls);

    if (!prevUrls.includes(pathname)) {
      const updatedUrls = [pathname, ...prevUrls].slice(0, 5);
      localStorage.setItem("visitedUrls", JSON.stringify(updatedUrls));
      setVisitedUrls(updatedUrls);
    }
  }, [pathname]);

  return (
    <VisitedUrlsContext.Provider value={visitedUrls}>
      {children}
    </VisitedUrlsContext.Provider>
  );
};

export const useVisitedUrls = () => {
  return useContext(VisitedUrlsContext);
};
