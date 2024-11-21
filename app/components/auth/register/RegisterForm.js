import TransitionLink from "@/app/components/ui/TransitionLink";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  createUserWithEmailAndPassword,
  // sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { Checkbox } from "@nextui-org/react";
// import { createSession } from "@/app/actions/auth";
import toast from "react-hot-toast";
import { auth } from "@/firebase.config";
import { useRouter } from "next/navigation";
// import { CheckoutVisitBasedRedirect } from "@/app/actions/checkout";
import createErrorMessage from "@/app/utils/createErrorMessage";
import { useForm } from "react-hook-form";
import { useLoading } from "@/app/contexts/loading";

export default function RegisterForm() {
  const router = useRouter();
  const { setIsPageLoading } = useLoading();
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, SetIsConfirmPasswordVisible] =
    useState(false);
  const [isPoliciesCheckboxSelected, setIsPoliciesCheckboxSelected] =
    useState(true);
  const [isNewsletterCheckboxSelected, setIsNewsletterCheckboxSelected] =
    useState(true);
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
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

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
  // let isFromCheckout;

  // useEffect(() => {
  //   const getCheckoutVisitStatus = async () => {
  //     isFromCheckout = await getIsFromCheckout();
  //   };

  //   getCheckoutVisitStatus();
  // }, []);

  const onSubmit = async (data) => {
    if (!isPoliciesCheckboxSelected)
      return toast.error(
        "You must first agree to the terms & conditions and privacy statement.",
        toastOptions,
      );

    setIsPageLoading(true);

    try {
      // Attempt to create user account with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      // await createSession(userCredential?.user?.uid);
      toast.success("Account created successfully.", toastOptions);

      // Update user profile with the given name
      await updateProfile(userCredential?.user, { displayName: data.name });

      console.log("verify uid (client)", userCredential?.user?.uid);

      await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userCredential?.user?.uid }),
      });

      // Send email verification to new user
      // await sendEmailVerification(userCredential?.user);
      // toast.success("Verification email sent. Please check your inbox.", {
      //   position: "bottom-left",
      //   style: {
      //     background: "black",
      //     color: "white",
      //     // margin: "20px",
      //   },
      // });

      // const isFromCheckout = await getIsFromCheckout();
      // console.log("isFromCheckout", isFromCheckout);
      // await CheckoutVisitBasedRedirect();

      reset();
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
    else if (
      errorTypes.includes("notMatchingWithConfirm") ||
      errorTypes.includes("notMatchingWithNew")
    )
      toast.error("Passwords do not match.", toastOptions);
    else toast.error("Something went wrong. Please try again.", toastOptions);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-3"
    >
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          {...register("name", {
            pattern: {
              value: /^[a-zA-Z\s'-]{3,}$/,
              message: "Full name is not valid.",
            },
            required: {
              value: true,
              message: "Full name is required.",
            },
          })}
          className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
          required
        />
        {errors.name && (
          <p className="text-xs font-semibold text-red-500">
            {errors.name?.message}
          </p>
        )}
      </div>
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="john.doe@gmail.com"
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
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="tel"
          {...register("phone", {
            pattern: {
              value: /^01\d{9}$/,
              message: "Mobile number is invalid.",
            },
            required: {
              value: true,
              message: "Mobile number is required.",
            },
          })}
          onInput={(event) =>
            (event.target.value = event.target.value.replace(/\D/g, ""))
          }
          className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          required
        />
        {errors.phone && (
          <p className="text-xs font-semibold text-red-500">
            {errors.phone?.message}
          </p>
        )}
      </div>
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••"
            {...register("password", {
              pattern: {
                value: /^.{8,}$/,
                message: "Password must contain at least 8 characters.",
              },
              required: {
                value: true,
                message: "Password is required.",
              },
              validate: {
                notMatchingWithConfirm: (fieldValue) => {
                  if (fieldValue === confirmPassword)
                    clearErrors("confirmPassword");
                  return (
                    !confirmPassword ||
                    confirmPassword === fieldValue ||
                    "Passwords do not match."
                  );
                },
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
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="confirm-password">Confirm Password</label>
        <div className="relative">
          <input
            id="confirm-password"
            type={isConfirmPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••"
            {...register("confirmPassword", {
              pattern: {
                value: /^.{8,}$/,
                message: "Password must contain at least 8 characters.",
              },
              required: {
                value: true,
                message: "Confirm password is required.",
              },
              validate: {
                notMatchingWithNew: (fieldValue) => {
                  if (fieldValue === password) clearErrors("password");
                  return (
                    !password ||
                    password === fieldValue ||
                    "Passwords do not match."
                  );
                },
              },
            })}
            className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
            required
          />
          <div
            className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
            onClick={() => SetIsConfirmPasswordVisible((preState) => !preState)}
          >
            {isConfirmPasswordVisible ? (
              <AiOutlineEye className="text-neutral-700" />
            ) : (
              <AiOutlineEyeInvisible className="text-neutral-400" />
            )}
          </div>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs font-semibold text-red-500">
            {errors.confirmPassword?.message}
          </p>
        )}
      </div>
      <div className="!mt-7 space-y-4">
        {/* Terms & Conditions and Privacy Statement */}
        <div
          className={`flex gap-x-2 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-[color] [&_a]:duration-300 [&_a]:ease-in-out [&_span]:text-xs lg:[&_span]:text-[13px] ${isPoliciesCheckboxSelected ? "[&_a]:text-[#57944e] hover:[&_a]:text-[#6cb461]" : "[&_a]:text-[#f31260]"}`}
        >
          <Checkbox
            className="[&_span:has(svg):after]:bg-[#d4ffce] [&_span:has(svg)]:text-neutral-700"
            defaultSelected
            isRequired
            isSelected={isPoliciesCheckboxSelected}
            onValueChange={setIsPoliciesCheckboxSelected}
            isInvalid={!isPoliciesCheckboxSelected}
          >
            I agree to the{" "}
            <TransitionLink href="/terms-and-conditions">
              Terms & Conditions
            </TransitionLink>
            {" and "}
            <TransitionLink href="/privacy-policy">
              Privacy Policy
            </TransitionLink>
          </Checkbox>
        </div>
        <div className="flex gap-x-2 [&_span]:text-xs lg:[&_span]:text-[13px]">
          <Checkbox
            className="[&_span:has(svg):after]:bg-[#d4ffce] [&_span:has(svg)]:text-neutral-700"
            // defaultSelected
            // isRequired
            isSelected={isNewsletterCheckboxSelected}
            onValueChange={setIsNewsletterCheckboxSelected}
            // isInvalid={!isNewsletterCheckboxSelected}
          >
            Be the first to know more about our trending & newest products, and
            exclusive deals
          </Checkbox>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#d4ffce] py-3 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
