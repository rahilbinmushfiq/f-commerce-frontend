"use client";

import Loader from "@/app/components/layout/Loader";
import { useAuth } from "@/app/contexts/auth";
import { cities, dhakaSuburbs, hillTractsArea } from "@/app/data/cities";
import { promos } from "@/app/data/promos";
import { shippingCharges } from "@/app/data/shippingCharges";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  Select,
  SelectItem,
  DatePicker,
} from "@nextui-org/react";
import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";
import { useState, useEffect } from "react";
import { CgHeart, CgTrash } from "react-icons/cg";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { TbShoppingCartExclamation, TbTruckLoading } from "react-icons/tb";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";
import createErrorMessage from "@/app/utils/createErrorMessage";
import { PiConfetti } from "react-icons/pi";
import { Controller, useForm } from "react-hook-form";
import { IoClose, IoCloseOutline } from "react-icons/io5";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Confetti from "react-confetti";
import orderConfirmationCartImg from "@/public/confirmation/order-confirmation-cart.svg";
import orderConfirmationShippingImg from "@/public/confirmation/order-confirmation-shipping.svg";
import orderConfirmationCartOldImg from "@/public/confirmation/order-confirmation-cart-old.svg";
import orderConfirmationShippingOldImg from "@/public/confirmation/order-confirmation-shipping-old.svg";
import vector1 from "@/public/bg-banner/vector1.png";
import vector2 from "@/public/bg-banner/vector2.png";
import ForgotPassword from "@/app/components/auth/login/ForgotPassword";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import SignInWithGoogle from "@/app/components/auth/providers/SignInWithGoogle";
import { auth } from "@/firebase.config";
import { useLoading } from "@/app/contexts/loading";
import { parseDate } from "@internationalized/date";

export default function Checkout() {
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [cartItems, setCartItems] = useState(null);
  const [userPromoCode, setUserPromoCode] = useState("");
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(true);
  const [isCartItemsLoaded, setIsCartItemsLoaded] = useState(false);
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, SetIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, SetIsConfirmPasswordVisible] =
    useState(false);
  // const [countdown, setCountdown] = useState(0);
  const [isPoliciesCheckboxSelected, setIsPoliciesCheckboxSelected] =
    useState(true);
  const [isNewsletterCheckboxSelected, setIsNewsletterCheckboxSelected] =
    useState(true);
  const [isSaveAddressCheckboxSelected, setIsSaveAddressCheckboxSelected] =
    useState(false);
  const [isPaymentStepDone, setIsPaymentStepDone] = useState(false);
  const [showConeftti, setShowConeftti] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const isBkashCashbackAvailable = true;
  const [additionalUserInfo, setAdditionalUserInfo] = useState(null);

  const {
    register,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: additionalUserInfo?.phoneNumber || "",
      altPhoneNumber: additionalUserInfo?.altPhoneNumber || "",
      hometown: additionalUserInfo?.hometown || "",
      dob: additionalUserInfo?.dob || null,
      addressLineOne:
        additionalUserInfo?.prevDelilveryAddress?.addressLineOne || "",
      addressLineTwo:
        additionalUserInfo?.prevDelilveryAddress?.addressLineTwo || "",
      city: additionalUserInfo?.prevDelilveryAddress?.city || "",
      postalCode: additionalUserInfo?.prevDelilveryAddress?.postalCode || "",
      note: "",
      deliveryType: "",
      paymentMethod: "",
    },
    mode: "onBlur",
  });

  const {
    register: registerForLogin,
    handleSubmit: handleSubmitForLogin,
    reset: resetForLogin,
    formState: { errors: errorsForLogin },
  } = useForm({
    defaultValues: {
      loginEmail: "",
      loginPassword: "",
    },
    mode: "onBlur",
  });

  const {
    register: registerForRegister,
    handleSubmit: handleSubmitForRegister,
    reset: resetForRegister,
    watch: watchForRegister,
    clearErrors: clearErrorsForRegister,
    formState: { errors: errorsForRegister },
  } = useForm({
    defaultValues: {
      registerFullName: "",
      registerEmail: "",
      registerPassword: "",
      registerConfirmPassword: "",
    },
    mode: "onBlur",
  });

  const selectedCity = watch("city");
  const selectedHometown = watch("hometown");
  // const selectedLanguage = watch("language");
  const selectedDeliveryType = watch("deliveryType");
  const registerPassword = watchForRegister("registerPassword");
  const registerConfirmPassword = watchForRegister("registerConfirmPassword");

  // Start countdown timer when component mounts
  // useEffect(() => {
  //   const countdownInterval = setInterval(() => {
  //     setCountdown((countdown) => countdown - 1);
  //   }, 1000);

  //   if (countdown === 0) {
  //     clearInterval(countdownInterval);
  //   }

  //   // Clean up the countdown timer when the component unmounts
  //   return () => clearInterval(countdownInterval);
  // }, [countdown]);

  useEffect(() => {
    setAdditionalUserInfo(
      !user
        ? {}
        : {
            phoneNumber: null,
            altPhoneNumber: null,
            // hometown: "",
            // dob: null,
            // hometown: "Bogura",
            // dob: parseDate("1998-05-18"),
            // prevDelilveryAddress: null,
            // deliveryAddresses: null,
            prevDelilveryAddress: {
              id: "916247bc2ca49",
              nickname: "Home",
              addressLineOne: "House 14, Road 3, Sector 5",
              addressLineTwo: "Uttara, Dhaka",
              city: "Dhaka",
              postalCode: 1230,
            },
            deliveryAddresses: [
              {
                id: "916247bc2ca49",
                nickname: "Home",
                addressLineOne: "House 14, Road 3, Sector 5",
                addressLineTwo: "Uttara, Dhaka",
                city: "Dhaka",
                postalCode: 1230,
              },
              {
                id: "b219c96c42a47",
                nickname: "Office",
                addressLineOne: "Block B, Road 3",
                addressLineTwo: "Niketon, Dhaka",
                city: "Dhaka",
                postalCode: 1482,
              },
            ],
          },
    );
  }, [user]);

  useEffect(() => {
    localStorage.setItem("isCheckoutPageLastVisited", "true");
  }, []);

  // Function that handles resending verification email
  // const handleVerificationEmail = () => {
  //   if (countdown === 0) {
  //     setIsPageLoading(true);

  //     try {
  //       sendEmailVerification(user);
  //       toast.success("Verification email sent. Please check your inbox.");
  //     } catch (error) {
  //       toast.error(createErrorMessage(error));
  //     }

  //     setIsPageLoading(false);
  //     setCountdown(59); // Reset countdown timer
  //   }
  // };

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cartItems")));

    const handleStorageUpdate = () =>
      setCartItems(JSON.parse(localStorage.getItem("cartItems")));

    window.addEventListener("storageCart", handleStorageUpdate);

    setIsCartItemsLoaded(true);

    return () => {
      window.removeEventListener("storageCart", handleStorageUpdate);
    };
  }, []);

  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // console.log("rhf dob age", age);
    return age;
  };

  const onSubmit = (data) => {
    if (isCheckboxSelected) {
      setIsPaymentStepDone(true);

      console.log("rhf data", data);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // const selectedDate = new Date(data.dob);

      // const day = selectedDate.getDate(); // Day of the month (1-31)
      // const month = selectedDate.getMonth() + 1; // Month (0-11), so add 1 to get (1-12)
      // const year = selectedDate.getFullYear(); // Year (e.g., 2024)

      const userAgent = navigator.userAgent.toLowerCase();

      // if (/mobile|android|iphone|ipad|ipod|blackberry|phone/.test(userAgent)) {
      //   console.log("Mobile");
      // } else if (/tablet|ipad/.test(userAgent)) {
      //   console.log("Tablet");
      // } else {
      //   console.log("Desktop");
      // }
    } else
      toast.error("You must agree with the terms and conditions and policies.");
  };

  const onSubmitForLogin = async (data) => {
    setIsPageLoading(true);

    try {
      // Attempt to sign-in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.loginEmail,
        data.loginPassword,
      );

      resetForLogin();
      toast.success("Successfully logged in.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  const onSubmitForRegister = async (data) => {
    setIsPageLoading(true);

    try {
      // Attempt to sign-in with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.registerEmail,
        data.registerPassword,
      );

      await updateProfile(userCredential?.user, {
        displayName: data.registerFullName,
      });

      resetForRegister();
      setIsRegisterModalOpen(false);
      toast.success("Registered Successfully.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }
    setIsPageLoading(false);
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern"))
      toast.error("Please provide valid information.");
    else if (
      errorTypes.includes("notMatchingWithConfirm") ||
      errorTypes.includes("notMatchingWithNew")
    )
      toast.error("Passwords do not match.");
    else toast.error("Something went wrong. Please try again.");
  };

  const handlePromoCodeValidation = () => {
    const enteredPromoCode = document.querySelector("#promo-code").value;
    const correspondingPromo = promos.find(
      (promo) => promo.code.toUpperCase() === enteredPromoCode.toUpperCase(),
    );
    const promoCodeMessageElement = document.querySelector(
      "#promo-code-message",
    );
    const sectionElement =
      promoCodeMessageElement.parentElement.parentElement.parentElement;

    promoCodeMessageElement.style.opacity = "1";
    promoCodeMessageElement.style.transform = "scale(1)";
    sectionElement.style.paddingBottom = "52px";

    setUserPromoCode(correspondingPromo);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (accumulator, item) =>
        (item.discount || item.price) * item.selectedQuantity + accumulator,
      0,
    );
  };

  const calculateDiscount = () => {
    if (!userPromoCode) return 0;
    else if (userPromoCode.discountType === "flat")
      return userPromoCode.discountAmount;
    else return (userPromoCode.discountAmount / 100) * calculateSubtotal();
  };

  const calculateShippingCharge = () => {
    if (
      !selectedCity ||
      (selectedCity === "Dhaka" && !selectedDeliveryType) ||
      (selectedCity === "Dhaka" && selectedDeliveryType === "standard-delivery")
    )
      return 0;
    if (selectedCity === "Dhaka" && selectedDeliveryType === "express-delivery")
      return 110;
    // if (selectedCity === "Dhaka")
    //   return shippingCharges.insideDhaka;
    else if (dhakaSuburbs.includes(selectedCity))
      return shippingCharges.dhakaSuburbs;
    else if (hillTractsArea.includes(selectedCity))
      return shippingCharges.hillTractsArea;
    else return shippingCharges.outsideDhaka;
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() - calculateDiscount() + calculateShippingCharge()
    );
  };

  const generateOrderId = () => {
    // dummy data
    const phoneNumber = "01758346310";
    const orderNumber = "47";

    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const nameParts = user?.displayName?.split(" ");
    const initials =
      nameParts[0][0].toUpperCase() +
      nameParts[nameParts.length - 1][0].toUpperCase();
    const lastThreeDigits = phoneNumber.slice(-3);

    return `${year}${month}${day}${orderNumber}${initials}${lastThreeDigits}`;
  };

  useEffect(() => {
    const autocompleteElements = document.querySelectorAll(
      "[aria-autocomplete]",
    );

    const handleAutocompleteClick = (event) =>
      event.currentTarget.querySelector("input").focus();

    autocompleteElements.forEach((element) => {
      element
        .closest('[data-slot="base"]')
        .addEventListener("click", handleAutocompleteClick);
    });

    autocompleteElements.forEach((element) => {
      return () =>
        element
          .closest('[data-slot="base"]')
          .removeEventListener("click", handleAutocompleteClick);
    });
  }, [cartItems]);

  // useEffect(() => {
  //   const dobElement = document.querySelector("#dob");

  //   const handleDobClick = (event) => {
  //     if (event.target.tagName.toLowerCase() !== "button") {
  //       event.preventDefault();
  //       event.currentTarget.querySelector("div>div").focus();
  //     }
  //   };

  //   dobElement.addEventListener("click", handleDobClick);

  //   return () => dobElement.removeEventListener("click", handleDobClick);
  // }, [cartItems]);

  useEffect(() => {
    setValue("name", user?.displayName || "");
    setValue("email", user?.email || "");
    setValue("hometown", additionalUserInfo?.hometown || "");
    setValue("dob", additionalUserInfo?.dob || null);
    setValue("phoneNumber", additionalUserInfo?.phoneNumber || "");
    setValue("altPhoneNumber", additionalUserInfo?.altPhoneNumber || "");
    setValue(
      "addressLineOne",
      additionalUserInfo?.prevDelilveryAddress?.addressLineOne || "",
    );
    setValue(
      "addressLineTwo",
      additionalUserInfo?.prevDelilveryAddress?.addressLineTwo || "",
    );
    setValue("city", additionalUserInfo?.prevDelilveryAddress?.city || "");
    setValue(
      "postalCode",
      additionalUserInfo?.prevDelilveryAddress?.postalCode || "",
    );
  }, [user, additionalUserInfo]);

  useEffect(() => {
    if (isPaymentStepDone) {
      setShowConeftti(true);
      const confettiTimer = setTimeout(() => setShowConeftti(false), 7500);

      return () => clearTimeout(confettiTimer);
    }
  }, [isPaymentStepDone]);

  // useEffect(() => {
  //   if (!selectedHometown) setValue("language", "");
  // }, [selectedHometown]);

  // if (!isCartItemsLoaded) return <Loader />;

  useEffect(() => setIsPageLoading(!isCartItemsLoaded), [isCartItemsLoaded]);

  if (isPaymentStepDone)
    return (
      <main className="relative flex min-w-full items-center justify-center overflow-hidden bg-white px-5 pb-10 pt-20 text-sm text-neutral-500 sm:px-8 sm:pt-24 md:text-base lg:px-12 lg:pb-6 lg:pt-28 xl:mx-auto xl:min-h-dvh xl:max-w-[1200px] xl:px-0 xl:pb-5 [&_:is(h2,h3)]:text-neutral-800">
        <Confetti
          className="absolute inset-0 h-full w-full"
          numberOfPieces={showConeftti ? 300 : 0}
          recycle={true}
        />
        <div>
          <div className="absolute left-[10%] top-[40%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-[100%] bg-[#FEDCBF] blur-[60px] md:left-[20%] md:blur-[40px] lg:top-[30%] xl:h-[187px] xl:w-[214px]" />
          <div className="absolute left-[60%] top-[20%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-[100%] bg-[#E0FCDC] blur-[60px] md:blur-[40px] xl:h-[187px] xl:w-[214px]" />
          <div className="absolute -right-4 bottom-4 h-[150px] w-[150px] rounded-full bg-[#FEDCBF] blur-[60px] md:blur-[40px] xl:h-[187px] xl:w-[214px]" />
        </div>
        <div className="absolute -left-[30%] bottom-0 aspect-square h-[60vh] -translate-x-1/4 translate-y-[7.5%] opacity-60 max-lg:hidden xl:left-0 xl:-scale-x-100">
          <Image
            className="h-full w-full object-contain"
            src={orderConfirmationCartOldImg}
            alt="Squiggly shape"
          />
        </div>
        <div className="absolute -right-[30%] top-0 aspect-square h-[60vh] translate-x-1/4 translate-y-[15%] opacity-60 max-lg:hidden xl:right-0">
          <Image
            className="h-full w-full object-contain"
            src={orderConfirmationShippingOldImg}
            alt="Arrow shape"
          />
        </div>
        {/* <div className="absolute left-0 aspect-[1/1.2] h-full -translate-x-1/4 opacity-60">
          <Image
            className="h-full w-full object-contain"
            src={orderConfirmationCartImg}
            alt="Squiggly shape"
          />
        </div>
        <div className="absolute right-0 aspect-[1/1.2] h-full translate-x-1/4 opacity-60">
          <Image
            className="h-full w-full object-contain"
            src={orderConfirmationShippingImg}
            alt="Arrow shape"
          />
        </div> */}
        <div className="absolute left-1/4 top-3 aspect-square h-20 -translate-x-full translate-y-[150%] opacity-60 max-sm:hidden lg:top-16">
          <Image src={vector1} alt="Squiggly shape" />
        </div>
        <div className="absolute bottom-3 right-1/4 aspect-square h-20 -translate-y-[40%] translate-x-full opacity-60 max-sm:hidden md:-translate-y-[20%] lg:bottom-16 lg:-translate-y-[150%]">
          <Image src={vector2} alt="Arrow shape" />
        </div>
        {/* <video
          className="fixed inset-0 h-dvh w-full object-cover"
          // ref={videoRef}
          autoPlay
          muted
          // loop
        >
          <source src="/confirmation/confetti.mp4" type="video/mp4" />
        </video> */}
        <div className="relative text-center [&>*]:mx-auto [&>*]:w-fit">
          {/* <PiConfetti className="size-20 text-[#F4D3BA]" /> */}
          {/* <video
            className="h-[124px] w-[300px] object-contain"
            // ref={videoRef}
            autoPlay
            muted
            loop
          >
            <source src="/confirmation/party-popper.mp4" type="video/mp4" />
          </video> */}
          <DotLottieReact
            className="-mt-8 h-32 object-contain"
            src="/confirmation/party-popper.lottie"
            loop
            autoplay
          />
          <h2 className="mt-2 text-2xl font-semibold">
            Thank you for your purchase!
          </h2>
          <p className="mt-2 max-w-md text-sm">
            Upon confirmation, you will get an email! We are getting your order
            ready to be shipped. We will notify you when it has been sent.
          </p>
          <section className="mt-10 max-w-[500px] space-y-3 rounded-md border-2 border-neutral-200 p-3 text-sm sm:px-7 sm:py-5 [&>div]:flex [&>div]:justify-between [&>div]:gap-3 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:text-left [&_h4]:font-semibold [&_h4]:text-neutral-600 sm:[&_h4]:text-nowrap [&_p]:text-right">
            <h3 className="text-center text-lg font-semibold">Order Details</h3>
            <div>
              <h4>Order ID</h4>
              <p>#{generateOrderId()}</p>
            </div>
            <div>
              <h4>Phone Number</h4>
              <p>01758346310</p>
            </div>
            <div>
              <h4>Order Amount</h4>
              <p>৳ {calculateTotal().toLocaleString()}</p>
            </div>
            <div>
              <h4>Shipping Address</h4>
              <p>Sector 7, Road 2, House 19, Uttara-West, Uttara, Dhaka-1230</p>
            </div>
          </section>
          <TransitionLink
            href="/shop"
            className="mt-9 block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm font-semibold text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
          >
            Continue Shopping
          </TransitionLink>
        </div>
      </main>
    );

  return (
    <main
      className={`relative -mt-[calc(240*3px)] pb-10 pt-[88px] text-sm text-neutral-500 sm:pt-24 md:text-base lg:pb-6 lg:pt-28 [&_h2]:uppercase [&_h2]:text-neutral-700 ${!!cartItems?.length ? "bg-neutral-50" : "min-h-[calc(100dvh+240*3px)] bg-white font-semibold"}`}
    >
      <div className="sticky left-[5%] top-1/3 size-60 animate-blob rounded-full bg-[#ffecdc] mix-blend-multiply blur-md" />
      <div className="sticky left-[45%] top-[40%] size-60 animate-blob rounded-full bg-[#ffecdc] mix-blend-multiply blur-md [animation-delay:1s]" />
      <div className="sticky left-[80%] top-1/2 size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:2s]" />
      {!!cartItems?.length ? (
        <div className="relative gap-4 px-5 sm:px-8 lg:flex lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
          <div className="bottom-5 top-5 h-fit space-y-4 lg:sticky lg:w-[calc(55%-16px/2)]">
            {!user && (
              <section className="w-full space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-[height] duration-300 ease-in-out">
                <h2 className="text-base font-semibold md:text-lg">
                  Access Your Account
                </h2>
                <form
                  className="space-y-4 read-only:[&_input]:border-0 read-only:[&_input]:bg-neutral-50 read-only:[&_input]:text-neutral-400"
                  onSubmit={handleSubmitForLogin(onSubmitForLogin, onError)}
                  noValidate
                >
                  <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                    <div className="w-full space-y-2 font-semibold">
                      <label htmlFor="login-email">Email</label>
                      {/* <label htmlFor="email">Email</label> */}
                      <input
                        id="login-email"
                        type="email"
                        placeholder="john.doe@gmail.com"
                        autoComplete="email"
                        {...registerForLogin("loginEmail", {
                          // readOnly: true,
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
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                        required
                      />
                      {errorsForLogin.loginEmail && (
                        <p className="text-xs font-semibold text-red-500">
                          {errorsForLogin.loginEmail?.message}
                        </p>
                      )}
                      {/* <p
                      className={`w-fit cursor-pointer text-xs text-[#57944e] transition-[transform,opacity,color,height] hover:text-[#6cb461] sm:text-[13px] ${!user?.emailVerified ? "pointer-events-none h-0 scale-0 opacity-0" : "h-4 scale-100 opacity-100"}`}
                      onClick={handleVerificationEmail}
                    >
                      Verify email
                    </p> */}
                    </div>
                    <div className="w-full space-y-2 font-semibold">
                      <div className="flex items-center justify-between">
                        <label htmlFor="login-password">Password</label>
                        <ForgotPassword />
                      </div>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="••••••••••••••"
                          {...registerForLogin("loginPassword", {
                            required: {
                              value: true,
                              message: "Password is required.",
                            },
                          })}
                          className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                          required
                        />
                        <div
                          className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
                          onClick={() =>
                            SetIsPasswordVisible((prevState) => !prevState)
                          }
                        >
                          {isPasswordVisible ? (
                            <AiOutlineEye className="text-neutral-700" />
                          ) : (
                            <AiOutlineEyeInvisible className="text-neutral-400" />
                          )}
                        </div>
                      </div>
                      {errorsForLogin.loginPassword && (
                        <p className="text-xs font-semibold text-red-500">
                          {errorsForLogin.loginPassword?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="max-sm:space-y-4 sm:flex sm:items-end sm:gap-x-4">
                    <button
                      type="submit"
                      className="block h-fit w-full self-end rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
                    >
                      Sign in
                    </button>
                    <SignInWithGoogle
                      isConnected={false}
                      buttonText="Sign in"
                    />
                  </div>
                  <div className="w-full font-semibold">
                    <p className="text-xs font-semibold">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        className="font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
                        onClick={() => setIsRegisterModalOpen(true)}
                      >
                        Sign up now!
                      </button>
                    </p>
                  </div>
                </form>
              </section>
            )}
            <Modal
              isOpen={isRegisterModalOpen}
              onOpenChange={setIsRegisterModalOpen}
              size="2xl"
              scrollBehavior="inside"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="uppercase">Sign up</ModalHeader>
                    <ModalBody className="-mt-5">
                      <p className="mb-4 text-sm text-neutral-500">
                        After you sign up, you can continue to checkout.
                      </p>
                      <form
                        className="space-y-4 read-only:[&_input]:border-0 read-only:[&_input]:bg-neutral-50 read-only:[&_input]:text-neutral-400"
                        onSubmit={handleSubmitForRegister(
                          onSubmitForRegister,
                          onError,
                        )}
                        noValidate
                      >
                        <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                          <div className="w-full space-y-2 font-semibold">
                            <label htmlFor="register-full-name">
                              Full Name
                            </label>
                            {/* <label htmlFor="email">Email</label> */}
                            <input
                              id="register-full-name"
                              type="text"
                              autoComplete="name"
                              placeholder="John Doe"
                              {...registerForRegister("registerFullName", {
                                pattern: {
                                  value: /^[a-zA-Z\s'-]{3,}$/,
                                  message: "Full name is not valid.",
                                },
                                required: {
                                  value: true,
                                  message: "Full name is required.",
                                },
                              })}
                              className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-[13px]"
                              required
                            />
                            {errorsForRegister.registerFullName && (
                              <p className="text-xs font-semibold text-red-500">
                                {errorsForRegister.registerFullName?.message}
                              </p>
                            )}
                          </div>
                          <div className="w-full space-y-2 font-semibold">
                            <label htmlFor="register-email">Email</label>
                            {/* <label htmlFor="email">Email</label> */}
                            <input
                              id="register-email"
                              type="email"
                              autoComplete="email"
                              placeholder="john.doe@gmail.com"
                              // value={user?.email}
                              {...registerForRegister("registerEmail", {
                                // readOnly: true,
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
                              className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-[13px]"
                              // disabled
                              // readOnly
                              required
                            />
                            {errorsForRegister.registerEmail && (
                              <p className="text-xs font-semibold text-red-500">
                                {errorsForRegister.registerEmail?.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                          <div className="w-full space-y-2 font-semibold">
                            <label htmlFor="register-password">Password</label>
                            <div className="relative">
                              <input
                                id="register-password"
                                type={
                                  isNewPasswordVisible ? "text" : "password"
                                }
                                placeholder="••••••••••••••"
                                {...registerForRegister("registerPassword", {
                                  pattern: {
                                    value: /^.{8,}$/,
                                    message:
                                      "Password must contain at least 8 characters.",
                                  },
                                  required: {
                                    value: true,
                                    message: "Password is required.",
                                  },
                                  validate: {
                                    notMatchingWithConfirm: (fieldValue) => {
                                      if (
                                        fieldValue === registerConfirmPassword
                                      )
                                        clearErrorsForRegister(
                                          "registerConfirmPassword",
                                        );

                                      return (
                                        !registerConfirmPassword ||
                                        registerConfirmPassword ===
                                          fieldValue ||
                                        "Passwords do not match."
                                      );
                                    },
                                  },
                                })}
                                className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-[13px]"
                                required
                              />
                              <div
                                className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
                                onClick={() =>
                                  SetIsNewPasswordVisible(
                                    (prevState) => !prevState,
                                  )
                                }
                              >
                                {isNewPasswordVisible ? (
                                  <AiOutlineEye className="text-neutral-700" />
                                ) : (
                                  <AiOutlineEyeInvisible className="text-neutral-400" />
                                )}
                              </div>
                            </div>
                            {errorsForRegister.registerPassword && (
                              <p className="text-xs font-semibold text-red-500">
                                {errorsForRegister.registerPassword?.message}
                              </p>
                            )}
                          </div>
                          <div className="w-full space-y-2 font-semibold">
                            <label htmlFor="register-confirm-password">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                id="register-confirm-password"
                                type={
                                  isConfirmPasswordVisible ? "text" : "password"
                                }
                                placeholder="••••••••••••••"
                                {...registerForRegister(
                                  "registerConfirmPassword",
                                  {
                                    pattern: {
                                      value: /^.{8,}$/,
                                      message:
                                        "Password must contain at least 8 characters.",
                                    },
                                    required: {
                                      value: true,
                                      message: "Confirm password is required.",
                                    },
                                    validate: {
                                      notMatchingWithNew: (fieldValue) => {
                                        if (fieldValue === registerPassword)
                                          clearErrorsForRegister(
                                            "registerPassword",
                                          );

                                        return (
                                          !registerPassword ||
                                          registerPassword === fieldValue ||
                                          "Passwords do not match."
                                        );
                                      },
                                    },
                                  },
                                )}
                                className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-[13px]"
                                required
                              />
                              <div
                                className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
                                onClick={() =>
                                  SetIsConfirmPasswordVisible(
                                    (prevState) => !prevState,
                                  )
                                }
                              >
                                {isConfirmPasswordVisible ? (
                                  <AiOutlineEye className="text-neutral-700" />
                                ) : (
                                  <AiOutlineEyeInvisible className="text-neutral-400" />
                                )}
                              </div>
                            </div>
                            {errorsForRegister.registerConfirmPassword && (
                              <p className="text-xs font-semibold text-red-500">
                                {
                                  errorsForRegister.registerConfirmPassword
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        <div
                          className={`!mt-7 flex gap-x-2 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-[color] [&_a]:duration-300 [&_a]:ease-in-out [&_span]:text-xs lg:[&_span]:text-[13px] ${isPoliciesCheckboxSelected ? "[&_a]:text-[#57944e] hover:[&_a]:text-[#6cb461]" : "[&_a]:text-[#f31260]"}`}
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
                            Be the first to know more about our trending &
                            newest products, and exclusive deals
                          </Checkbox>
                        </div>
                        <div className="!mb-4 !mt-8 max-sm:space-y-4 sm:flex sm:items-end sm:gap-x-4">
                          <button
                            type="submit"
                            className="block h-fit w-full self-end rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
                          >
                            Sign up
                          </button>
                          <SignInWithGoogle
                            isConnected={false}
                            buttonText="Sign up"
                          />
                        </div>
                      </form>
                    </ModalBody>
                    {/* <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter> */}
                  </>
                )}
              </ModalContent>
            </Modal>
            <form
              className="space-y-4"
              noValidate
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <section className="w-full space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-[height] duration-300 ease-in-out">
                <h2 className="text-base font-semibold md:text-lg">
                  Personal Information
                </h2>
                <div className="space-y-4 read-only:[&_input]:border-0 read-only:[&_input]:bg-neutral-50 read-only:[&_input]:text-neutral-400">
                  {!!user && (
                    <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                      <div className="w-full space-y-2 font-semibold">
                        <label htmlFor="name">Full Name</label>
                        <input
                          id="name"
                          // name="name"
                          // type="text"
                          // value={user?.displayName}
                          {...register("name", {
                            readOnly: true,
                            required: {
                              value: true,
                              message: "Name is required.",
                            },
                          })}
                          className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                          // disabled
                          readOnly
                          required
                        />
                        {errors.name && (
                          <p className="text-xs font-semibold text-red-500">
                            {errors.name?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full space-y-2 font-semibold">
                        {/* <div className="flex items-center justify-between"> */}
                        <label htmlFor="email">Email</label>
                        {/* <p
                            className={`w-fit text-xs ${user?.emailVerified ? "pointer-events-none h-0 scale-0 opacity-0" : "h-4 scale-100 opacity-100"}`}
                          >
                            <span
                              className={`text-[#57944e] transition-[transform,opacity,color,height] ${!countdown ? "cursor-pointer hover:text-[#6cb461]" : "cursor-not-allowed text-[#57944e]/65"}`}
                              onClick={handleVerificationEmail}
                            >
                              Verify email
                            </span>
                            <span
                              className={!countdown ? "hidden" : ""}
                            >{` (resend in 00:${countdown > 9 ? countdown : `0${countdown}`})`}</span>
                          </p> */}
                        {/* </div> */}
                        {/* <label htmlFor="email">Email</label> */}
                        <input
                          id="email"
                          name="email"
                          type="email"
                          // value={user?.email}
                          {...register("email", {
                            readOnly: true,
                            required: {
                              value: true,
                              message: "Email is required.",
                            },
                          })}
                          className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                          // disabled
                          readOnly
                          required
                        />
                        {errors.email && (
                          <p className="text-xs font-semibold text-red-500">
                            {errors.email?.message}
                          </p>
                        )}
                        {/* <p
                      className={`w-fit cursor-pointer text-xs text-[#57944e] transition-[transform,opacity,color,height] hover:text-[#6cb461] sm:text-[13px] ${!user?.emailVerified ? "pointer-events-none h-0 scale-0 opacity-0" : "h-4 scale-100 opacity-100"}`}
                      onClick={handleVerificationEmail}
                    >
                      Verify email
                    </p> */}
                      </div>
                    </div>
                  )}
                  <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                    <div className="w-full space-y-2 font-semibold">
                      <label htmlFor="primary-mobile">Mobile Number</label>
                      <input
                        id="primary-mobile"
                        type="tel"
                        // name="phoneNumber"
                        // defaultValue={user?.phoneNumber}
                        {...register("phoneNumber", {
                          pattern: {
                            value: /^01\d{9}$/,
                            message: "Mobile number is invalid.",
                          },
                          required: {
                            value: true,
                            message: "Primary mobile number is required.",
                          },
                        })}
                        onInput={(event) =>
                          (event.target.value = event.target.value.replace(
                            /\D/g,
                            "",
                          ))
                        }
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                        placeholder="01XXXXXXXXX"
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="text-xs font-semibold text-red-500">
                          {errors.phoneNumber?.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full space-y-2 font-semibold">
                      <label htmlFor="alt-mobile">
                        Alternative Mobile Number
                      </label>
                      <input
                        id="alt-mobile"
                        // name="altPhoneNumber"
                        type="tel"
                        // defaultValue={user?.altPhoneNumber}
                        {...register("altPhoneNumber", {
                          pattern: {
                            value: /^01\d{9}$/,
                            message: "Mobile number is invalid.",
                          },
                        })}
                        onInput={(event) =>
                          (event.target.value = event.target.value.replace(
                            /\D/g,
                            "",
                          ))
                        }
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                        placeholder="01XXXXXXXXX"
                      />
                      {errors.altPhoneNumber && (
                        <p className="text-xs font-semibold text-red-500">
                          {errors.altPhoneNumber?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {(!additionalUserInfo?.hometown ||
                    !additionalUserInfo?.dob) && (
                    <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                      <div className="w-full space-y-2 font-semibold">
                        <Controller
                          name="hometown"
                          control={control}
                          rules={{
                            required: "Hometown is required.",
                          }}
                          render={({ field: { onChange, value } }) => (
                            <Autocomplete
                              isRequired
                              labelPlacement="outside"
                              label="Hometown"
                              placeholder="Select hometown"
                              size="sm"
                              variant="bordered"
                              selectedKey={value}
                              onSelectionChange={onChange}
                              isDisabled={!!additionalUserInfo?.hometown}
                              className="select-with-search [&:has(input:disabled)_input]:px-4 [&:has(input:focus)_[data-slot='input-wrapper']]:border-[#F4D3BA] [&_[data-disabled='true']]:opacity-100 [&_[data-disabled='true']_[data-slot='inner-wrapper']]:opacity-50 [&_[data-slot='inner-wrapper']]:transition-opacity [&_[data-slot='inner-wrapper']]:duration-300 [&_[data-slot='inner-wrapper']]:ease-in-out [&_[data-slot='input-wrapper']]:bg-white/20 [&_[data-slot='input-wrapper']]:hover:border-[#F4D3BA] [&_label]:!text-neutral-500"
                            >
                              {cities.map((hometown) => {
                                return (
                                  <AutocompleteItem key={hometown}>
                                    {hometown}
                                  </AutocompleteItem>
                                );
                              })}
                            </Autocomplete>
                          )}
                        />
                        {errors.hometown && (
                          <p className="text-xs font-semibold text-red-500">
                            {errors.hometown?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full space-y-2 font-semibold">
                        <Controller
                          name="dob"
                          control={control}
                          rules={{
                            required: "Date of birth is required.",
                            validate: (value) => {
                              const age = calculateAge(value);
                              if (age < 13)
                                return "You must be at least 13 years old";
                              if (age > 120)
                                return "Age cannot be more than 120 years old";
                              return true;
                            },
                          }}
                          render={({ field: { onChange, value } }) => (
                            <DatePicker
                              id="dob"
                              labelPlacement="outside"
                              label="Date of Birth"
                              showMonthAndYearPickers
                              variant="bordered"
                              value={value}
                              onChange={onChange}
                              isDisabled={!!additionalUserInfo?.dob}
                              classNames={{
                                calendarContent:
                                  "min-w-64 [&_td>span:hover]:bg-[#c2f3ba] [&_td>span:hover]:text-[#3f7136] [&_td>span[data-selected='true']]:bg-[#58944d] [&_td>span[data-selected='true']]:text-white [&_td>span[data-selected='true']:hover]:bg-[#58944d] [&_td>span[data-selected='true']:hover]:text-white",
                              }}
                              className="date-picker mt-1 gap-2 [&>div:focus-within:hover]:border-[#F4D3BA] [&>div:focus-within]:border-[#F4D3BA] [&>div:hover]:border-[#F4D3BA] [&>div]:bg-white/20 [&[data-disabled='true']>div]:opacity-50 [&[data-disabled='true']]:opacity-100 [&_[data-slot='input-field']]:text-xs [&_[data-slot='input-field']]:font-semibold md:[&_[data-slot='input-field']]:text-[13px] [&_[data-slot='label']]:text-neutral-500"
                            />
                          )}
                        />
                        {errors.dob && (
                          <p className="text-xs font-semibold text-red-500">
                            {errors.dob?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
              <section className="w-full space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold md:text-lg">
                    Delivery Address
                  </h2>
                  {additionalUserInfo?.deliveryAddresses && (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-nowrap rounded-md bg-[#d4ffce] p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-[#bdf6b4]"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      <HiOutlineMapPin className="text-base" />
                      Select Address
                    </button>
                  )}
                </div>
                <Modal
                  isOpen={isAddressModalOpen}
                  onOpenChange={setIsAddressModalOpen}
                  size="2xl"
                  scrollBehavior="inside"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="uppercase">
                          Select Address
                        </ModalHeader>
                        <ModalBody>
                          {additionalUserInfo?.deliveryAddresses.map(
                            (address, addressIndex) => {
                              return (
                                <div
                                  key={address.id}
                                  className="w-full cursor-pointer space-y-4 rounded-md border-2 border-neutral-100 p-4 text-neutral-500 transition-[border-color] duration-300 ease-in-out hover:border-green-600/50 [&_:is(h3,h4)]:text-neutral-700 [&_h3]:text-base [&_h4]:text-sm [&_p]:text-[13px]"
                                  onClick={() => {
                                    setValue(
                                      "addressLineOne",
                                      address.addressLineOne,
                                    );
                                    setValue(
                                      "addressLineTwo",
                                      address.addressLineTwo,
                                    );
                                    setValue("postalCode", address.postalCode);
                                    setValue("city", address.city);
                                    setIsAddressModalOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-2 text-base font-semibold md:text-lg">
                                    <h3>
                                      Address #{addressIndex + 1}
                                      {!!address?.nickname
                                        ? ": " + address.nickname
                                        : ""}
                                    </h3>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                                      <div className="w-full space-y-2 font-semibold">
                                        <h4>Address Line 1</h4>
                                        <p>{address?.addressLineOne}</p>
                                      </div>
                                      <div className="w-full space-y-2 font-semibold">
                                        <h4>Address Line 2</h4>
                                        <p>{address?.addressLineTwo || "--"}</p>
                                      </div>
                                    </div>
                                    <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                                      <div className="w-full space-y-2 font-semibold">
                                        <h4>City</h4>
                                        <p>{address?.city}</p>
                                      </div>
                                      <div className="w-full space-y-2 font-semibold">
                                        <h4>Postal Code</h4>
                                        <p>{address?.postalCode}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          {/* <Button
                          onClick={handlePasswordReset}
                          className="rounded-lg bg-[#d4ffce] px-5 py-3 text-xs font-semibold text-neutral-600 !opacity-100 transition-[background-color,color] duration-300 hover:bg-[#bdf6b4] hover:text-neutral-700 md:text-sm"
                        >
                          Send Email
                        </Button> */}
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
                <div className="space-y-4">
                  <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                    <div className="w-full space-y-2 font-semibold">
                      <label htmlFor="address-one">Address Line 1</label>
                      <input
                        id="address-one"
                        // name="addressOne"
                        type="text"
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                        placeholder="House 123, Road 10, Block A"
                        {...register("addressLineOne", {
                          pattern: {
                            value: /^[a-zA-Z0-9,\-\s]+$/,
                            message:
                              "Address must not contain any special characters except for hyphens (-).",
                          },
                          required: {
                            value: true,
                            message: "Address line 1 is required.",
                          },
                        })}
                        required
                      />
                      {errors.addressLineOne && (
                        <p className="text-xs font-semibold text-red-500">
                          {errors.addressLineOne?.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full space-y-2 font-semibold">
                      <label htmlFor="address-two">Address Line 2</label>
                      <input
                        id="address-two"
                        // name="addressTwo"
                        type="text"
                        {...register("addressLineTwo", {
                          pattern: {
                            value: /^[a-zA-Z0-9,\-\s]+$/,
                            message:
                              "Address must not contain any special characters except for hyphens (-).",
                          },
                        })}
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                        placeholder="Dhanmondi, Dhaka 1209"
                      />
                      {errors.addressLineTwo && (
                        <p className="text-xs font-semibold text-red-500">
                          {errors.addressLineTwo?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                    <div className="w-full space-y-2 font-semibold">
                      {/* <label htmlFor="post-code">City</label> */}
                      <Controller
                        name="city"
                        control={control}
                        rules={{
                          required: "City is required.",
                        }}
                        render={({ field: { onChange, value } }) => (
                          // <TextInput
                          //   placeholder="First name"
                          //   onBlur={onBlur}
                          //   onChangeText={onChange}
                          //   value={value}
                          // />
                          <Autocomplete
                            isRequired
                            // name="city"
                            labelPlacement="outside"
                            label="City"
                            placeholder="Select city"
                            size="sm"
                            variant="bordered"
                            // onBlur={onBlur}
                            // selectedKey={selectedCity}
                            // onSelectionChange={(newSelectedCity) =>
                            //   setSelectedCity(newSelectedCity)
                            // }
                            selectedKey={value}
                            onSelectionChange={onChange}
                            className="select-with-search [&:has(input:focus)_[data-slot='input-wrapper']]:border-[#F4D3BA] [&_[data-slot='input-wrapper']]:bg-white/20 [&_[data-slot='input-wrapper']]:hover:border-[#F4D3BA] [&_label]:!text-neutral-500"
                          >
                            {cities.map((city) => {
                              return (
                                <AutocompleteItem key={city}>
                                  {city}
                                </AutocompleteItem>
                              );
                            })}
                          </Autocomplete>
                        )}
                      />
                      {errors.city && (
                        <p className="text-xs font-semibold text-red-500">
                          {errors.city?.message}
                        </p>
                      )}
                    </div>
                    {/*<div className="w-full font-semibold"> */}
                    {/* <label htmlFor="post-code">Area</label> */}
                    {/*<Autocomplete
                      isRequired
                      name="area"
                      labelPlacement="outside"
                      label="Area"
                      placeholder="Select area"
                      size="sm"
                      selectedKey={selectedLocation.area}
                      onSelectionChange={(newSelectedArea) => {
                        setSelectedLocation((prevSelectedLocation) => ({
                          ...prevSelectedLocation,
                          area: newSelectedArea,
                        }));
                      }}
                      className="select-with-search"
                      isDisabled={!selectedLocation.city}
                    >
                      {!!selectedLocation.city &&
                        cities[selectedLocation.city].map((area) => {
                          return (
                            <AutocompleteItem key={area}>
                              {area}
                            </AutocompleteItem>
                          );
                        })}
                    </Autocomplete>
                  </div>*/}
                    <div className="w-full space-y-2 font-semibold [&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-outer-spin-button]:appearance-none [&_input]:[-moz-appearance:textfield]">
                      <label htmlFor="postal-code">Post Code</label>
                      <input
                        id="postal-code"
                        // name="postalCode"
                        type="number"
                        {...register("postalCode", {
                          pattern: {
                            value: /^\d{4}$/,
                            message:
                              "Postal code must contain 4 numeric digits.",
                          },
                          required: {
                            value: true,
                            message: "Postal code is required.",
                          },
                        })}
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                        placeholder="1230"
                        required
                      />
                      {errors.postalCode && (
                        <p className="text-xs font-semibold text-red-500">
                          {errors.postalCode?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full space-y-2 font-semibold">
                    <label htmlFor="note">Note to Seller (If Any)</label>
                    {/* <input
                      id="note"
                      type="text"
                      {...register("note")}
                      className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                      // placeholder="An additional short message to delivery man or to us"
                    /> */}
                    <textarea
                      id="note"
                      {...register("note")}
                      rows={1}
                      // placeholder="An additional short message to delivery man or to us"
                      className="w-full resize-none rounded-lg border-2 border-neutral-200 bg-white/20 px-3 py-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                    ></textarea>
                    {errors.note && (
                      <p className="text-xs font-semibold text-red-500">
                        {errors.note?.message}
                      </p>
                    )}
                  </div>
                  {selectedCity === "Dhaka" && (
                    <div className="w-full space-y-2 font-semibold">
                      <p>Select Delivery Type</p>
                      <div className="payment-methods max-sm:space-y-4 sm:flex sm:gap-x-4">
                        <Tooltip
                          classNames={{
                            base: [
                              "max-w-[66.66dvw] min-[1200px]:max-w-[calc(((1200px*55/100)-16px-20px-20px)/2)]",
                              // arrow color
                              // "before:bg-neutral-400 dark:before:bg-white",
                            ],
                            content: [
                              "p-5 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
                              // "text-black bg-gradient-to-br from-white to-neutral-400",
                            ],
                          }}
                          motionProps={{
                            variants: {
                              exit: {
                                opacity: 0,
                                transition: {
                                  duration: 0.3,
                                  ease: "easeIn",
                                },
                              },
                              enter: {
                                opacity: 1,
                                transition: {
                                  duration: 0.3,
                                  ease: "easeOut",
                                },
                              },
                            },
                          }}
                          shouldFlip
                          showArrow={true}
                          content="After confirmation, you will get the delivery within 2-3 days with FREE of charge."
                        >
                          <input
                            className="!h-12 before:border-2 before:!border-neutral-900 before:!bg-[#020202] before:bg-[url('/delivery-partners/standard-delivery.webp')] before:grayscale before:invert before:backdrop-blur-2xl before:transition-all before:duration-300 before:ease-in-out checked:before:!bg-[#383804] checked:before:grayscale-0 hover:before:!border-transparent hover:before:!bg-[#383804] hover:before:grayscale-0"
                            // green inverted hex --> #2b0031
                            type="radio"
                            // name="deliveryType"
                            {...register("deliveryType", {
                              required: {
                                value: true,
                                message: "Select one of the delivery types.",
                              },
                            })}
                            id="standard-delivery"
                            value="standard-delivery"
                            required
                            // onClick={() =>
                            //   toast.success(
                            //     "As you've selected Standard Delivery, your shipping charge will be FREE!",
                            //   )
                            // }
                          />
                        </Tooltip>
                        <Tooltip
                          classNames={{
                            base: [
                              "max-w-[66.66dvw] min-[1200px]:max-w-[calc(((1200px*55/100)-16px-20px-20px)/2)]",
                              // arrow color
                              // "before:bg-neutral-400 dark:before:bg-white",
                            ],
                            content: [
                              "p-5 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
                              // "text-black bg-gradient-to-br from-white to-neutral-400",
                            ],
                          }}
                          motionProps={{
                            variants: {
                              exit: {
                                opacity: 0,
                                transition: {
                                  duration: 0.3,
                                  ease: "easeIn",
                                },
                              },
                              enter: {
                                opacity: 1,
                                transition: {
                                  duration: 0.3,
                                  ease: "easeOut",
                                },
                              },
                            },
                          }}
                          shouldFlip
                          showArrow={true}
                          content="After confirmation, you will get the delivery within 24 hours."
                        >
                          <input
                            className="!h-12 before:border-2 before:!border-neutral-900 before:!bg-[#020202] before:bg-[url('/delivery-partners/express-delivery.webp')] before:grayscale before:invert before:backdrop-blur-2xl before:transition-[background-color,filter] before:duration-300 before:ease-in-out checked:before:!bg-[#383804] checked:before:grayscale-0 hover:before:!border-transparent hover:before:!bg-[#383804] hover:before:grayscale-0"
                            // green inverted hex --> #2b0031
                            type="radio"
                            // name="deliveryType"
                            {...register("deliveryType", {
                              required: {
                                value: true,
                                message: "Select one of the delivery types.",
                              },
                            })}
                            id="express-delivery"
                            value="express-delivery"
                            required
                          />
                        </Tooltip>
                      </div>
                      {errors.deliveryType && (
                        <p className="text-xs font-semibold text-red-500">
                          {errors.deliveryType?.message}
                        </p>
                      )}
                    </div>
                  )}
                  {!!selectedCity && selectedCity !== "Dhaka" && (
                    <p className="text-xs lg:text-sm">
                      After confirmation, you will get the delivery within{" "}
                      {dhakaSuburbs.includes(selectedCity) ? "3-4" : "5-7"}{" "}
                      days.
                    </p>
                  )}
                  <div className="flex gap-x-2 [&_span]:text-xs lg:[&_span]:text-[13px]">
                    <Checkbox
                      className="[&_span:has(svg):after]:bg-[#d4ffce] [&_span:has(svg)]:text-neutral-700"
                      // defaultSelected
                      // isRequired
                      isSelected={isSaveAddressCheckboxSelected}
                      onValueChange={setIsSaveAddressCheckboxSelected}
                      // isInvalid={!isSaveAddressCheckboxSelected}
                    >
                      Save this information for future orders
                    </Checkbox>
                  </div>
                </div>
              </section>
              <section className="w-full space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-[padding-bottom] duration-300 ease-in-out">
                <h2 className="text-base font-semibold md:text-lg">
                  Promo Code
                </h2>
                <div className="flex gap-x-4">
                  <div className="relative w-full space-y-2">
                    <label className="text-nowrap" htmlFor="promo-code">
                      Have any promo code to apply?
                    </label>
                    <div className="relative">
                      <input
                        id="promo-code"
                        name="promoCode"
                        type="text"
                        autoComplete="off"
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs uppercase text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
                        onChange={(event) => {
                          const promoCodeCloseButton = document.getElementById(
                            "promo-code-close-btn",
                          );

                          promoCodeCloseButton.style.opacity = !event.target
                            .value
                            ? "0"
                            : "1";
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handlePromoCodeValidation();
                          } else {
                            const promoCodeMessageElement =
                              document.querySelector("#promo-code-message");
                            const sectionElement =
                              promoCodeMessageElement.parentElement
                                .parentElement.parentElement;

                            promoCodeMessageElement.style.opacity = "0";
                            promoCodeMessageElement.style.transform =
                              "scale(0)";
                            sectionElement.style.paddingBottom = "20px";

                            setUserPromoCode(undefined);
                          }
                        }}
                      />
                      <button
                        id="promo-code-close-btn"
                        className="absolute right-3 top-1/2 z-[1] flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 opacity-0 transition-[background-color,opacity] duration-300 ease-in-out hover:bg-neutral-300 [&>svg]:hover:text-neutral-800"
                        type="button"
                        onClick={() => {
                          document.querySelector("#promo-code").value = "";
                          const promoCodeCloseButton = document.getElementById(
                            "promo-code-close-btn",
                          );

                          promoCodeCloseButton.style.opacity = "0";
                          const promoCodeMessageElement =
                            document.querySelector("#promo-code-message");
                          const sectionElement =
                            promoCodeMessageElement.parentElement.parentElement
                              .parentElement;

                          promoCodeMessageElement.style.opacity = "0";
                          promoCodeMessageElement.style.transform = "scale(0)";
                          sectionElement.style.paddingBottom = "20px";

                          setUserPromoCode(undefined);
                        }}
                      >
                        <IoClose className="size-4 text-neutral-500 transition-[color] duration-300 ease-in-out" />
                      </button>
                    </div>
                    <p
                      id="promo-code-message"
                      className={`pointer-events-none absolute -bottom-6 left-0 scale-0 text-xs font-semibold opacity-0 transition-[transform,opacity] ${!!userPromoCode ? "text-green-600" : "text-red-600"}`}
                    >
                      {!!userPromoCode
                        ? "Promo code applied."
                        : "Invalid code."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePromoCodeValidation}
                    className="block h-fit w-full self-end rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
                  >
                    Apply
                  </button>
                </div>
              </section>
              <section
                className="w-full space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl"
                style={{
                  paddingBottom: !userPromoCode ? "20px" : "52px",
                }}
              >
                <h2 className="text-base font-semibold transition-[padding-bottom] duration-300 ease-in-out md:text-lg">
                  Select Payment Method
                </h2>
                {/* <p>Select your payment method below.</p> */}
                {/* <div className="payment-methods relative grid gap-2.5 sm:grid-cols-2">
                  <div
                    style={{
                      display:
                        !userPromoCode || !isBkashCashbackAvailable
                          ? "block"
                          : "none",
                    }}
                  >
                    <Tooltip
                      classNames={{
                        base: [
                          "max-w-[66.66dvw] min-[1200px]:max-w-[calc(((1200px*55/100)-16px-20px-20px)/2)]",
                          // arrow color
                          // "before:bg-neutral-400 dark:before:bg-white",
                        ],
                        content: [
                          "p-5 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
                          // "text-black bg-gradient-to-br from-white to-neutral-400",
                        ],
                      }}
                      motionProps={{
                        variants: {
                          exit: {
                            opacity: 0,
                            transition: {
                              duration: 0.3,
                              ease: "easeIn",
                            },
                          },
                          enter: {
                            opacity: 1,
                            transition: {
                              duration: 0.3,
                              ease: "easeOut",
                            },
                          },
                        },
                      }}
                      shouldFlip
                      showArrow={true}
                      content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti aspernatur placeat tempora."
                    >
                      <input
                        className={
                          isBkashCashbackAvailable
                            ? "before:bg-[url('/payment-methods/bkash-cashback-10.webp')]"
                            : "before:bg-[url('/payment-methods/bkash.png')]"
                        }
                        type="radio"
                        // name="paymentMethod"
                        {...register("paymentMethod", {
                          required: {
                            value: true,
                            message: "Select one of the payment methods.",
                          },
                        })}
                        id="bkash"
                        value="bkash"
                        required
                      />
                    </Tooltip>
                  </div>
                  <Tooltip
                    classNames={{
                      base: [
                        "max-w-[66.66dvw] min-[1200px]:max-w-[calc(((1200px*55/100)-16px-20px-20px)/2)]",
                        // arrow color
                        // "before:bg-neutral-400 dark:before:bg-white",
                      ],
                      content: [
                        "p-5 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
                        // "text-black bg-gradient-to-br from-white to-neutral-400",
                      ],
                    }}
                    motionProps={{
                      variants: {
                        exit: {
                          opacity: 0,
                          transition: {
                            duration: 0.3,
                            ease: "easeIn",
                          },
                        },
                        enter: {
                          opacity: 1,
                          transition: {
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        },
                      },
                    }}
                    shouldFlip
                    showArrow={true}
                    content="Lorem ipsum dolor sit, amet consectetur adipisicing elit.Error saepe eligendi quisquam quis iusto, facilis tempora praesentium! Voluptatibus, consequuntur praesentium."
                  >
                    <input
                      className="before:bg-[url('/payment-methods/mobile-banking.png')]"
                      type="radio"
                      // name="paymentMethod"
                      {...register("paymentMethod", {
                        required: {
                          value: true,
                          message: "Select one of the payment methods.",
                        },
                      })}
                      id="mobile-banking"
                      value="mobile-banking"
                      required
                    />
                  </Tooltip>
                  <Tooltip
                    classNames={{
                      base: [
                        "max-w-[66.66dvw] min-[1200px]:max-w-[calc(((1200px*55/100)-16px-20px-20px)/2)]",
                        // arrow color
                        // "before:bg-neutral-400 dark:before:bg-white",
                      ],
                      content: [
                        "p-5 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
                        // "text-black bg-gradient-to-br from-white to-neutral-400",
                      ],
                    }}
                    motionProps={{
                      variants: {
                        exit: {
                          opacity: 0,
                          transition: {
                            duration: 0.3,
                            ease: "easeIn",
                          },
                        },
                        enter: {
                          opacity: 1,
                          transition: {
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        },
                      },
                    }}
                    placement="bottom"
                    shouldFlip
                    showArrow={true}
                    content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, voluptatum soluta. Dicta ad natus totam."
                  >
                    <input
                      className="before:bg-[url('/payment-methods/cards.png')]"
                      type="radio"
                      // name="paymentMethod"
                      {...register("paymentMethod", {
                        required: {
                          value: true,
                          message: "Select one of the payment methods.",
                        },
                      })}
                      id="debit-credit-card"
                      value="debit-credit-card"
                      required
                    />
                  </Tooltip>
                  <Tooltip
                    classNames={{
                      base: [
                        "max-w-[66.66dvw] min-[1200px]:max-w-[calc(((1200px*55/100)-16px-20px-20px)/2)]",
                        // arrow color
                        // "before:bg-neutral-400 dark:before:bg-white",
                      ],
                      content: [
                        "p-5 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
                        // "text-black bg-gradient-to-br from-white to-neutral-400",
                      ],
                    }}
                    motionProps={{
                      variants: {
                        exit: {
                          opacity: 0,
                          transition: {
                            duration: 0.3,
                            ease: "easeIn",
                          },
                        },
                        enter: {
                          opacity: 1,
                          transition: {
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        },
                      },
                    }}
                    placement="bottom"
                    shouldFlip
                    showArrow={true}
                    content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore consectetur sed mollitia eius ab deserunt, et deleniti."
                  >
                    <input
                      className="before:bg-[url('/payment-methods/online-banking.png')]"
                      type="radio"
                      // name="paymentMethod"
                      {...register("paymentMethod", {
                        required: {
                          value: true,
                          message: "Select one of the payment methods.",
                        },
                      })}
                      id="online-banking"
                      value="online-banking"
                      required
                    />
                  </Tooltip>
                  {isBkashCashbackAvailable && (
                    <p
                      className={`pointer-events-none absolute left-0 text-xs transition-[transform,opacity] sm:text-[13px] ${!userPromoCode ? "scale-0 opacity-0" : "scale-100 opacity-100"} ${errors.paymentMethod ? "-bottom-[60px]" : "-bottom-7"}`}
                    >
                      Note: bKash is not applicable when promo code is applied.
                    </p>
                  )}
                </div> */}
                <div className="payment-methods relative grid gap-2.5 sm:grid-cols-2">
                  <div
                    style={{
                      display:
                        !userPromoCode || !isBkashCashbackAvailable
                          ? "block"
                          : "none",
                    }}
                  >
                    <input
                      className={
                        isBkashCashbackAvailable
                          ? "before:bg-[url('/payment-methods/bkash-cashback-10.webp')]"
                          : "before:bg-[url('/payment-methods/bkash.png')]"
                      }
                      type="radio"
                      // name="paymentMethod"
                      {...register("paymentMethod", {
                        required: {
                          value: true,
                          message: "Select one of the payment methods.",
                        },
                      })}
                      id="bkash"
                      value="bkash"
                      required
                    />
                  </div>
                  {/* <p className="text-xs md:text-[13px]"></p> */}
                  <input
                    className="before:bg-[url('/payment-methods/mobile-banking.png')]"
                    type="radio"
                    // name="paymentMethod"
                    {...register("paymentMethod", {
                      required: {
                        value: true,
                        message: "Select one of the payment methods.",
                      },
                    })}
                    id="mobile-banking"
                    value="mobile-banking"
                    required
                  />
                  <input
                    className="before:bg-[url('/payment-methods/cards.png')]"
                    type="radio"
                    // name="paymentMethod"
                    {...register("paymentMethod", {
                      required: {
                        value: true,
                        message: "Select one of the payment methods.",
                      },
                    })}
                    id="debit-credit-card"
                    value="debit-credit-card"
                    required
                  />
                  <input
                    className="before:bg-[url('/payment-methods/online-banking.png')]"
                    type="radio"
                    // name="paymentMethod"
                    {...register("paymentMethod", {
                      required: {
                        value: true,
                        message: "Select one of the payment methods.",
                      },
                    })}
                    id="online-banking"
                    value="online-banking"
                    required
                  />
                  {isBkashCashbackAvailable && (
                    <p
                      className={`pointer-events-none absolute left-0 text-xs transition-[transform,opacity] sm:text-[13px] ${!userPromoCode ? "scale-0 opacity-0" : "scale-100 opacity-100"} ${errors.paymentMethod ? "-bottom-[60px]" : "-bottom-7"}`}
                    >
                      Note: bKash is not applicable when promo code is applied.
                    </p>
                  )}
                </div>
                {errors.paymentMethod && (
                  <p className="text-xs font-semibold text-red-500">
                    {errors.paymentMethod?.message}
                  </p>
                )}
              </section>
            </form>
          </div>
          {/* ${!!userPromoCode ? "lg:top-[calc(100dvh-274px)]" : "lg:top-[calc(100dvh-244px)]"} ${!!selectedCity && (selectedCity !== "Dhaka" || !!selectedDeliveryType) ? "lg:top-[calc(100dvh-244px)]" : "lg:top-[calc(100dvh-180px)]"} */}
          <section className="relative bottom-5 top-5 h-full min-h-full w-full rounded-xl pt-5 font-semibold shadow-[0_0_20px_0_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:top-0 before:h-full before:w-full before:rounded-xl before:border-2 before:border-neutral-50/20 before:bg-white/40 before:backdrop-blur-2xl before:content-[''] lg:sticky lg:w-[calc(45%-16px/2)]">
            <div className="relative flex h-full min-h-full w-full flex-col justify-between">
              {!!cartItems?.length && (
                <div
                  className={`relative z-[1] space-y-4 px-5 pb-5 text-[13px] before:pointer-events-none before:absolute before:left-0 before:h-full before:w-full before:rounded-b-xl before:border-2 before:border-neutral-50/20 before:bg-white/50 before:backdrop-blur-2xl before:content-[''] max-lg:order-last md:text-sm lg:sticky ${!!userPromoCode && !!selectedCity && (selectedCity !== "Dhaka" || !!selectedDeliveryType) ? "lg:top-[calc(100dvh-274px)]" : !userPromoCode && !(!!selectedCity && (selectedCity !== "Dhaka" || !!selectedDeliveryType)) ? "lg:top-[calc(100dvh-180px)]" : !userPromoCode ? "lg:top-[calc(100dvh-244px)]" : "lg:top-[calc(100dvh-210px)]"} `}
                >
                  <hr className="relative z-[1] h-0.5 w-full bg-[#f1f1f1]" />
                  {/* <div className="absolute -left-5 -right-5 top-0 h-10 w-[calc(100%+40px)] -translate-y-1/2 bg-gradient-to-b from-transparent via-white to-white" /> */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between">
                      <h5 className="z-[1] text-neutral-500">Subtotal</h5>
                      <span className="z-[1]">
                        ৳{" "}
                        {cartItems
                          .reduce(
                            (accumulator, item) =>
                              (item.discount || item.price) *
                                item.selectedQuantity +
                              accumulator,
                            0,
                          )
                          .toLocaleString()}
                      </span>
                    </div>
                    {!!userPromoCode && (
                      <div className="flex justify-between">
                        <h5 className="z-[1] text-neutral-500">
                          Discount ({userPromoCode.code})
                        </h5>
                        <span className="z-[1]">
                          - ৳{" "}
                          {`${calculateDiscount().toLocaleString()}${
                            userPromoCode.discountType === "percentage"
                              ? ` (${userPromoCode.discountAmount.toLocaleString()}%)`
                              : ""
                          }`}
                        </span>
                      </div>
                    )}
                    {!!selectedCity &&
                      (selectedCity !== "Dhaka" || !!selectedDeliveryType) && (
                        <div className="flex justify-between">
                          <h5 className="z-[1] text-neutral-500">
                            Shipping Charge
                          </h5>
                          <span className="z-[1]">
                            {selectedCity === "Dhaka" &&
                            selectedDeliveryType === "standard-delivery"
                              ? "FREE"
                              : `৳ ${calculateShippingCharge()}`}
                          </span>
                        </div>
                      )}
                    {!!selectedCity &&
                      (selectedCity !== "Dhaka" || !!selectedDeliveryType) && (
                        <div className="flex justify-between text-sm text-neutral-700 md:text-base">
                          <h5 className="z-[1]">Payable Amount</h5>
                          <span className="z-[1]">
                            ৳ {calculateTotal().toLocaleString()}
                          </span>
                        </div>
                      )}
                  </div>
                  <hr className="h-0.5 w-full bg-[#f1f1f1]" />
                  <div
                    className={`flex gap-x-2 [&_a]:underline [&_a]:underline-offset-2 [&_span]:text-xs lg:[&_span]:text-[13px] ${isCheckboxSelected ? "[&_a]:text-[#57944e]" : "[&_a]:text-[#f31260]"}`}
                  >
                    <Checkbox
                      className="[&_span:has(svg):after]:bg-[#d4ffce] [&_span:has(svg)]:text-neutral-700"
                      defaultSelected
                      isRequired
                      isSelected={isCheckboxSelected}
                      onValueChange={setIsCheckboxSelected}
                      isInvalid={!isCheckboxSelected}
                    >
                      I have read and agree to the{" "}
                      <TransitionLink href={"/terms-and-condition"}>
                        terms and conditions
                      </TransitionLink>
                      ,{" "}
                      <TransitionLink href={"/privacy-policy"}>
                        privacy policy
                      </TransitionLink>
                      ,{" "}
                      <TransitionLink href={"/shipping-policy"}>
                        shipping policy
                      </TransitionLink>
                      , and{" "}
                      <TransitionLink href={"/refund-policy"}>
                        refund policy
                      </TransitionLink>
                      .
                    </Checkbox>
                  </div>
                  <button
                    onClick={() => handleSubmit(onSubmit, onError)()}
                    className="relative z-[1] w-full rounded-lg bg-[#d4ffce] py-2.5 text-xs text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
              {/* ${
                  !!cartItems?.length &&
                  (!!userPromoCode
                    ? "lg:-translate-y-[274px]"
                    : "lg:-translate-y-[244px]")
                } ${
                  !!selectedCity &&
                  (selectedCity !== "Dhaka" || !!selectedDeliveryType)
                    ? "lg:-translate-y-[244px]"
                    : "lg:-translate-y-[180px]"
                } */}
              <div
                className={`px-5 ${!!userPromoCode && !!selectedCity && (selectedCity !== "Dhaka" || !!selectedDeliveryType) ? "lg:-translate-y-[274px]" : !userPromoCode && !(!!selectedCity && (selectedCity !== "Dhaka" || !!selectedDeliveryType)) ? "lg:-translate-y-[180px]" : !userPromoCode ? "lg:-translate-y-[244px]" : "lg:-translate-y-[210px]"} `}
              >
                <h2 className="pb-5 text-lg font-semibold md:text-lg">
                  Cart Overview
                </h2>
                <ul className="mb-4 space-y-5">
                  {cartItems.map((cartItem, cartItemIndex) => {
                    return (
                      <li
                        key={cartItem + cartItemIndex}
                        className="flex w-full items-stretch justify-between gap-x-2.5"
                      >
                        <TransitionLink
                          href={`/product/${cartItem.title.split(" ").join("-").toLowerCase()}`}
                          className="relative block min-h-full w-1/4 overflow-hidden rounded-md bg-[#F0F0F0] max-sm:w-20"
                        >
                          <Image
                            className="h-full w-full object-contain"
                            src={cartItem.imgURL}
                            alt={cartItem.title}
                            fill
                            sizes="15vh"
                          />
                        </TransitionLink>
                        <div className="grow text-neutral-400">
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex justify-between gap-x-5">
                              <div>
                                <TransitionLink
                                  href={`/product/${cartItem.title.split(" ").join("-").toLowerCase()}`}
                                  className="underline-offset-1 hover:underline"
                                >
                                  <h4 className="line-clamp-1 text-neutral-600">
                                    {cartItem.title}
                                  </h4>
                                </TransitionLink>
                                <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                                  <h5>Unit Price:</h5>
                                  {/* <span>
                                ৳{" "}
                                {(
                                  cartItem.discount || cartItem.price
                                ).toLocaleString()}
                              </span> */}
                                  <div className="flex h-fit shrink-0 gap-x-1.5">
                                    <p
                                      className={
                                        !!cartItem.discount
                                          ? "relative h-fit before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:bg-neutral-400 before:content-['']"
                                          : ""
                                      }
                                    >
                                      ৳ {cartItem.price.toLocaleString()}
                                    </p>
                                    {!!cartItem.discount && (
                                      <p>
                                        ৳ {cartItem.discount.toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-[3px] flex gap-x-1.5 text-xs md:text-[13px]">
                                  <h5>Size:</h5>
                                  <span>{cartItem.selectedSize}</span>
                                </div>
                                <div className="mt-[3px] flex gap-x-1.5 text-xs md:text-[13px]">
                                  <h5>Color:</h5>
                                  <div className="flex items-center gap-x-1">
                                    <div
                                      style={{
                                        backgroundColor:
                                          cartItem.selectedColor.colorCode,
                                      }}
                                      className="size-3.5 rounded-full"
                                    />
                                    {cartItem.selectedColor.color}
                                  </div>
                                </div>
                              </div>
                              <span className="shrink-0 text-neutral-600">
                                ৳{" "}
                                {(
                                  (cartItem.discount || cartItem.price) *
                                  cartItem.selectedQuantity
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex grow items-end justify-between">
                              <div
                                className="mt-auto flex w-fit cursor-pointer items-center justify-between gap-x-1 font-semibold transition-[color] duration-300 ease-in-out hover:text-red-500"
                                onClick={() => {
                                  localStorage.setItem(
                                    "cartItems",
                                    JSON.stringify(
                                      cartItems.filter(
                                        (item) =>
                                          !(
                                            item.title === cartItem.title &&
                                            item.selectedSize ===
                                              cartItem.selectedSize &&
                                            item.selectedColor.color ===
                                              cartItem.selectedColor.color &&
                                            item.selectedColor.colorCode ===
                                              cartItem.selectedColor.colorCode
                                          ),
                                      ),
                                    ),
                                  );
                                  window.dispatchEvent(
                                    new Event("storageCart"),
                                  );
                                }}
                              >
                                <CgTrash className="text-sm" />
                                <p className="text-xs">Remove</p>
                              </div>
                              <div className="mt-auto flex gap-x-1.5 text-neutral-500 [&>*]:!m-0 [&>*]:grid [&>*]:size-8 [&>*]:place-content-center [&>*]:rounded-md [&>*]:border-2 [&>*]:border-neutral-200 [&>*]:bg-white/20 [&>*]:!p-0 [&>*]:text-center [&>*]:backdrop-blur-2xl [&>*]:transition-[background-color,border-color] [&>*]:duration-300 [&>*]:ease-in-out sm:[&>*]:rounded-lg">
                                <button
                                  className="transition-[background-color,border-color] hover:border-transparent hover:bg-[#FBEDE2]"
                                  type="button"
                                  onClick={() => {
                                    let prevQuantity =
                                      cartItems[cartItemIndex].selectedQuantity;
                                    cartItems[cartItemIndex].selectedQuantity =
                                      prevQuantity !== 1
                                        ? prevQuantity - 1
                                        : prevQuantity;
                                    localStorage.setItem(
                                      "cartItems",
                                      JSON.stringify(cartItems),
                                    );
                                    window.dispatchEvent(
                                      new Event("storageCart"),
                                    );
                                  }}
                                >
                                  <HiChevronLeft />
                                </button>
                                <input
                                  className="w-fit text-center font-semibold outline-none transition-[border-color] [-moz-appearance:textfield] focus:border-[#F4D3BA] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                  type="number"
                                  arial-label="Quantity"
                                  min={1}
                                  max={cartItem.inStock}
                                  value={cartItem.selectedQuantity}
                                  defaultValue={cartItem.selectedQuantity}
                                  onChange={(event) => {
                                    cartItems[cartItemIndex].selectedQuantity =
                                      event.target.value < 1
                                        ? 1
                                        : event.target.value > cartItem.inStock
                                          ? cartItem.inStock
                                          : event.target.value;

                                    localStorage.setItem(
                                      "cartItems",
                                      JSON.stringify(cartItems),
                                    );
                                    window.dispatchEvent(
                                      new Event("storageCart"),
                                    );
                                  }}
                                />
                                <button
                                  className="transition-[background-color,border-color] hover:border-transparent hover:bg-[#FBEDE2]"
                                  type="button"
                                  onClick={() => {
                                    let prevQuantity =
                                      cartItems[cartItemIndex].selectedQuantity;
                                    cartItems[cartItemIndex].selectedQuantity =
                                      prevQuantity !== cartItem.inStock
                                        ? Number(prevQuantity) + 1
                                        : prevQuantity;
                                    localStorage.setItem(
                                      "cartItems",
                                      JSON.stringify(cartItems),
                                    );
                                    window.dispatchEvent(
                                      new Event("storageCart"),
                                    );
                                  }}
                                >
                                  <HiChevronRight />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-112px-24px)] flex-col items-center justify-center [&>*]:w-fit">
          <TbShoppingCartExclamation className="size-24 text-[#F4D3BA]" />
          <p className="mt-2 text-neutral-400">The cart is empty.</p>
          <TransitionLink
            href="/shop"
            className="mt-9 block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
          >
            Return to Shop
          </TransitionLink>
        </div>
      )}
    </main>
  );
}
