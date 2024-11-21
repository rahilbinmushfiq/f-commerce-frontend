"use client";

// import { useAuth } from "@/app/contexts/auth";
import TransitionLink from "@/app/components/ui/TransitionLink";
import {
  LuArrowRight,
  LuBox,
  LuDownload,
  LuFileText,
  LuTruck,
} from "react-icons/lu";
import { orders } from "@/app/data/orders";
import {
  HiCheckCircle,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArchiveBoxXMark,
} from "react-icons/hi2";
import { IoCheckmarkCircle, IoReturnDownBack } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Checkbox,
  // useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import TrackingCode from "@/app/components/orders/TrackingCode";
import fileUploadSVG from "@/public/return-order/upload.svg";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { MdCancel } from "react-icons/md";
import { useLoading } from "@/app/contexts/loading";

export default function Orders() {
  // const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [userOrders, setUserOrders] = useState(orders);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeTrackOrder, setActiveTrackOrder] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [activeReturnOrder, setActiveReturnOrder] = useState(null);
  const [isPolicyChecked, setIsPolicyChecked] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [proofImages, setProofImages] = useState([]);
  // const [files, setFiles] = useState(null);
  const [isFormSubmissionRequested, setIsFormSubmissionRequested] =
    useState(false);
  const imgInputRef = useRef();
  const issues = {
    faulty: [
      "Defective Fabric",
      "Color Fading",
      "Loose Threads/Stitching",
      "Damaged Zipper/Buttons",
      "Misalignment/Uneven Parts",
    ],
    wrong: ["Wrong Size", "Wrong Color", "Wrong Product"],
  };

  const {
    register,
    watch,
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reason: "",
      issue: "",
      items: [],
      images: "",
      description: "",
    },
    mode: "onBlur",
  });

  const { append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedReason = !watch("reason")
    ? ""
    : watch("reason").values().next().value;

  const selectedIssue = !watch("issue")
    ? ""
    : watch("issue").values().next().value;

  const returnItems = watch("items");

  useEffect(() => setValue("issue", ""), [selectedReason]);

  const calculateReturnAmount = () => {
    return returnItems
      .reduce(
        (accumulator, returnItem, returnItemIndex) =>
          !returnItem.isRequested
            ? accumulator
            : accumulator +
              activeReturnOrder.items[returnItemIndex].price *
                returnItem.quantity,
        0,
      )
      .toLocaleString();
  };

  const updateDropZoneStyles = (event, state) => {
    const dropZoneElement = event.currentTarget;
    const uploadImageElement = event.currentTarget.querySelector("img");

    if (state === "enter") {
      dropZoneElement.style.borderColor = "#a1c99c";
      dropZoneElement.style.backgroundColor = "#fafff9";
      uploadImageElement.style.opacity = "1";
    } else {
      dropZoneElement.style.borderColor = "#e5e5e5";
      dropZoneElement.style.backgroundColor = "transparent";
      uploadImageElement.style.opacity = "0.6";
    }
  };

  const validateFiles = (uploadedFiles) => {
    // console.log("check proofImages", [...proofImages]);
    // console.log("check uploadedFiles", uploadedFiles);
    // 1. At least one file must be uploaded
    if (!uploadedFiles.length) {
      return "At least one image is required!";
    }

    // if (uploadedFiles.some(uploadedFile => !uploadedFile.type.startsWith("image/")))
    //   return "Only image formats are allowed.";

    // if (uploadedFiles.some(uploadedFile => proofImages.includes(uploadedFile)))
    //   return "Duplicate images are not allowed.";

    // const fileNames = new Set();

    // if (proofImages.length > 5) return "You cannot upload more than 5 images";

    for (let uploadedFile of uploadedFiles) {
      // 3. Only image formats are allowed
      if (!uploadedFile.type.startsWith("image/")) {
        return "Only image formats are allowed.";
      }

      // 4. Duplicate images are not allowed (by name)
      if (
        proofImages.some((proofImage) => proofImage.name === uploadedFile.name)
      ) {
        return "Duplicate images are not allowed.";
      }
      // fileNames.add(uploadedFile.name);

      // 5. Max file size for each image is 10 MB
      if (uploadedFile.size > 10 * 1024 * 1024 /* 10 MB */) {
        return `The file ${uploadedFile.name} exceeds the 10MB size limit.`;
      }
    }

    // 2. Maximum 5 files
    if (proofImages.length + uploadedFiles.length > 5) {
      return "You can upload up to 5 images.";
    }

    setProofImages((prevImages) => [
      ...new Set([...prevImages, ...uploadedFiles]),
    ]);

    return true;
  };

  const onSubmit = (data) => {
    setIsPageLoading(true);

    console.log("rhf data", data);

    if (!isPolicyChecked)
      return toast.error("You must agree with the return policy.");

    setUserOrders((prevOrders) =>
      prevOrders.map((prevOrder) =>
        prevOrder.id === activeReturnOrder.id
          ? {
              ...prevOrder,
              status: {
                text: "Return Requested",
                bgColor: "bg-red-100",
                textColor: "text-red-600",
              },
            }
          : prevOrder,
      ),
    );

    toast.success("Return request has been sent.");
    setIsReturnModalOpen(false);
    setIsPageLoading(false);
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    console.log("errorTypes", errorTypes);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern") || errorTypes.includes("minLength"))
      toast.error("Please provide valid information.");
    else if (errorTypes.includes("notValidFiles"))
      toast.error("Please provide the required images.");
    else toast.error("Something went wrong. Please try again.");
  };

  useEffect(() => {
    if (!isReturnModalOpen) {
      reset();
      // remove();
      setProofImages([]);
    }
  }, [isReturnModalOpen]);

  return (
    <section className="bottom-5 top-5 grow auto-rows-max rounded-xl border-2 border-neutral-50/20 bg-white/60 p-3.5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl lg:sticky xl:p-5 [&_img]:pointer-events-none">
      {!!userOrders.length ? (
        <>
          <h1 className="mb-5 text-lg font-bold uppercase md:text-xl">
            Order History
          </h1>
          <div className="max-xl:space-y-4 xl:grid xl:grid-cols-2 xl:gap-4">
            {userOrders.map((order) => {
              return (
                <div
                  key={order.id}
                  className="h-fit w-full rounded-md border-2 border-neutral-300 p-3.5 text-sm xl:p-5"
                >
                  <div className="mb-4 items-start justify-between gap-2 max-sm:space-y-2 sm:flex">
                    <h2 className="text-sm font-semibold md:text-base">
                      Order #{order.id}
                    </h2>
                    <div
                      className={`w-fit text-nowrap rounded-md px-2 py-1.5 text-xs font-semibold max-sm:ml-auto ${order.status.bgColor} ${order.status.textColor}`}
                    >
                      {order.status.text === "Shipped"
                        ? "On Its Way"
                        : order.status.text}
                    </div>
                  </div>
                  <div className="space-y-2 [&>div]:flex [&>div]:justify-between [&>div]:gap-4 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:font-semibold sm:[&_h4]:text-nowrap">
                    <div>
                      <h4>Date & Time</h4>
                      <p className="text-right">
                        {order.date.split(" ")[0].slice(0, 3)}
                        <span className="max-sm:hidden">
                          {order.date.split(" ")[0].slice(3)}
                        </span>
                        {" " + order.date.split(" ").slice(1).join(" ")},{" "}
                        {order.time}
                      </p>
                    </div>
                    <div>
                      <h4>Payment Method</h4>
                      <p className="text-right">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <h4>Paid Amount</h4>
                      <p className="text-right">
                        ৳ {order.paidAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2.5">
                    <TransitionLink
                      href={`/user/orders/${order.id}`}
                      className="flex items-center gap-2 rounded-lg bg-[#ffddc2] px-4 py-2.5 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#fbcfb0] max-sm:w-full max-sm:justify-center"
                    >
                      View Details
                      <LuFileText size={14} />
                    </TransitionLink>
                    <TransitionLink
                      href={order.invoiceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] max-sm:w-full max-sm:justify-center"
                    >
                      Invoice
                      <LuDownload size={14} />
                    </TransitionLink>
                    {(order.status.text === "Processing" ||
                      order.status.text === "Shipped") && (
                      <button
                        className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-neutral-200 max-sm:w-full max-sm:justify-center"
                        onClick={() => {
                          setActiveTrackOrder(order);
                          setIsTrackModalOpen(true);
                        }}
                      >
                        Track
                        <LuTruck size={14} />
                      </button>
                    )}
                    {order.isReturnable &&
                      order.status.text !== "Return Requested" && (
                        <button
                          className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-neutral-200 max-sm:w-full max-sm:justify-center"
                          onClick={() => {
                            // remove();

                            // order.items.forEach((item) => {
                            //   append({
                            //     isRequested: false,
                            //     quantity: item.selectedQuantity,
                            //   });
                            // });

                            setValue(
                              "items",
                              Array.from(order.items, (item) => ({
                                isRequested: false,
                                quantity: item.selectedQuantity,
                              })),
                            );

                            setActiveReturnOrder(order);
                            setIsReturnModalOpen(true);
                          }}
                        >
                          Return
                          <IoReturnDownBack size={14} />
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
            <Modal
              isOpen={isTrackModalOpen}
              onOpenChange={setIsTrackModalOpen}
              size="xl"
            >
              <ModalContent>
                {() => (
                  <>
                    <ModalHeader className="uppercase">
                      Track Order Overview
                    </ModalHeader>
                    <ModalBody className="space-y-5 py-6">
                      <div className="grid grid-cols-3">
                        <div className="flex flex-col items-center [&>div]:mt-3 [&>p]:mt-1.5">
                          <Image
                            src="/order-tracking/processing.svg"
                            alt="Processing"
                            width={52}
                            height={52}
                          />
                          <div
                            className={`relative flex size-full items-center justify-center text-[#60d251] after:absolute after:right-[2px] after:top-1/2 after:h-0.5 after:w-[calc(50%-24px/2)] after:-translate-y-1/2 after:border-t-[2px] after:border-dotted after:content-[''] ${activeTrackOrder?.status.text === "Shipped" ? "after:border-[#60d251]" : "after:border-neutral-400"}`}
                          >
                            {activeTrackOrder?.status.text === "Processing" ||
                            activeTrackOrder?.status.text === "Shipped" ||
                            activeTrackOrder?.status.text === "Delivered" ? (
                              <IoCheckmarkCircle className="size-6" />
                            ) : (
                              <div className="size-4 rounded-full ring-2 ring-neutral-400" />
                            )}
                          </div>
                          <p className="text-xs font-semibold">Processing</p>
                        </div>
                        <div className="flex flex-col items-center [&>div]:mt-3 [&>p]:mt-1.5">
                          <Image
                            src="/order-tracking/shipped.svg"
                            alt="Shipped"
                            width={52}
                            height={52}
                          />
                          <div
                            className={`relative flex size-full items-center justify-center text-[#60d251] before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-[calc(50%-24px/2)] before:-translate-y-1/2 before:border-t-[2px] before:border-dotted before:border-[#60d251] before:content-[''] after:absolute after:right-[2px] after:top-1/2 after:h-0.5 after:w-[calc(50%-24px/2)] after:-translate-y-1/2 after:border-t-[2px] after:border-dotted after:border-[#60d251] after:content-[''] ${activeTrackOrder?.status.text === "Shipped" ? "before:border-[#60d251]" : "before:border-neutral-400"} ${activeTrackOrder?.status.text === "Delivered" ? "after:border-[#60d251]" : "after:border-neutral-400"}`}
                          >
                            {activeTrackOrder?.status.text === "Shipped" ||
                            activeTrackOrder?.status.text === "Delivered" ? (
                              <IoCheckmarkCircle className="size-6" />
                            ) : (
                              <div className="size-4 rounded-full ring-2 ring-neutral-400" />
                            )}
                          </div>
                          <p className="text-xs font-semibold">Shipped</p>
                        </div>
                        <div className="flex flex-col items-center [&>div]:mt-3 [&>p]:mt-1.5">
                          <Image
                            src="/order-tracking/delivered.svg"
                            alt="Delivered"
                            width={52}
                            height={52}
                          />
                          <div
                            className={`relative flex size-full items-center justify-center text-[#60d251] before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-[calc(50%-24px/2)] before:-translate-y-1/2 before:border-t-[2px] before:border-dotted before:border-[#60d251] before:content-[''] ${activeTrackOrder?.status.text === "Delivered" ? "before:border-[#60d251]" : "before:border-neutral-400"}`}
                          >
                            {activeTrackOrder?.status.text === "Delivered" ? (
                              <IoCheckmarkCircle className="size-6" />
                            ) : (
                              <div className="size-4 rounded-full ring-2 ring-neutral-400" />
                            )}
                          </div>
                          <p className="text-xs font-semibold">Delivered</p>
                        </div>
                      </div>
                      <div className="space-y-3 rounded-md border-2 border-neutral-200 p-3 text-sm sm:px-5 sm:py-4 [&>div]:flex [&>div]:justify-between [&>div]:gap-3 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:font-semibold [&_h4]:text-neutral-600 sm:[&_h4]:text-nowrap">
                        <div>
                          <h4>Expected Delivery</h4>
                          <p className="text-right">October 23, 2024</p>
                        </div>
                        <div>
                          <h4>Current Status</h4>
                          <p className="text-right">
                            {activeTrackOrder?.status.text === "Shipped"
                              ? "On Its Way"
                              : activeTrackOrder?.status.text}
                          </p>
                        </div>
                        <TrackingCode
                          trackingCode={
                            activeTrackOrder?.shipment?.trackingCode
                          }
                        />
                      </div>
                      {!!activeTrackOrder?.shipment?.trackingCode && (
                        <TransitionLink
                          href="/order-tracking"
                          className="mx-auto my-9 flex w-fit items-center gap-2 rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm font-semibold text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
                        >
                          Track Your Package
                          <LuBox size={17} />
                        </TransitionLink>
                      )}
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isReturnModalOpen}
              onOpenChange={setIsReturnModalOpen}
              size="xl"
              scrollBehavior="inside"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="uppercase">
                      Return Request (Order #{activeReturnOrder.id})
                    </ModalHeader>
                    <ModalBody className="-mt-5">
                      <p className="mb-5 text-sm text-neutral-500">
                        You can request for return if you found any issue with
                        our products. Please submit the following form with the
                        necessary details and we&apos;ll get back to you as soon
                        as possible.
                      </p>
                      <form
                        className="space-y-8 [&_label]:text-neutral-700"
                        noValidate
                        onSubmit={(event) => {
                          event.preventDefault();

                          if (!isFormSubmissionRequested)
                            setIsFormSubmissionRequested(true);

                          handleSubmit(onSubmit, onError)();
                        }}
                      >
                        <div className="max-sm:space-y-9 sm:flex sm:gap-x-4">
                          <div className="w-full space-y-3 font-semibold">
                            {/* <label htmlFor="reason">Reason</label> */}
                            <Controller
                              name="reason"
                              id="reason"
                              control={control}
                              rules={{
                                required: "Reason is required.",
                              }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  // isRequired
                                  variant="bordered"
                                  labelPlacement="outside"
                                  label="Reason"
                                  placeholder="Select a reason"
                                  className={`select-without-search [&_button[data-focus='true']]:border-[#F4D3BA] [&_button[data-hover='true']]:border-[#F4D3BA] [&_button[data-open='true']]:border-[#F4D3BA] [&_button]:!h-11 [&_button]:rounded-lg [&_label]:top-[calc(50%-4px)] [&_label]:!text-base [&_label]:!text-neutral-700 ${!selectedReason ? "[&_span[data-slot='value']]:text-neutral-500" : "[&_span[data-slot='value']]:text-neutral-700"}`}
                                  selectedKey={value}
                                  onSelectionChange={onChange}
                                >
                                  <SelectItem key="Faulty Product">
                                    Faulty Product
                                  </SelectItem>
                                  <SelectItem key="Wrong Item">
                                    Wrong Item
                                  </SelectItem>
                                  <SelectItem key="Others">Others</SelectItem>
                                </Select>
                              )}
                            />
                            {errors.reason && (
                              <p className="text-xs font-semibold text-red-500">
                                {errors.reason?.message}
                              </p>
                            )}
                          </div>
                          {!!selectedReason && selectedReason !== "Others" && (
                            <div className="w-full space-y-3 font-semibold">
                              {/* <label htmlFor="reason">Issue</label> */}
                              <Controller
                                name="issue"
                                id="issue"
                                control={control}
                                rules={{
                                  required: "Issue is required.",
                                }}
                                render={({ field: { onChange, value } }) => (
                                  <Select
                                    // isRequired
                                    variant="bordered"
                                    labelPlacement="outside"
                                    label="Specific Issue"
                                    placeholder="Select a specific issue"
                                    className={`select-without-search [&_button[data-focus='true']]:border-[#F4D3BA] [&_button[data-hover='true']]:border-[#F4D3BA] [&_button[data-open='true']]:border-[#F4D3BA] [&_button]:!h-11 [&_button]:rounded-lg [&_label]:top-[calc(50%-4px)] [&_label]:!text-base [&_label]:!text-neutral-700 ${!selectedIssue ? "[&_span[data-slot='value']]:text-neutral-500" : "[&_span[data-slot='value']]:text-neutral-700"}`}
                                    selectedKey={value}
                                    onSelectionChange={onChange}
                                  >
                                    {(selectedReason === "Faulty Product"
                                      ? issues.faulty
                                      : issues.wrong
                                    ).map((issue) => (
                                      <SelectItem key={issue}>
                                        {issue}
                                      </SelectItem>
                                    ))}
                                  </Select>
                                )}
                              />
                              {errors.issue && (
                                <p className="text-xs font-semibold text-red-500">
                                  {errors.issue?.message}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        {selectedReason === "Others" && (
                          <div className="w-full space-y-3 font-semibold">
                            <label htmlFor="description">
                              Brief Description
                            </label>
                            <textarea
                              {...register("description", {
                                required: "Brief description is required.",
                                minLength: {
                                  value: 50,
                                  message:
                                    "Brief description must have at least 50 characters.",
                                },
                              })}
                              rows={5}
                              placeholder="Provide a brief description"
                              className="w-full resize-none rounded-lg border-2 border-[#ededed] px-3 py-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-sm"
                            ></textarea>
                            {errors.description && (
                              <p className="text-xs font-semibold text-red-500">
                                {errors.description.message}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="w-full space-y-3 font-semibold">
                          <div className="items-start justify-between gap-2 max-sm:space-y-2 sm:flex sm:items-center">
                            <label>Select the Products with Issues</label>
                            {returnItems.some(
                              (returnItem) => returnItem.isRequested,
                            ) && (
                              <p className="w-fit text-[13px] font-normal max-sm:ml-auto">
                                Refund Amount: ৳ {calculateReturnAmount()}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            {activeReturnOrder.items.map((item, index) => {
                              const returnItem = returnItems[index];

                              return (
                                <div
                                  key={item.title}
                                  className={`flex w-full cursor-pointer items-stretch justify-between gap-x-2.5 rounded-lg border-2 p-2 transition-[border-color] duration-300 ease-in-out hover:border-[#F4D3BA] ${returnItem.isRequested ? "border-[#bedab9]" : "border-neutral-100"}`}
                                  onClick={(event) => {
                                    const tagName =
                                      event.target.tagName.toLowerCase();

                                    if (
                                      !(
                                        tagName == "input" ||
                                        tagName == "button" ||
                                        tagName == "svg" ||
                                        tagName == "path"
                                      )
                                    )
                                      setValue(
                                        `items.${index}.isRequested`,
                                        !returnItem.isRequested,
                                      );
                                  }}
                                >
                                  <div
                                    // href={`/product/${item.id}`}
                                    className="relative min-h-full w-1/4 overflow-hidden rounded-md bg-[#F0F0F0] max-sm:w-20"
                                  >
                                    <Image
                                      className="h-full w-full object-contain"
                                      src={item.imgURL}
                                      alt={item.title}
                                      fill
                                      sizes="15vh"
                                    />
                                  </div>
                                  <div className="grow text-neutral-400">
                                    <div className="flex items-stretch justify-between gap-x-5">
                                      <div>
                                        {/* <TransitionLink
                                          href={`/product/${item.id}`}
                                          className="underline-offset-1 hover:underline"
                                        > */}
                                        <h4 className="line-clamp-1 text-neutral-600">
                                          {item.title}
                                        </h4>
                                        {/* </TransitionLink> */}
                                        <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                                          <h5>Price:</h5>
                                          <span>
                                            ৳ {item.price.toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="mt-[3px] flex gap-x-1.5 text-xs md:text-[13px]">
                                          <h5>Size:</h5>
                                          <span>{item.selectedSize}</span>
                                        </div>
                                        <div className="mt-[3px] flex gap-x-1.5 text-xs md:text-[13px]">
                                          <h5>Color:</h5>
                                          <div className="flex items-center gap-x-1">
                                            <div
                                              style={{
                                                backgroundColor:
                                                  item.selectedColor.colorCode,
                                              }}
                                              className="size-3.5 rounded-full"
                                            />
                                            {item.selectedColor.color}
                                          </div>
                                        </div>
                                      </div>
                                      {/* <span className="shrink-0 text-neutral-600">
                                          ৳{" "}
                                          {(
                                            (item.discount || item.price) *
                                            item.selectedQuantity
                                          ).toLocaleString()}
                                        </span> */}
                                      <div className="flex min-h-full flex-col items-end justify-between">
                                        <HiCheckCircle
                                          className={`pointer-events-none size-7 text-[#60d251] transition-opacity duration-300 ease-in-out ${returnItem.isRequested ? "opacity-100" : "opacity-0"}`}
                                        />
                                        <div className="flex gap-x-1.5 text-neutral-500 [&>*]:!m-0 [&>*]:grid [&>*]:size-8 [&>*]:place-content-center [&>*]:rounded-md [&>*]:border-2 [&>*]:border-neutral-200 [&>*]:!p-0 [&>*]:text-center [&>*]:transition-[background-color,border-color] [&>*]:duration-300 [&>*]:ease-in-out sm:[&>*]:rounded-lg">
                                          <button
                                            className="transition-[background-color,border-color] hover:border-transparent hover:bg-[#FBEDE2]"
                                            type="button"
                                            onClick={() => {
                                              setValue(
                                                `items.${index}.quantity`,
                                                Number(returnItem.quantity) !==
                                                  1
                                                  ? returnItem.quantity - 1
                                                  : returnItem.quantity,
                                              );
                                            }}
                                          >
                                            <HiChevronLeft />
                                          </button>
                                          <input
                                            className="w-fit !bg-transparent text-center font-semibold outline-none transition-[border-color] [-moz-appearance:textfield] focus:border-[#F4D3BA] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                            type="number"
                                            // arial-label="Quantity"
                                            // value={item.selectedQuantity}
                                            // defaultValue={item.selectedQuantity}
                                            {...register(
                                              `items.${index}.quantity`,
                                              {
                                                min: 1,
                                                max: item.selectedQuantity,
                                                onChange: (value) => {
                                                  setValue(
                                                    `items.${index}.quantity`,
                                                    value < 1
                                                      ? 1
                                                      : value >
                                                          item.selectedQuantity
                                                        ? item.selectedQuantity
                                                        : value,
                                                    { shouldValidate: true },
                                                  );
                                                },
                                              },
                                            )}
                                          />
                                          <button
                                            className="transition-[background-color,border-color] hover:border-transparent hover:bg-[#FBEDE2]"
                                            type="button"
                                            onClick={() => {
                                              setValue(
                                                `items.${index}.quantity`,
                                                Number(returnItem.quantity) !==
                                                  Number(item.selectedQuantity)
                                                  ? Number(
                                                      returnItem.quantity,
                                                    ) + 1
                                                  : returnItem.quantity,
                                              );
                                            }}
                                          >
                                            <HiChevronRight />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    {...register(`items.${index}.isRequested`, {
                                      validate: (value) =>
                                        value ||
                                        returnItems.some(
                                          (returnItem) =>
                                            returnItem.isRequested,
                                        ) ||
                                        "At least one product must be selected.",
                                    })}
                                  />
                                </div>
                              );
                            })}
                            {/* {Object.entries(errors).find(([key]) =>
                              key.endsWith("checkbox"),
                            )?.[1] && (
                              <p className="text-xs font-semibold text-red-500">
                                {
                                  Object.entries(errors).find(([key]) =>
                                    key.endsWith("checkbox"),
                                  )?.[1]?.message
                                }
                              </p>
                            )} */}
                            {errors.items && (
                              <p className="text-xs font-semibold text-red-500">
                                {errors.items[0].isRequested.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-full space-y-3 font-semibold">
                          <label htmlFor="description">
                            Upload Images with Proof
                          </label>
                          <div
                            className="cursor-pointer rounded-lg border-3 border-dashed border-neutral-200 px-5 py-8 transition-[border-color,background-color] duration-300 ease-in-out"
                            onDrop={(event) => {
                              event.preventDefault();
                              if (isFormSubmissionRequested)
                                setIsFormSubmissionRequested(false);

                              const inputElement =
                                event.currentTarget.querySelector("input");

                              inputElement.files = event.dataTransfer.files;
                              inputElement.dispatchEvent(
                                new Event("change", { bubbles: true }),
                              );
                            }}
                            onDragOver={(event) => {
                              event.preventDefault();
                              updateDropZoneStyles(event, "enter");
                            }}
                            onDragLeave={(event) =>
                              updateDropZoneStyles(event, "leave")
                            }
                            onMouseEnter={(event) =>
                              updateDropZoneStyles(event, "enter")
                            }
                            onMouseLeave={(event) =>
                              updateDropZoneStyles(event, "leave")
                            }
                            onClick={(event) => {
                              if (isFormSubmissionRequested)
                                setIsFormSubmissionRequested(false);

                              const inputElement =
                                event.currentTarget.querySelector("input");
                              inputElement.value = "";
                              inputElement.click();
                            }}
                          >
                            <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                              <Image
                                src={fileUploadSVG}
                                alt="Upload image"
                                className="size-16 opacity-60 transition-opacity duration-300 ease-in-out"
                              />
                              <p className="text-[13px]">
                                <span className="text-[#57944e] underline underline-offset-2 transition-[color] duration-300 ease-in-out hover:text-[#6cb461]">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-[11px]">
                                Maximum file size is 10 MB
                              </p>
                            </div>
                            <input
                              id="img-input"
                              type="file"
                              ref={imgInputRef}
                              {...register("images", {
                                onChange: () => trigger("images"),
                                required: "At least one image is required.",
                                validate: {
                                  notValidFiles: (files) =>
                                    !isFormSubmissionRequested
                                      ? validateFiles(files)
                                      : !proofImages.length
                                        ? "At least one image is required."
                                        : true,
                                },
                              })}
                              multiple
                              hidden
                            />
                          </div>
                          {errors.images && (
                            <p className="text-xs font-semibold text-red-500">
                              {errors.images?.message}
                            </p>
                          )}
                          {!!proofImages?.length && (
                            <ul className="!mb-8 !mt-5 flex flex-wrap gap-x-2 gap-y-5">
                              {Array.from(proofImages).map((image, index) => (
                                <li
                                  className="relative"
                                  key={image.name + index}
                                >
                                  <div className="relative size-20">
                                    <Image
                                      src="/return-order/shirt-whole.webp"
                                      alt={`Image for proof ${index + 1}`}
                                      className="size-20 rounded-md object-cover"
                                      fill
                                      sizes="80px"
                                    />
                                  </div>
                                  <MdCancel
                                    className="absolute right-0 top-0 size-[22px] -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full bg-white text-red-500 transition-[color] duration-300 ease-in-out hover:text-red-600"
                                    onClick={() =>
                                      setProofImages(
                                        [...proofImages].filter(
                                          (proofImage) =>
                                            proofImage.name !== image.name,
                                        ),
                                      )
                                    }
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div
                          className={`flex gap-x-2 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-[color] [&_a]:duration-300 [&_a]:ease-in-out [&_span]:text-xs lg:[&_span]:text-[13px] ${isPolicyChecked ? "[&_a]:text-[#57944e] hover:[&_a]:text-[#6cb461]" : "[&_a]:text-[#f31260]"}`}
                        >
                          <Checkbox
                            className="[&_span:has(svg):after]:bg-[#d4ffce] [&_span:has(svg)]:text-neutral-700"
                            defaultSelected
                            isRequired
                            isSelected={isPolicyChecked}
                            onValueChange={setIsPolicyChecked}
                            isInvalid={!isPolicyChecked}
                          >
                            I have read and agree to the{" "}
                            <TransitionLink href="/return-policy">
                              Return Policy
                            </TransitionLink>
                            {"."}
                          </Checkbox>
                        </div>
                      </form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        type="button"
                        color="danger"
                        variant="light"
                        onPress={onClose}
                      >
                        Close
                      </Button>
                      <Button
                        type="submit"
                        onClick={(event) => {
                          event.preventDefault();

                          // if (errors?.images?.type === "notValidFiles")
                          //   clearErrors("images");
                          if (!isFormSubmissionRequested)
                            setIsFormSubmissionRequested(true);
                          // await trigger();
                          handleSubmit(onSubmit, onError)();
                        }}
                        className="rounded-lg bg-[#d4ffce] px-5 py-3 text-xs font-semibold text-neutral-600 !opacity-100 transition-[background-color,color] duration-300 hover:bg-[#bdf6b4] hover:text-neutral-700 md:text-sm"
                      >
                        Submit
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <HiOutlineArchiveBoxXMark className="size-24 text-[#F4D3BA]" />
          <p className="mt-2 text-neutral-400">
            You haven&apos;t placed any order yet.
          </p>
          <TransitionLink
            href="/shop"
            className="mt-9 block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
          >
            Return to Shop
          </TransitionLink>
        </div>
      )}
    </section>
  );
}
