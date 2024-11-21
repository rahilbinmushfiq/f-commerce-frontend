"use client";

// import nookies from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import { getIdToken, onIdTokenChanged } from "firebase/auth";
import { auth } from "@/firebase.config";
import { createSession, removeSession } from "../actions/auth";

// Create a new context for authentication
const AuthContext = createContext({
  user: null,
  isUserLoading: false,
  isUserLoadedFirstTime: false,
});

// A Provider component that provides authentication context to its children.
export const AuthProvider = ({ children }) => {
  // State hooks to hold the authenticated user and loading status
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isUserLoadedFirstTime, setIsUserLoadedFirstTime] = useState(false);

  // Listen for changes to the user's authentication state
  // When the token changes, update the states and token cookie accordingly
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        await removeSession();
        setIsUserLoading(false);
      } else {
        const token = await getIdToken(user, true);
        setUser(user);
        await createSession(token);
        setIsUserLoading(false);
      }
      if (!isUserLoadedFirstTime) setIsUserLoadedFirstTime(true);
    });

    return () => unsubscribe();
  }, []);

  // Refresh the user's token every 10 minutes
  // useEffect(() => {
  //   const tokenInterval = setInterval(
  //     async () => {
  //       if (auth.currentUser) await getIdToken(auth.currentUser, true);
  //     },
  //     10 * 60 * 1000,
  //   );

  //   return () => clearInterval(tokenInterval);
  // }, []);

  // Provide the user state and loading state to child components through context
  return (
    <AuthContext.Provider
      value={{ user, isUserLoading, isUserLoadedFirstTime }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
