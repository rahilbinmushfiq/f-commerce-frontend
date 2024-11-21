import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiStopwatch } from "react-icons/bi";
import createErrorMessage from "@/app/utils/createErrorMessage";
import { auth } from "@/firebase.config";
import { removeSession } from "@/app/actions/auth";
import { sendEmailVerification, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/contexts/loading";

export default function VerificationSection({ user }) {
  const router = useRouter();
  const { setIsPageLoading } = useLoading();
  const [countdown, setCountdown] = useState(60);

  // Start countdown timer when component mounts
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(countdownInterval);
    }

    // Clean up the countdown timer when the component unmounts
    return () => clearInterval(countdownInterval);
  }, [countdown]);

  // Function that handles resending verification email
  const handleEmailResend = () => {
    setIsPageLoading(true);

    try {
      sendEmailVerification(user);
      toast.success("Verification email sent.", {
        position: "bottom-left",
        style: {
          background: "black",
          color: "white",
          // margin: "20px",
        },
      });
    } catch (error) {
      toast.error(createErrorMessage(error), {
        position: "bottom-left",
        style: {
          background: "black",
          color: "white",
          // margin: "20px",
        },
      });
    }

    setIsPageLoading(false);
    setCountdown(60); // Reset countdown timer
  };

  // Function that resets registration processs
  const handleRegisterReset = async (event) => {
    event.preventDefault();

    setIsPageLoading(true);

    try {
      await signOut(auth);
      // await removeSession();
      router.push("/register");
    } catch (error) {
      toast.error(createErrorMessage(error), {
        position: "bottom-left",
        style: {
          background: "black",
          color: "white",
          // margin: "20px",
        },
      });
    }

    setIsPageLoading(false);
  };

  return (
    <>
      <h1 className="text-xl font-semibold">Verify Email Address</h1>
      <p className="mb-8 mt-2">
        A verification email has been sent to your email address,{" "}
        <span className="font-bold">{user?.email}</span>.
      </p>
      <div className="flex gap-3.5">
        <button
          className={`rounded-lg px-5 py-3 text-[13px] font-semibold transition-[background-color] duration-300 ${countdown > 0 ? "cursor-not-allowed bg-neutral-100 text-[#a2a2a2]" : "bg-[#d4ffce] text-neutral-700 hover:bg-[#bdf6b4]"}`}
          disabled={countdown > 0} // Disable resend button if countdown is still ongoing
          onClick={handleEmailResend}
        >
          Resend email
        </button>
        {
          // If countdown is still ongoing, display countdown timer
          countdown > 0 && (
            <div className="flex items-center justify-center gap-1">
              <BiStopwatch size={20} />
              <p className="text-xs font-semibold sm:text-[13px]">
                after{" "}
                {countdown >= 60
                  ? "01:00"
                  : `00:${countdown < 10 ? `0${countdown}` : countdown}`}
              </p>
            </div>
          )
        }
      </div>
      {/* Register page link if user doesn't have an account */}
      <p className="mt-4 text-xs md:text-sm">
        Entered wrong email address?{" "}
        <span
          className="inline cursor-pointer font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
          onClick={handleRegisterReset}
        >
          Try different email
        </span>
      </p>
    </>
  );
}
