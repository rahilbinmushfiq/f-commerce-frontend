// import { signInWithPopup } from "firebase/auth";
// import toast from 'react-hot-toast';
// import { FcGoogle } from "react-icons/fc";
// import { auth, googleProvider } from "@/firebase.config";
// import { createSession } from "@/app/actions/auth";
// import createErrorMessage from "@/app/utils/createErrorMessage";

import { useRouter } from "next/navigation";
import { FaFacebookSquare } from "react-icons/fa";
import { LuCheck } from "react-icons/lu";

export default function SignInWithFacebook({ isConnected, buttonText }) {
  const router = useRouter();

  // const handleGoogleSignIn = async () => {
  //   setIsPageLoading(true);

  //   try {
  //     const userCredential = await signInWithPopup(auth, googleProvider);
  //     await createSession(userCredential?.user?.uid);
  //     toast.success("Successfully logged in.", {
  //       position: "bottom-left",
  //       style: {
  //         background: "black",
  //         color: "white",
  //         // margin: "20px",
  //       },
  //     });
  //     router.push("/");
  //   } catch (error) {
  //     toast.error(createErrorMessage(error), {
  //       position: "bottom-left",
  //       style: {
  //         background: "black",
  //         color: "white",
  //         // margin: "20px",
  //       },
  //     });
  //   }

  //   setIsPageLoading(false);
  // };

  return (
    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 py-3 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-neutral-200">
      <FaFacebookSquare color="#4267B2" size={20} />
      {buttonText + `${!isConnected ? " with Facebook" : ""}`}
      {isConnected && <LuCheck className="size-5 text-green-600" />}
    </button>
  );
}
