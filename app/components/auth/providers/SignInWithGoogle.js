import { linkWithPopup, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "@/firebase.config";
import createErrorMessage from "@/app/utils/createErrorMessage";
import { LuCheck } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";

export default function SignInWithGoogle({ isConnected, buttonText }) {
  const router = useRouter();
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const pathname = usePathname();
  const isFromAuthPage =
    pathname.includes("login") || pathname.includes("register");
  const toastOptions = isFromAuthPage // Login/register page
    ? {
        position: "bottom-left",
        style: {
          background: "black",
          color: "white",
        },
      }
    : {};

  const handleGoogleSignIn = async () => {
    setIsPageLoading(true);

    try {
      if (!user) {
        // Sign in, if user is not logged in
        await signInWithPopup(auth, googleProvider);
        toast.success("Successfully logged in.", toastOptions);
      } else {
        // Link to Google, if logged in with password provider
        console.log("linkWithPopup user", user);
        await linkWithPopup(user, googleProvider);
        toast.success("Successfully connected.", toastOptions);
      }

      if (isFromAuthPage) router.push("/"); // Redirect to homepage from login/register page
    } catch (error) {
      console.log("linkWithPopup error", error);
      toast.error(createErrorMessage(error), toastOptions);
    }

    setIsPageLoading(false);
  };

  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 py-3 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-neutral-200"
      onClick={() =>
        isConnected
          ? toast.success("Already connected to Google account.")
          : handleGoogleSignIn()
      }
    >
      <FcGoogle size={20} />
      {/* {isConnected ? buttonText : "Connect with Google"} */}
      {buttonText + `${!isConnected ? " with Google" : ""}`}
      {isConnected && <LuCheck className="size-5 text-green-600" />}
    </button>
  );
}
