import { useEffect, useRef, useState } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { cities } from "@/app/data/cities";
import FormEditorButton from "./FormEditorButton";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { useLoading } from "@/app/contexts/loading";

export default function DeliveryAddress({
  addresses,
  setAdditionalUserInfo,
  address,
  addressNumber,
  type,
  setIsAddingNewAddress,
  newAddressIndex,
}) {
  const { setIsPageLoading } = useLoading();
  const [isEditingForm, setIsEditingForm] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nickname: "",
      addressLineOne: "",
      addressLineTwo: "",
      city: "",
      postalCode: "",
    },
    mode: "onBlur",
  });

  const handleAddressDelete = () => {
    setIsPageLoading(true);

    setAdditionalUserInfo((prevInfo) => ({
      ...prevInfo,
      deliveryAddresses: addresses.filter(
        (availableAddress) => availableAddress.id !== address.id,
      ),
    }));

    setIsPageLoading(false);
  };

  const handleAddressReset = () => {
    if (type === "new")
      reset({
        nickname: "",
        addressLineOne: "",
        addressLineTwo: "",
        city: "",
        postalCode: "",
      });
    else
      reset({
        nickname: address.nickname || "",
        addressLineOne: address.addressLineOne || "",
        addressLineTwo: address.addressLineTwo || "--",
        city: address.city || "",
        postalCode: address.postalCode || "",
      });
  };

  // const [selectedCity, setSelectedCity] = useState(address?.city);
  // const nicknameRef = useRef(null),
  //   addressLineOneRef = useRef(null),
  //   addressLineTwoRef = useRef(null),
  //   postalCodeRef = useRef(null);

  useEffect(() => handleAddressReset(), [address, type]);

  useEffect(() => {
    if (isEditingForm && !address.addressLineTwo)
      setValue("addressLineTwo", "");
  }, [isEditingForm]);

  const onSubmit = (data) => {
    setIsPageLoading(true);

    if (data.addressLineTwo === "--") data.addressLineTwo = "";

    if (type === "new") {
      setIsAddingNewAddress(false);

      setAdditionalUserInfo((prevInfo) => ({
        ...prevInfo,
        deliveryAddresses: [
          ...prevInfo.deliveryAddresses,
          {
            id: Math.random().toString(16).slice(2),
            nickname: data.nickname,
            addressLineOne: data.addressLineOne,
            addressLineTwo: data.addressLineTwo,
            city: data.city,
            postalCode: data.postalCode,
          },
        ],
      }));

      toast.success("New delivery address added successfully.");
      setIsPageLoading(false);
    } else {
      if (
        address.nickname === data.nickname &&
        address.addressLineOne === data.addressLineOne &&
        address.addressLineTwo === data.addressLineTwo &&
        address.city === data.city &&
        address.postalCode === data.postalCode
      ) {
        toast.error("Not saved as no changes were made.");
        setIsPageLoading(false);
        return setIsEditingForm(false);
      }

      setAdditionalUserInfo((prevInfo) => ({
        ...prevInfo,
        deliveryAddresses: prevInfo.deliveryAddresses.map((availableAddress) =>
          availableAddress.id === address.id
            ? {
                id: availableAddress.id,
                nickname: data.nickname,
                addressLineOne: data.addressLineOne,
                addressLineTwo: data.addressLineTwo,
                city: data.city,
                postalCode: data.postalCode,
              }
            : availableAddress,
        ),
      }));

      toast.success("Delivery address updated successfully.");
      setIsEditingForm(false);
      setIsPageLoading(false);
    }
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern"))
      toast.error("Please provide valid information.");
    else toast.error("Something went wrong. Please try again.");
  };

  // useEffect(() => {
  //   if (nicknameRef?.current && address)
  //     nicknameRef.current.value = address.nickname;
  //   if (addressLineOneRef?.current && address)
  //     addressLineOneRef.current.value = address.addressLineOne;
  //   if (addressLineTwoRef?.current && address)
  //     addressLineTwoRef.current.value = address.addressLineTwo;
  //   if (address) setSelectedCity(address.city);
  //   if (postalCodeRef?.current && address)
  //     postalCodeRef.current.value = address.postalCode;
  // }, [isEditingForm, address]);

  useEffect(() => {
    if (!(type === "update" && !isEditingForm)) {
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
    }
  }, [type, isEditingForm]);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, onError)}
      className="w-full space-y-4 rounded-md border-2 border-[#eeeeee] p-3.5 sm:p-5"
      id={type === "new" ? "new-adddress-form" : "update-address-form"}
    >
      <div className="flex justify-between gap-4 lg:items-center">
        <div className="flex w-full gap-2 text-base font-semibold max-lg:flex-col md:text-lg lg:items-center">
          <div className="flex items-end justify-between">
            <label
              htmlFor="nickname"
              className="text-nowrap !text-[17px] lg:!text-lg"
            >
              Address #
              {type === "new"
                ? newAddressIndex + ":"
                : `${addressNumber}${!!address?.nickname || isEditingForm ? ":" : ""}`}
            </label>
            <div className="lg:hidden">
              <FormEditorButton
                reset={reset}
                isEditingForm={isEditingForm}
                setIsEditingForm={setIsEditingForm}
                type={type}
                setIsAddingNewAddress={setIsAddingNewAddress}
                handleAddressDelete={handleAddressDelete}
                handleAddressReset={handleAddressReset}
              />
            </div>
          </div>
          <input
            id="nickname"
            type="text"
            // value={
            //   type !== "new" && !isEditingForm
            //     ? address?.nickname
            //     : undefined
            // }
            // defaultValue={
            //   type === "new"
            //     ? undefined
            //     : isEditingForm
            //       ? address?.nickname
            //       : address?.nickname || "--"
            // }
            readOnly={type === "update" && !isEditingForm}
            {...register("nickname")}
            // className={`-mb-0.5 border-b-2 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 ${
            //   !isEditingForm && type !== "new" && !address?.nickname
            //     ? "hidden"
            //     : isEditingForm || type === "new"
            //       ? "w-full border-neutral-300 focus:border-neutral-400"
            //       : "w-fit border-transparent !text-neutral-700"
            // }`}
            className="!text-[17px] lg:!text-lg"
            placeholder={
              type === "update" && !isEditingForm ? "" : "Address nickname"
            }
            autoComplete="off"
          />
        </div>
        <div className="max-lg:hidden">
          <FormEditorButton
            reset={reset}
            isEditingForm={isEditingForm}
            setIsEditingForm={setIsEditingForm}
            type={type}
            setIsAddingNewAddress={setIsAddingNewAddress}
            handleAddressDelete={handleAddressDelete}
            handleAddressReset={handleAddressReset}
          />
        </div>
      </div>
      <div className="space-y-8 max-lg:space-y-4">
        <div className="max-lg:space-y-4 lg:flex lg:gap-x-10">
          <div className="w-full space-y-2 font-semibold">
            <label htmlFor="address-one">Address Line 1</label>
            {/* <input
              ref={addressLineOneRef}
              id="address-one"
              name="addressLineOne"
              type="text"
              value={
                type !== "new" && !isEditingForm
                  ? address?.addressLineOne || "--"
                  : undefined
              }
              defaultValue={
                type === "new"
                  ? undefined
                  : isEditingForm
                    ? address?.addressLineOne
                    : address?.addressLineOne || "--"
              }
              placeholder="House 123, Road 10, Block A"
              required
              readOnly={type === "update" && !isEditingForm}
            /> */}
            <input
              id="address-one"
              type="text"
              readOnly={type === "update" && !isEditingForm}
              placeholder="House 13, Road 10, Block A"
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
              // className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
            />
            {errors.addressLineOne && (
              <p className="text-xs font-semibold text-red-500">
                {errors.addressLineOne?.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-2 font-semibold">
            <label htmlFor="address-two">Address Line 2</label>
            {/* <input
              ref={addressLineTwoRef}
              id="address-two"
              name="addressLineTwo"
              type="text"
              value={
                type !== "new" && !isEditingForm
                  ? address?.addressLineTwo || "--"
                  : undefined
              }
              defaultValue={
                type === "new"
                  ? undefined
                  : isEditingForm
                    ? address?.addressLineTwo
                    : address?.addressLineTwo || "--"
              }
              placeholder="Dhanmondi, Dhaka 1209"
              readOnly={type === "update" && !isEditingForm}
            /> */}
            <input
              id="address-two"
              type="text"
              readOnly={type === "update" && !isEditingForm}
              placeholder="Dhanmondi, Dhaka 1209"
              {...register("addressLineTwo", {
                pattern: {
                  value: /^[a-zA-Z0-9,\-\s]+$/,
                  message:
                    "Address must not contain any special characters except for hyphens (-).",
                },
              })}
              // className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
            />
            {errors.addressLineTwo && (
              <p className="text-xs font-semibold text-red-500">
                {errors.addressLineTwo?.message}
              </p>
            )}
          </div>
        </div>
        <div className="max-lg:space-y-4 lg:flex lg:gap-x-10">
          <div className="w-full space-y-2 font-semibold">
            <Controller
              name="city"
              control={control}
              rules={{
                required: "City is required.",
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  isReadOnly={type === "update" && !isEditingForm}
                  isDisabled={type === "update" && !isEditingForm}
                  labelPlacement="outside"
                  label="City"
                  placeholder="Select city"
                  size="sm"
                  variant="bordered"
                  selectedKey={value}
                  onSelectionChange={onChange}
                  className="select-with-search w-full [&:has(input:focus)_[data-slot='input-wrapper']]:border-[#F4D3BA] [&:has(input:focus)_[data-slot='input-wrapper']]:bg-white/75 [&>div]:opacity-100 [&_[data-slot='input-wrapper']]:bg-white/20 [&_[data-slot='input-wrapper']]:shadow-none [&_[data-slot='input-wrapper']]:backdrop-blur-2xl [&_[data-slot='input-wrapper']]:backdrop-opacity-100 [&_[data-slot='input-wrapper']]:hover:border-[#F4D3BA] [&_label]:!text-neutral-500"
                >
                  {cities.map((city) => {
                    return (
                      <AutocompleteItem key={city}>{city}</AutocompleteItem>
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
          <div className="w-full space-y-2 font-semibold [&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-outer-spin-button]:appearance-none [&_input]:[-moz-appearance:textfield]">
            <label htmlFor="postal-code">Postal Code</label>
            {/* <input
              ref={postalCodeRef}
              id="postal-code"
              name="postalCode"
              type="number"
              value={
                type !== "new" && !isEditingForm
                  ? address?.postalCode || "--"
                  : undefined
              }
              defaultValue={
                type === "new"
                  ? undefined
                  : isEditingForm
                    ? address?.postalCode
                    : address?.postalCode || "--"
              }
              placeholder="1230"
              required
              readOnly={type === "update" && !isEditingForm}
            /> */}
            <input
              id="postal-code"
              type="number"
              readOnly={type === "update" && !isEditingForm}
              placeholder="1230"
              {...register("postalCode", {
                pattern: {
                  value: /^\d{4}$/,
                  message: "Postal code must contain 4 numeric digits.",
                },
                required: {
                  value: true,
                  message: "Postal code is required.",
                },
              })}
            />
            {errors.postalCode && (
              <p className="text-xs font-semibold text-red-500">
                {errors.postalCode?.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
