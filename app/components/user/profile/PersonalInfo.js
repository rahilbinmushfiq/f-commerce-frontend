import { useLoading } from "@/app/contexts/loading";
import { cities } from "@/app/data/cities";
import { Autocomplete, AutocompleteItem, DatePicker } from "@nextui-org/react";
import { useState, useEffect } from "react";
// import FormEditorButton from "./FormEditorButton";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import Loader from "@/app/components/layout/Loader";
// import { sendEmailVerification } from "firebase/auth";
// import toast from "react-hot-toast";
// import createErrorMessage from "@/app/utils/createErrorMessage";
import { RiCloseLine, RiEditLine, RiSaveLine } from "react-icons/ri";

export default function PersonalInfo({
  user,
  additionalUserInfo,
  setAdditionalUserInfo,
}) {
  const { setIsPageLoading } = useLoading();
  const [isEditingForm, setIsEditingForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      altPhoneNumber: "",
      hometown: "",
      dob: null,
    },
    mode: "onBlur",
  });

  // const [countdown, setCountdown] = useState(0);
  // const [isPageLoading, setIsPageLoading] = useState(false);

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
    reset({
      name: user?.displayName || "",
      email: user?.email || "",
      phoneNumber: additionalUserInfo.phoneNumber || "--",
      altPhoneNumber: additionalUserInfo.altPhoneNumber || "--",
      hometown: additionalUserInfo.hometown || "--",
      dob: additionalUserInfo.dob || null,
    });
  }, [user, additionalUserInfo]);

  useEffect(() => {
    if (
      isEditingForm &&
      (!additionalUserInfo.phoneNumber ||
        !additionalUserInfo.altPhoneNumber ||
        !additionalUserInfo.hometown ||
        !additionalUserInfo.dob)
    ) {
      reset({
        name: user?.displayName,
        email: user?.email,
        phoneNumber: !additionalUserInfo.phoneNumber
          ? ""
          : additionalUserInfo.phoneNumber,
        altPhoneNumber: !additionalUserInfo.altPhoneNumber
          ? ""
          : additionalUserInfo.altPhoneNumber,
        hometown: !additionalUserInfo.hometown
          ? ""
          : additionalUserInfo.hometown,
        dob: !additionalUserInfo.dob ? null : additionalUserInfo.dob,
      });
    }
  }, [isEditingForm]);

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

    console.log("rhf dob age", age);
    return age;
  };

  const onSubmit = (data) => {
    setIsPageLoading(true);

    if (data.phoneNumber === "--") data.phoneNumber = "";
    if (data.altPhoneNumber === "--") data.altPhoneNumber = "";
    if (data.city === "--") data.city = "";

    if (
      additionalUserInfo.phoneNumber === data.phoneNumber &&
      additionalUserInfo.altPhoneNumber === data.altPhoneNumber &&
      additionalUserInfo.hometown === data.hometown &&
      additionalUserInfo.dob === data.dob
    ) {
      toast.error("Not saved as no changes were made.");
      return setIsEditingForm(false);
    }

    console.log("rhf dob", data.dob);

    setAdditionalUserInfo((prevInfo) => ({
      ...prevInfo,
      phoneNumber: data.phoneNumber,
      altPhoneNumber: data.altPhoneNumber,
      hometown: data.hometown,
      dob: data.dob,
    }));

    toast.success("Personal information updated successfully.");
    setIsEditingForm(false);
    setIsPageLoading(false);
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern"))
      toast.error("Please provide valid information.");
    else toast.error("Something went wrong. Please try again.");
  };

  return (
    <section className="w-full rounded-md border-2 border-[#eeeeee] p-3.5 sm:p-5">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[17px] font-semibold uppercase sm:text-lg md:text-xl">
            Personal Information
          </h2>
          {isEditingForm ? (
            <div className="flex gap-2.5">
              <button className="flex items-center gap-1.5 rounded-md bg-[#d4ffce] p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] max-sm:[&_p]:hidden max-sm:[&_svg]:size-4">
                <RiSaveLine className="text-base" />
                <p>Save</p>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-sm:[&_p]:hidden max-sm:[&_svg]:size-4"
                onClick={() => {
                  reset({
                    name: user?.displayName,
                    email: user?.email,
                    phoneNumber: additionalUserInfo.phoneNumber || "--",
                    altPhoneNumber: additionalUserInfo.altPhoneNumber || "--",
                    hometown: additionalUserInfo.hometown || "--",
                    dob: additionalUserInfo.dob || null,
                  });
                  setIsEditingForm(false);
                }}
              >
                <RiCloseLine className="text-base" />
                <p>Cancel</p>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-sm:[&_p]:hidden max-sm:[&_svg]:size-4"
              onClick={() => setIsEditingForm(true)}
            >
              <RiEditLine className="text-base" />
              <p>Edit</p>
            </button>
          )}
        </div>
        <div className="space-y-8">
          <div className="max-sm:space-y-4 sm:flex sm:gap-x-10">
            <div className="w-full space-y-2 font-semibold">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                disabled={isEditingForm}
                readOnly={!isEditingForm}
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
              <input
                id="email"
                type="email"
                disabled={isEditingForm}
                readOnly={!isEditingForm}
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
              />
              {errors.email && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.email?.message}
                </p>
              )}
            </div>
          </div>
          <div className="max-sm:space-y-4 sm:flex sm:gap-x-10">
            <div className="w-full space-y-2 font-semibold">
              <label htmlFor="primary-mobile">Mobile Number</label>
              <input
                id="primary-mobile"
                type="tel"
                placeholder="01XXXXXXXXX"
                readOnly={!isEditingForm}
                {...register("phoneNumber", {
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
              />
              {errors.phoneNumber && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.phoneNumber?.message}
                </p>
              )}
            </div>
            <div className="w-full space-y-2 font-semibold">
              <label htmlFor="alt-mobile">Alternative Mobile Number</label>
              <input
                id="alt-mobile"
                placeholder="01XXXXXXXXX"
                readOnly={!isEditingForm}
                {...register("altPhoneNumber", {
                  pattern: {
                    value: /^01\d{9}$/,
                    message: "Mobile number is invalid.",
                  },
                })}
                onInput={(event) =>
                  (event.target.value = event.target.value.replace(/\D/g, ""))
                }
              />
              {errors.altPhoneNumber && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.altPhoneNumber?.message}
                </p>
              )}
            </div>
          </div>
          <div className="max-sm:space-y-4 sm:flex sm:gap-x-10">
            <div className="relative w-full space-y-2 font-semibold">
              <Controller
                name="hometown"
                control={control}
                rules={{
                  required: "Hometown is required.",
                }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    isReadOnly={
                      !!additionalUserInfo?.hometown || !isEditingForm
                    }
                    isDisabled={
                      !!additionalUserInfo?.hometown || !isEditingForm
                    }
                    isRequired
                    labelPlacement="outside"
                    label="Hometown"
                    placeholder="Select hometown"
                    size="sm"
                    variant="bordered"
                    selectedKey={value}
                    onSelectionChange={onChange}
                    className={`select-with-search w-full [&:has(input:focus)_[data-slot='input-wrapper']]:border-[#F4D3BA] [&:has(input:focus)_[data-slot='input-wrapper']]:bg-white/75 [&_[data-disabled='true']]:opacity-100 [&_[data-disabled='true']_[data-slot='inner-wrapper']]:opacity-50 [&_[data-slot='input-wrapper']]:bg-white/20 [&_[data-slot='input-wrapper']]:shadow-none [&_[data-slot='input-wrapper']]:backdrop-blur-2xl [&_[data-slot='input-wrapper']]:backdrop-opacity-100 [&_[data-slot='input-wrapper']]:hover:border-[#F4D3BA] [&_label]:!text-neutral-500 ${isEditingForm || additionalUserInfo?.hometown ? "[&_[data-slot='inner-wrapper']]:!opacity-100" : "[&_[data-slot='inner-wrapper']]:!opacity-0"}`}
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
              <p
                className={`absolute left-0 top-9 -translate-y-1/2 font-semibold text-neutral-700 transition-opacity duration-100 ease-in-out ${!isEditingForm && !additionalUserInfo?.hometown ? "opacity-100" : "opacity-0"}`}
              >
                --
              </p>
              {errors.hometown && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.hometown?.message}
                </p>
              )}
            </div>
            <div className="relative w-full space-y-2 font-semibold">
              <Controller
                name="dob"
                control={control}
                rules={{
                  required: "Date of birth is required.",
                  validate: (value) => {
                    const age = calculateAge(value);
                    if (age < 13) return "You must be at least 13 years old";
                    if (age > 120)
                      return "Age cannot be more than 120 years old";
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    isReadOnly={!!additionalUserInfo?.dob || !isEditingForm}
                    isDisabled={!!additionalUserInfo?.dob || !isEditingForm}
                    id="dob"
                    labelPlacement="outside"
                    label="Date of Birth"
                    showMonthAndYearPickers
                    variant="bordered"
                    value={value}
                    onChange={onChange}
                    classNames={{
                      calendarContent:
                        "min-w-64 [&_td>span:hover]:bg-[#c2f3ba] [&_td>span:hover]:text-[#3f7136] [&_td>span[data-selected='true']]:bg-[#58944d] [&_td>span[data-selected='true']]:text-white [&_td>span[data-selected='true']:hover]:bg-[#58944d] [&_td>span[data-selected='true']:hover]:text-white",
                    }}
                    className={`date-picker mt-1 gap-1 transition-opacity duration-300 ease-in-out [&>div:focus-within:hover]:border-[#F4D3BA] [&>div:focus-within]:border-[#F4D3BA] [&>div:hover]:border-[#F4D3BA] [&>div]:bg-white/20 [&[data-disabled='true']>div]:opacity-50 [&[data-disabled='true']]:opacity-100 [&_[data-slot='input-field']]:font-semibold [&_[data-slot='label']]:!text-sm [&_[data-slot='label']]:text-neutral-500 md:[&_[data-slot='label']]:!text-sm ${isEditingForm || additionalUserInfo?.dob ? "[&>div]:!opacity-100" : "[&>div]:!opacity-0"}`}
                  />
                )}
              />
              <p
                className={`absolute left-0 top-9 -translate-y-1/2 font-semibold text-neutral-700 transition-opacity duration-100 ease-in-out ${!isEditingForm && !additionalUserInfo?.dob ? "opacity-100" : "opacity-0"}`}
              >
                --
              </p>
              {errors.dob && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.dob?.message}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* {isPageLoading && <Loader />} */}
      </form>
    </section>
  );
}
