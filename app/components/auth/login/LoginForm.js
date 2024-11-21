import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { auth } from "@/firebase.config";
import createErrorMessage from "@/app/utils/createErrorMessage";
import { useRouter } from "next/navigation";
import ForgotPassword from "./ForgotPassword";
import { useForm } from "react-hook-form";
import { useLoading } from "@/app/contexts/loading";

export default function LoginForm() {
  const router = useRouter();
  const { setIsPageLoading } = useLoading();
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(null);
  const toastOptions = {
    position: isSmallScreen ? "top-center" : "bottom-left",
    style: {
      background: "black",
      color: "white",
      marginTop: isSmallScreen ? "48px" : "0px",
    },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    // Set initial position on component mount
    // Function to detect screen size and adjust toast position
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSmallScreen(true); // Mobile screen
      } else {
        setIsSmallScreen(false); // Desktop screen
      }
    };

    handleResize();

    // Add event listener to adjust position on resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (data) => {
    setIsPageLoading(true);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);

      reset();
      toast.success("Successfully logged in.", toastOptions);
      router.push("/");
    } catch (error) {
      toast.error(createErrorMessage(error), toastOptions);
    }

    setIsPageLoading(false);
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.", toastOptions);
    else if (errorTypes.includes("pattern"))
      toast.error("Please provide valid information.", toastOptions);
    else toast.error("Something went wrong. Please try again.", toastOptions);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-3"
    >
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="john.doe@gmail.com"
          autoComplete="email"
          {...register("email", {
            pattern: {
              value:
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/,
              message: "Email is not valid.",
            },
            required: {
              value: true,
              message: "Email is required.",
            },
          })}
          className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
          required
        />
        {errors.email && (
          <p className="text-xs font-semibold text-red-500">
            {errors.email?.message}
          </p>
        )}
      </div>
      <div className="w-full space-y-2 font-semibold">
        <div className="flex items-center justify-between">
          <label htmlFor="name">Password</label>
          <ForgotPassword />
        </div>
        <div className="relative">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required.",
              },
            })}
            className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
            required
          />
          <div
            className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
            onClick={() => SetIsPasswordVisible((preState) => !preState)}
          >
            {isPasswordVisible ? (
              <AiOutlineEye className="text-neutral-700" />
            ) : (
              <AiOutlineEyeInvisible className="text-neutral-400" />
            )}
          </div>
        </div>
        {errors.password && (
          <p className="text-xs font-semibold text-red-500">
            {errors.password?.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="!mt-7 w-full rounded-lg bg-[#d4ffce] py-3 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm"
      >
        Sign in
      </button>
    </form>
  );
}
