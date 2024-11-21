"use client";

import { useEffect, useState } from "react";
import { products } from "@/app/data/products";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight, HiOutlineShare } from "react-icons/hi2";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import {
  CgHeart,
  CgRuler,
  CgShoppingCart,
  CgArrowsExpandRight,
  CgChevronRight,
  CgChevronLeft,
  CgArrowRight,
  CgArrowLeft,
  CgClose,
  CgChevronUp,
  CgChevronDown,
} from "react-icons/cg";
import {
  FaSquareFacebook,
  FaInstagram,
  FaXTwitter,
  FaFacebookMessenger,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa6";
import { LuBadge } from "react-icons/lu";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineNewReleases } from "react-icons/md";
import { TbRosetteDiscount } from "react-icons/tb";
import TransitionLink from "@/app/components/ui/TransitionLink";
import thunderShape from "@/public/shapes/thunder-with-stroke.svg";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import curvedDottedLineShape from "@/public/shapes/curved-dotted-line-4 (1).svg";
import AddToCart from "@/app/components/shop/AddToCart";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function ProductDetails({ params: { slug } }) {
  const product = products.find(
    (product) => product.title.split(" ").join("-").toLowerCase() === slug,
  );

  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedAddToCartProduct, setSelectedAddToCartProduct] =
    useState(null);
  const pathname = usePathname();
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.origin + pathname);
    }
  }, [pathname]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy the link.");
    }
  };

  const handleAddToWishlist = (product) => {
    const currentWishlistItems =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    if (!currentWishlistItems.some((item) => item.title === product.title)) {
      const newlyAddedItem = {
        title: product.title,
        price: product.price,
        discount: product.discount?.finalPrice,
        imgURL: product.imageURLs[0],
      };

      const updatedWishlistItems = JSON.stringify([
        ...currentWishlistItems,
        newlyAddedItem,
      ]);

      localStorage.setItem("wishlistItems", updatedWishlistItems);
      toast.success("Item added to wishlist.");
    } else {
      toast.error("Item is already in the wishlist.");
    }

    window.dispatchEvent(new Event("storageWishlist"));
  };

  useEffect(() => {
    if (!recentlyViewedProducts.length) {
      let storedRecentlyViewedProducts = JSON.parse(
        localStorage.getItem("recentlyViewedProducts"),
      );

      if (!storedRecentlyViewedProducts)
        localStorage.setItem(
          "recentlyViewedProducts",
          JSON.stringify([product.title]),
        );
      else if (!storedRecentlyViewedProducts.includes(product.title)) {
        if (storedRecentlyViewedProducts.length === 9)
          storedRecentlyViewedProducts.pop();
        storedRecentlyViewedProducts.unshift(product.title);
        localStorage.setItem(
          "recentlyViewedProducts",
          JSON.stringify(storedRecentlyViewedProducts),
        );
      }

      if (storedRecentlyViewedProducts) {
        let updatedList = [];

        storedRecentlyViewedProducts.forEach((prod) => {
          updatedList.push(products.find((product) => product.title === prod));
        });

        setRecentlyViewedProducts(updatedList);
      }
    }
  }, [recentlyViewedProducts]);

  product.images = [
    {
      color: "Blue",
      colorCode: "#293253",
      imageURLs: [
        "/single-product/blue-1-main.jpeg",
        "/single-product/blue-2.jpeg",
        "/single-product/blue-3.jpeg",
        "/single-product/blue-4.jpeg",
        "/single-product/blue-5.jpeg",
        "/single-product/blue-6.jpeg",
      ],
    },
    {
      color: "Red",
      colorCode: "#7E3844",
      imageURLs: [
        "/single-product/red-1-main.jpg",
        "/single-product/red-2.jpg",
        "/single-product/red-3.jpg",
        "/single-product/red-4.jpg",
        "/single-product/red-5.jpg",
        "/single-product/red-6.jpg",
      ],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    colorIndex: 0,
    sizeIndex: undefined,
    quantity: 1,
  });
  const [tabsSection, setTabsSection] = useState({
    selectedTabIndex: 0,
    options: ["Description", "Size & Fit", "Material & Care"],
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [numOfTimesThumbnailsMoved, setNumOfTimesThumbnailsMoved] = useState(0);
  const TOTAL_IMAGES_OF_SELECTED_ACTIVE_COLOR =
    product.images[selectedOptions.colorIndex].imageURLs.length;
  const NUMBER_OF_THUMBNAILS_VISIBLE = 4;
  const MAX_NUM_OF_TIMES_THUMBNAILS_ALLOWED_TO_MOVED =
    TOTAL_IMAGES_OF_SELECTED_ACTIVE_COLOR - NUMBER_OF_THUMBNAILS_VISIBLE;
  const similarProducts = products
    .filter(
      (availableProduct) =>
        availableProduct.categories.mainCategory ===
          product.categories.mainCategory &&
        !!availableProduct.inStock &&
        availableProduct.title !== product.title,
    )
    .slice(0, 8);
  const [isSimilarProductsSlid, setIsSimilarProductsSlid] = useState(false);
  const [isRecentlyViewedProductsSlid, setIsRecentlyViewedProductsSlid] =
    useState(false);

  useEffect(() => {
    document.body.style.overflow = isImageExpanded ? "hidden" : "unset";
  }, [isImageExpanded]);

  useEffect(() => {
    const imageContainers = document.querySelectorAll(".img-container");
    let hoverTimer;

    const onMouseEnter = (event) => {
      let counter = 1,
        prevCount = 0;
      const images = event.currentTarget.querySelectorAll("img");

      hoverTimer = setInterval(() => {
        images[prevCount].style.opacity = "0";
        images[counter].style.opacity = "1";

        prevCount = counter;
        counter = counter === images.length - 1 ? 0 : ++counter;
      }, 1000);
    };

    const onMouseLeave = (event) => {
      clearInterval(hoverTimer);

      const images = event.currentTarget.querySelectorAll("img");

      images.forEach((image, imageIndex) => {
        if (imageIndex === 0) image.style.opacity = "1";
        else image.style.opacity = "0";
      });
    };

    imageContainers.forEach((imageContainer) => {
      imageContainer.addEventListener("mouseenter", onMouseEnter);
      imageContainer.addEventListener("mouseleave", onMouseLeave);
    });

    imageContainers.forEach((imageContainer) => {
      return () => {
        imageContainer.removeEventListener("mouseenter", onMouseEnter);
        imageContainer.removeEventListener("mouseleave", onMouseLeave);
        if (hoverTimer) clearTimeout(hoverTimer);
      };
    });
  }, [recentlyViewedProducts]);

  const handleAddToCart = () => {
    if (selectedOptions.sizeIndex !== undefined) {
      const currentCartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      let updatedCartItems;

      if (
        currentCartItems.some(
          (item) =>
            item.title === product.title &&
            item.selectedSize === product.sizes[selectedOptions.sizeIndex] &&
            item.selectedColor.color ===
              product.images[selectedOptions.colorIndex].color &&
            item.selectedColor.colorCode ===
              product.images[selectedOptions.colorIndex].colorCode,
        )
      ) {
        const indexOfExistingItem = currentCartItems.findIndex(
          (item) =>
            item.title === product.title &&
            item.selectedSize === product.sizes[selectedOptions.sizeIndex] &&
            item.selectedColor.color ===
              product.images[selectedOptions.colorIndex].color &&
            item.selectedColor.colorCode ===
              product.images[selectedOptions.colorIndex].colorCode,
        );

        currentCartItems[indexOfExistingItem].selectedQuantity =
          Number(currentCartItems[indexOfExistingItem].selectedQuantity) + 1;
        updatedCartItems = JSON.stringify(currentCartItems);
      } else {
        const newlyAddedItem = {
          title: product.title,
          price: product.price,
          discount: product.discount?.finalPrice,
          imgURL: product.imageURLs[0],
          inStock: product.inStock,
          selectedQuantity: selectedOptions.quantity,
          selectedSize: product.sizes[selectedOptions.sizeIndex],
          selectedColor: {
            color: product.images[selectedOptions.colorIndex].color,
            colorCode: product.images[selectedOptions.colorIndex].colorCode,
          },
        };

        updatedCartItems = JSON.stringify([
          ...currentCartItems,
          newlyAddedItem,
        ]);
      }

      localStorage.setItem("cartItems", updatedCartItems);
      window.dispatchEvent(new Event("storageCart"));
    } else {
      toast.error("Please select a size first.");
    }
  };

  return (
    <main className="relative overflow-hidden pt-20 text-sm sm:pt-24 lg:pt-28 [&_img]:pointer-events-none">
      <div className="absolute -left-3 top-28 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl" />
      <div className="absolute right-3 top-36 z-[-1] aspect-square w-56 translate-x-1/2 opacity-85 max-[1200px]:hidden">
        <Image
          src={circleWithStarShape}
          alt="circle with star shape"
          className="object-contain"
          height={0}
          width={0}
          sizes="25vw"
          fill
        />
      </div>
      <div className="px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
        <div className="relative md:flex md:gap-x-10">
          <div className="absolute -bottom-14 -right-3 z-[-1] size-32 rounded-full bg-[#d3f9ce] blur-3xl lg:-bottom-5" />
          <section className="relative flex flex-col gap-2 sm:max-md:flex-row xl:sticky xl:top-[14px] xl:h-[calc(100dvh-112px-14px)]">
            <div
              className="relative h-[35vh] grow overflow-hidden rounded-lg bg-[#F0F0F0] p-5 md:w-80 lg:w-[424px]"
              onMouseEnter={(event) => {
                event.currentTarget.querySelector("img").style.pointerEvents =
                  "auto";
              }}
            >
              <Image
                src={
                  product.images[selectedOptions.colorIndex].imageURLs[
                    activeImageIndex
                  ]
                }
                alt={`${product.title} ${product.images[selectedOptions.colorIndex].color} ${activeImageIndex + 1}`}
                className="h-full w-full select-none object-contain"
                sizes="50vw"
                fill
                onContextMenu={(event) => event.preventDefault()}
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={(e) => {
                  const imageWrapperElement = e.target.parentElement;
                  const imageZoomedElement =
                    document.getElementById("img-zoomed");

                  let pointer = {
                    x:
                      (e.nativeEvent.offsetX * 100) /
                      imageWrapperElement.offsetWidth,
                    y:
                      (e.nativeEvent.offsetY * 100) /
                      imageWrapperElement.offsetHeight,
                  };

                  imageZoomedElement.style.display = "block";
                  imageZoomedElement.style.backgroundPosition = `${parseInt(pointer.x)}% ${parseInt(pointer.y)}%`;
                }}
                onMouseOut={() =>
                  (document.getElementById("img-zoomed").style.display = "none")
                }
              />
              <div
                id="img-zoomed"
                className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full"
                style={{
                  backgroundImage: `url(${
                    product.images[selectedOptions.colorIndex].imageURLs[
                      activeImageIndex
                    ]
                  })`,
                  backgroundSize: "200%",
                  backgroundPosition: "0% 0%",
                }}
              />
              {(product.salesThisMonth >= 15 || product.isNewArrival) && (
                <div className="absolute left-4 top-4 z-[3] space-y-2">
                  {product.salesThisMonth >= 15 && (
                    <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#cd4747] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+58px+10px)]">
                      <div className="relative mx-1.5 h-9 w-6">
                        <LuBadge className="h-full w-full object-contain" />
                        <HiOutlineLightningBolt className="absolute left-1/2 top-1/2 h-full w-2/3 -translate-x-1/2 -translate-y-1/2 object-contain" />
                      </div>
                      <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                        Trending!
                      </p>
                    </div>
                  )}
                  {product.isNewArrival && (
                    <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#5c49d9] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+31px+10px)]">
                      <MdOutlineNewReleases className="mx-1.5 h-9 w-6 object-contain" />
                      <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                        New!
                      </p>
                    </div>
                  )}
                </div>
              )}
              <button
                className="absolute right-4 top-4 z-[3] grid place-content-center rounded-md bg-white p-2.5 shadow-[2px_2px_16px_0_rgba(0,0,0,0.1)]"
                onClick={() => setIsImageExpanded(true)}
              >
                <CgArrowsExpandRight />
              </button>
            </div>
            <div className="relative sm:max-md:hidden md:w-80 lg:w-[424px]">
              <div className="relative flex w-full gap-x-2 max-sm:overflow-x-auto md:overflow-hidden">
                {product.images[selectedOptions.colorIndex].imageURLs.map(
                  (imageURL, imageURLIndex) => {
                    return (
                      <div
                        key={imageURL}
                        className={`relative aspect-[1/1.2] shrink-0 cursor-pointer overflow-hidden rounded-md bg-[#F0F0F0] transition-[border-color,transform] duration-300 ease-in-out md:h-32 ${activeImageIndex === imageURLIndex ? "border-2 border-[#b96826]" : ""}`}
                        onClick={() => setActiveImageIndex(imageURLIndex)}
                        style={{
                          width: `calc(
                            (100% - 8px * 3) / 4
                          )`,
                          transform: `translateX(
                            calc((100% + 8px) * ${numOfTimesThumbnailsMoved} * -1)
                          )`,
                        }}
                      >
                        <Image
                          src={imageURL}
                          alt={`${product.title} ${product.images[selectedOptions.colorIndex].color} Thumbnail ${imageURLIndex + 1}`}
                          className="h-full w-full object-cover transition-[transform] duration-300 ease-in-out"
                          sizes="50vw"
                          fill
                        />
                      </div>
                    );
                  },
                )}
              </div>
              {TOTAL_IMAGES_OF_SELECTED_ACTIVE_COLOR >
                NUMBER_OF_THUMBNAILS_VISIBLE && (
                <>
                  <Button
                    className={`absolute top-1/2 size-10 -translate-x-2 -translate-y-1/2 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:block md:-translate-x-1/2 [&>svg]:mx-auto ${numOfTimesThumbnailsMoved === 0 ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
                    isIconOnly
                    disableRipple
                    startContent={<CgChevronLeft />}
                    onClick={() =>
                      setNumOfTimesThumbnailsMoved(
                        (prevNumber) => prevNumber - 1,
                      )
                    }
                  ></Button>
                  <Button
                    className={`absolute right-0 top-1/2 size-10 -translate-y-1/2 translate-x-2 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:translate-x-1/2 [&>svg]:mx-auto ${numOfTimesThumbnailsMoved === MAX_NUM_OF_TIMES_THUMBNAILS_ALLOWED_TO_MOVED ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
                    isIconOnly
                    disableRipple
                    startContent={<CgChevronRight />}
                    onClick={() =>
                      setNumOfTimesThumbnailsMoved(
                        (prevNumber) => prevNumber + 1,
                      )
                    }
                  ></Button>
                </>
              )}
            </div>
            <div className="relative hidden h-[35vh] sm:max-md:block">
              <div className="relative flex h-full w-full flex-col gap-2 max-sm:overflow-x-auto sm:overflow-hidden">
                {product.images[selectedOptions.colorIndex].imageURLs.map(
                  (imageURL, imageURLIndex) => {
                    return (
                      <div
                        key={imageURL}
                        className={`relative aspect-[1/1.1] shrink-0 cursor-pointer overflow-hidden rounded-md bg-[#F0F0F0] transition-[border-color,transform] duration-300 ease-in-out xl:h-32 ${activeImageIndex === imageURLIndex ? "border-2 border-[#b96826]" : ""}`}
                        onClick={() => setActiveImageIndex(imageURLIndex)}
                        style={{
                          height: `calc(
                            (100% - 8px * 3) / 4
                          )`,
                          transform: `translateY(
                            calc((100% + 8px) * ${numOfTimesThumbnailsMoved} * -1)
                          )`,
                        }}
                      >
                        <Image
                          src={imageURL}
                          alt={`${product.title} ${product.images[selectedOptions.colorIndex].color} Thumbnail ${imageURLIndex + 1}`}
                          className="h-full w-full object-cover transition-[transform] duration-300 ease-in-out"
                          sizes="50vw"
                          fill
                        />
                      </div>
                    );
                  },
                )}
              </div>
              {TOTAL_IMAGES_OF_SELECTED_ACTIVE_COLOR >
                NUMBER_OF_THUMBNAILS_VISIBLE && (
                <>
                  <Button
                    className={`absolute left-1/2 top-0 size-10 -translate-x-1/2 translate-y-2 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] [&>svg]:mx-auto ${numOfTimesThumbnailsMoved === 0 ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
                    isIconOnly
                    disableRipple
                    startContent={<CgChevronUp />}
                    onClick={() =>
                      setNumOfTimesThumbnailsMoved(
                        (prevNumber) => prevNumber - 1,
                      )
                    }
                  ></Button>
                  <Button
                    className={`absolute bottom-0 left-1/2 size-10 -translate-x-1/2 -translate-y-2 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] [&>svg]:mx-auto ${numOfTimesThumbnailsMoved === MAX_NUM_OF_TIMES_THUMBNAILS_ALLOWED_TO_MOVED ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
                    isIconOnly
                    disableRipple
                    startContent={<CgChevronDown />}
                    onClick={() =>
                      setNumOfTimesThumbnailsMoved(
                        (prevNumber) => prevNumber + 1,
                      )
                    }
                  ></Button>
                </>
              )}
            </div>
            <div className="absolute -bottom-16 right-0 z-[-1] aspect-[3.5/1] w-[1150px] opacity-50 sm:-bottom-28 sm:w-[1050px] md:w-[1100px] lg:w-[1200px]">
              <Image
                src={curvedDottedLineShape}
                alt="Curved dotted line shape"
                className="object-contain"
                height={0}
                width={0}
                sizes="25vw"
                fill
              />
            </div>
          </section>
          <div
            className={`fixed inset-0 z-10 flex h-dvh w-dvw items-center justify-center bg-black bg-opacity-80 text-neutral-300 backdrop-blur ${isImageExpanded ? "" : "hidden"}`}
            id="expanded-img-bg"
            onClick={(event) =>
              event.target.id === "expanded-img-bg" && setIsImageExpanded(false)
            }
          >
            <Image
              src={
                product.images[selectedOptions.colorIndex].imageURLs[
                  activeImageIndex
                ]
              }
              alt={`${product.title} ${product.images[selectedOptions.colorIndex].color} ${activeImageIndex + 1} Expanded`}
              height={0}
              width={0}
              className="bg-[#F0F0F0] object-contain portrait:h-auto portrait:max-h-[calc(100dvh-20*4px-24*2px)] portrait:w-[calc(100dvw-10*4px-20px*2)] portrait:sm:w-[calc(100dvw-20*4px-24px*2)] landscape:h-[90vh] landscape:w-auto"
              sizes="90vh"
            />
            <p className="absolute left-5 top-5 text-sm">
              {activeImageIndex + 1}/
              {product.images[selectedOptions.colorIndex].imageURLs.length}
            </p>
            <CgClose
              className="absolute right-5 top-5 cursor-pointer transition-[color] duration-300 ease-in-out hover:text-white"
              size={24}
              onClick={() => setIsImageExpanded(false)}
            />
            <CgArrowLeft
              className={`absolute left-2.5 top-1/2 size-5 -translate-y-1/2 cursor-pointer transition-[opacity,color] duration-300 ease-in-out sm:left-5 sm:size-6 ${activeImageIndex === 0 ? "pointer-events-none opacity-0" : "pointer-events-auto hover:text-white hover:opacity-100"}`}
              onClick={() => setActiveImageIndex(activeImageIndex - 1)}
            />
            <CgArrowRight
              className={`absolute right-2.5 top-1/2 size-5 -translate-y-1/2 cursor-pointer transition-[opacity,color] duration-300 ease-in-out sm:right-5 sm:size-6 ${activeImageIndex === product.images[selectedOptions.colorIndex].imageURLs.length - 1 ? "pointer-events-none opacity-0" : "pointer-events-auto hover:text-white hover:opacity-100"}`}
              size={24}
              onClick={() => setActiveImageIndex(activeImageIndex + 1)}
            />
          </div>
          <div className="relative mt-4 flex flex-col xl:mt-0 xl:min-h-[calc(100dvh-112px-14px)] xl:grow">
            <div className="absolute -right-16 top-10 z-[-1] aspect-square w-52 translate-x-1/2 opacity-85 sm:-right-10 sm:max-md:w-64 lg:-right-20 min-[1200px]:hidden">
              <Image
                src={circleWithStarShape}
                alt="circle with star shape"
                className="object-contain"
                height={0}
                width={0}
                sizes="25vw"
                fill
              />
            </div>
            <section>
              <h1 className="relative mb-2.5 w-fit text-2xl font-bold sm:text-3xl">
                {product.title}
                <div className="absolute -right-1.5 bottom-1/4 aspect-square w-8 translate-x-full rotate-[26deg] lg:w-9">
                  <Image
                    src={thunderShape}
                    alt="Thunder shape"
                    className="object-contain"
                    height={0}
                    width={0}
                    sizes="25vw"
                    fill
                  />
                </div>
              </h1>
              <div className="relative mb-6 flex gap-x-3 text-lg font-bold sm:text-xl">
                <p
                  className={
                    product.discount
                      ? "relative text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']"
                      : "text-neutral-600"
                  }
                >
                  ৳ {product.price.toLocaleString()}
                </p>
                {product.discount && (
                  <p className="text-neutral-600">
                    ৳ {product.discount.finalPrice.toLocaleString()}
                  </p>
                )}
                <div className="absolute -bottom-48 -right-10 z-[-1] size-32 -translate-y-1/2 rounded-full bg-[#ebc6a6] opacity-75 blur-3xl sm:max-md:right-16 xl:right-24" />
              </div>
              <div className="mb-3.5 flex items-center gap-x-2.5">
                <h4 className="font-semibold text-neutral-600">Sizes:</h4>
                <div className="flex flex-wrap gap-x-1.5">
                  {product.sizes.map((size, sizeIndex) => {
                    return (
                      <span
                        key={size}
                        className={`h-9 w-12 cursor-pointer content-center rounded-lg text-center text-sm font-semibold text-neutral-500 transition-[background-color] duration-300 ease-in-out ${selectedOptions.sizeIndex === sizeIndex ? "bg-[#F4D3BA]" : "bg-neutral-100 hover:bg-[#FBEDE2]"}`}
                        onClick={() =>
                          setSelectedOptions((prevOptions) => ({
                            ...prevOptions,
                            sizeIndex: sizeIndex,
                          }))
                        }
                      >
                        {size}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="mb-3.5 flex items-center gap-x-2.5">
                <h4 className="font-semibold text-neutral-600">Colors:</h4>
                <div className="flex flex-wrap gap-x-1.5">
                  {product.images.map(({ colorCode }, index) => {
                    return (
                      <div
                        key={colorCode}
                        className={`grid size-8 cursor-pointer place-items-center rounded-full border-2 transition-[border-color] duration-300 ease-in-out hover:border-[#b96826] ${selectedOptions.colorIndex === index ? "border-[#b96826]" : "border-transparent"}`}
                        onClick={() => {
                          setActiveImageIndex(0);
                          setNumOfTimesThumbnailsMoved(0);
                          setSelectedOptions((prevOptions) => ({
                            ...prevOptions,
                            colorIndex: index,
                          }));
                        }}
                      >
                        <div
                          className="size-[22px] rounded-full ring-1 ring-neutral-300"
                          style={{
                            backgroundColor: colorCode,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {!!product.inStock && (
                <div className="mb-6 flex items-center gap-x-2.5">
                  <h4 className="font-semibold text-neutral-600">Quantity:</h4>
                  <div className="flex gap-x-1.5 [&>*]:rounded-lg [&>button]:bg-neutral-100 hover:[&>button]:bg-[#FBEDE2]">
                    <Button
                      isIconOnly
                      startContent={<HiChevronLeft />}
                      onClick={() =>
                        setSelectedOptions((prevOptions) => ({
                          ...prevOptions,
                          quantity:
                            prevOptions.quantity !== 1
                              ? prevOptions.quantity - 1
                              : prevOptions.quantity,
                        }))
                      }
                    ></Button>
                    <Input
                      className="w-fit font-semibold [&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-outer-spin-button]:appearance-none [&_input]:text-center [&_input]:[-moz-appearance:textfield]"
                      type="number"
                      arial-label="Quantity"
                      min={1}
                      max={product.inStock}
                      value={selectedOptions.quantity}
                      defaultValue={selectedOptions.quantity}
                      onValueChange={(value) => {
                        setSelectedOptions((prevOptions) => ({
                          ...prevOptions,
                          quantity:
                            value < 1
                              ? 1
                              : value > product.inStock
                                ? product.inStock
                                : value,
                        }));
                      }}
                    />
                    <Button
                      isIconOnly
                      startContent={<HiChevronRight />}
                      onClick={() =>
                        setSelectedOptions((prevOptions) => ({
                          ...prevOptions,
                          quantity:
                            prevOptions.quantity !== product.inStock
                              ? Number(prevOptions.quantity) + 1
                              : prevOptions.quantity,
                        }))
                      }
                    ></Button>
                  </div>
                </div>
              )}
              <div className="mb-7 flex gap-2 max-lg:flex-wrap [&>button>svg]:text-lg [&>button]:rounded-lg [&>button]:px-5 [&>button]:py-6 [&>button]:text-sm [&>button]:font-semibold [&>button]:text-neutral-600 [&>button]:duration-300 hover:[&>button]:opacity-100">
                <Button
                  endContent={<CgShoppingCart />}
                  isDisabled={!product.inStock}
                  disableRipple
                  className="overflow-visible bg-[#FBEDE2] after:absolute after:left-0 after:top-14 after:text-red-600 after:opacity-100 hover:bg-[#F4D3BA] disabled:mb-6 disabled:bg-opacity-50 disabled:text-neutral-400 disabled:opacity-100 disabled:after:content-['*_Out_of_Stock']"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  endContent={<CgHeart />}
                  disableRipple
                  className="bg-[#E0FCDC] hover:bg-[#C1F7B9]"
                  onClick={() => handleAddToWishlist(product)}
                >
                  Add to Wishlist
                </Button>
                <Button
                  endContent={<CgRuler />}
                  disableRipple
                  className="bg-[#E0FCDC] hover:bg-[#C1F7B9]"
                  onClick={() => setIsOpen(true)}
                >
                  Size Guide
                </Button>
              </div>
              <Modal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                size="3xl"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader>SIZE GUIDE</ModalHeader>
                      <ModalBody className="-mt-5">
                        <p className="mb-5 text-sm text-neutral-500">
                          Lorem ipsum dolor, sit amet consectetur adipisicing
                          elit. Enim ullam aliquid consequatur.
                        </p>
                        <Image
                          src={product.sizeGuide}
                          alt="Size guide"
                          className="h-auto w-full object-contain"
                          width={0}
                          height={0}
                          sizes="50vw"
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </section>
            <hr className="h-0.5 bg-neutral-100 sm:max-md:mb-4 xl:mb-4" />
            <section className="w-full gap-x-12 sm:max-md:flex xl:flex xl:grow">
              <div>
                <ul className="mx-auto mb-4 flex w-fit font-semibold text-neutral-600 max-sm:w-full max-sm:overflow-x-auto sm:max-md:mb-0 sm:max-md:block xl:mb-0 xl:block">
                  {tabsSection.options.map((option, optionIndex) => {
                    return (
                      <li
                        key={option + optionIndex}
                        className={`-mt-0.5 shrink-0 cursor-pointer text-nowrap rounded-md px-4 py-2.5 transition-[background-color] duration-300 ease-in-out lg:px-5 ${
                          tabsSection.selectedTabIndex === optionIndex
                            ? "bg-neutral-200"
                            : "bg-transparent hover:bg-neutral-100"
                        }`}
                        onClick={() =>
                          setTabsSection((prevTabsSection) => ({
                            ...prevTabsSection,
                            selectedTabIndex: optionIndex,
                          }))
                        }
                      >
                        {option}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {tabsSection.selectedTabIndex === 0 ? (
                <div className="mx-auto w-full space-y-3.5 text-neutral-500">
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Magni nisi, dolorem eum nam cupiditate fugiat praesentium
                    autem optio perspiciatis corrupti placeat a modi dolorum ex
                    molestiae sequi enim natus, fugit blanditiis aliquid et quis
                    necessitatibus? Illum excepturi et itaque veritatis expedita
                    ea.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Itaque eveniet autem perferendis, voluptates tenetur sint
                    illum ullam perspiciatis culpa repellat magni quidem quia
                    earum laboriosam fugiat voluptas rem, est cupiditate!
                  </p>
                </div>
              ) : tabsSection.selectedTabIndex === 1 ? (
                <ul className="mx-auto flex w-full gap-x-8 text-neutral-500 [&>div]:w-full">
                  <div>
                    <li>
                      <span className="font-semibold">Bike: </span>Lorem
                      Gulistan
                    </li>
                    <li>
                      <span className="font-semibold">Car: </span>Cotton lorem
                    </li>
                    <li>
                      <span className="font-semibold">Chair: </span>Rubber
                    </li>
                    <li>
                      <span className="font-semibold">Table: </span>100%
                    </li>
                    <li>
                      <span className="font-semibold">Cup: </span>Pure Silk
                    </li>
                    <li>
                      <span className="font-semibold">Bottle: </span>Guranteed
                      Return
                    </li>
                  </div>
                  <div>
                    <li>
                      <span className="font-semibold">Mug: </span>Dhaka
                    </li>
                    <li>
                      <span className="font-semibold">Laptop: </span>Handmade
                      Care
                    </li>
                    <li>
                      <span className="font-semibold">Sofa: </span>8.9
                    </li>
                    <li>
                      <span className="font-semibold">Desktop: </span>Verified
                      Product
                    </li>
                    <li>
                      <span className="font-semibold">Dress: </span>1200
                    </li>
                  </div>
                </ul>
              ) : (
                <div className="mx-auto w-full space-y-3.5 text-neutral-500">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad
                    autem nihil veniam. Minima ab eius doloribus culpa ipsam sit
                    repellat sunt cupiditate aspernatur hic accusamus qui velit
                    tempore, quis corrupti animi voluptatibus eaque maiores
                    totam.
                  </p>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea
                    perferendis in nostrum delectus voluptates cum blanditiis
                    fuga iusto ducimus minima vel ex commodi qui architecto,
                    dolorum temporibus? Reiciendis, quidem dolorum?
                  </p>
                </div>
              )}
            </section>
            <hr className="mb-3 mt-10 h-0.5 bg-neutral-100" />
            <section className="mb-1 flex justify-between gap-4 max-sm:flex-col sm:items-center md:max-lg:flex-col md:max-lg:items-start">
              <div className="flex gap-x-1.5">
                <h4 className="font-semibold text-neutral-600">Product ID:</h4>
                <p className="text-neutral-500">
                  {product.categories.mainCategory.slice(0, 3).toUpperCase() +
                    "-25D1-84BN"}
                </p>
              </div>
              <div className="flex items-center gap-x-1.5">
                <h4 className="font-semibold text-neutral-600">Share:</h4>
                <ul className="social-icons flex gap-x-1.5 [&_a>svg]:w-3.5 [&_a]:size-[26px]">
                  <li>
                    <TransitionLink
                      className="hover:bg-[#cfe6ff] hover:text-[#0080ff]"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`}
                      target="_blank"
                    >
                      <FaSquareFacebook />
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      className="hover:bg-black hover:text-white"
                      href={`https://twitter.com/intent/tweet?url=${fullUrl}&text=Check+out+this+${product.title.split(" ").join("+")}!`}
                      target="_blank"
                    >
                      <FaXTwitter />
                    </TransitionLink>
                  </li>
                  {/* <li>
                    <TransitionLink
                      className="from-[#405de6] via-[#dc2743] to-[#f09433] hover:bg-gradient-to-b hover:text-white"
                      href="https://www.instagram.com/?url=https%3A%2F%2Frahilbinmushfiq.vercel.app%2F"
                      target="_blank"
                    >
                      <FaInstagram />
                    </TransitionLink>
                  </li> */}
                  <li>
                    <TransitionLink
                      className="hover:bg-[#cce6ff] hover:text-[#168AFF]"
                      href={`fb-messenger://share/?link=${fullUrl}`}
                      target="_blank"
                    >
                      <FaFacebookMessenger />
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      className="hover:bg-[#25D366] hover:text-white"
                      href={`https://api.whatsapp.com/send?text=Check+out+this+${product.title.split(" ").join("+")}!+${fullUrl}`}
                      target="_blank"
                    >
                      <FaWhatsapp />
                    </TransitionLink>
                  </li>
                  <li
                    className="flex size-[26px] cursor-pointer items-center justify-center rounded-md bg-neutral-200 text-neutral-500 transition-colors duration-[400ms] ease-out hover:bg-black hover:text-white"
                    onClick={handleCopyToClipboard}
                  >
                    <FaLink className="w-3.5" />
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
      {!!product.restOfOutfit.length && (
        <section className="relative mt-8 bg-[#fffaf4] py-8 md:mt-12">
          <div className="space-y-5 px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
            <div>
              <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
                Complete Your Outfit
              </h2>
            </div>
            <div
              className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 ${product.restOfOutfit.length > 3 ? "sm:max-lg:[&>div:last-child]:hidden" : ""}`}
            >
              {product.restOfOutfit.map((otherProductIndex) => {
                let otherProduct = products[otherProductIndex];

                return (
                  <div
                    key={otherProductIndex + otherProduct.title}
                    className="relative [&>div:last-child]:hover:-translate-y-[calc(100%-1px)] [&>div:not(:last-child)]:hover:translate-x-0 [&>div]:hover:opacity-100 [&_img]:hover:scale-110"
                  >
                    <TransitionLink
                      href={`/product/${otherProduct.title.split(" ").join("-").toLowerCase()}`}
                    >
                      <div className="relative mb-3 h-[250px] w-full overflow-hidden rounded-[20px] bg-[#F0F0F0] sm:h-80 lg:h-[26vh]">
                        {otherProduct.imageURLs.map(
                          (imageURL, imageURLIndex) => {
                            return (
                              <div
                                key={imageURL + imageURLIndex}
                                className="img-container absolute h-[250px] w-full transition-[opacity] duration-300 ease-in-out sm:h-80 lg:h-[26vh]"
                                style={{
                                  opacity: imageURLIndex === 0 ? "1" : "0",
                                  pointerEvents:
                                    imageURLIndex === 0 ? "auto" : "none",
                                }}
                              >
                                <Image
                                  className="h-full w-full object-contain transition-[transform,opacity] duration-300 ease-in-out"
                                  src={imageURL}
                                  alt={otherProduct.title}
                                  sizes="50vw"
                                  fill
                                />
                                {[
                                  "/single-product/blue-1-main.jpeg",
                                  "/single-product/blue-2.jpeg",
                                  "/single-product/blue-3.jpeg",
                                  "/single-product/blue-4.jpeg",
                                  "/single-product/blue-5.jpeg",
                                  "/single-product/blue-6.jpeg",
                                ].map((hoverImage, hoverImageIndex) => {
                                  return (
                                    <Image
                                      key={hoverImage + hoverImageIndex}
                                      className="h-full w-full object-contain opacity-0 transition-[transform,opacity] duration-300 ease-in-out"
                                      src={hoverImage}
                                      alt={otherProduct.title}
                                      sizes="50vw"
                                      fill
                                    />
                                  );
                                })}
                              </div>
                            );
                          },
                        )}
                        <div className="absolute left-4 top-4 space-y-2">
                          {otherProduct.salesThisMonth >= 15 && (
                            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#cd4747] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+58px+10px)]">
                              <div className="relative mx-1.5 h-9 w-6">
                                <LuBadge className="h-full w-full object-contain" />
                                <HiOutlineLightningBolt className="absolute left-1/2 top-1/2 h-full w-2/3 -translate-x-1/2 -translate-y-1/2 object-contain" />
                              </div>
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                Trending!
                              </p>
                            </div>
                          )}
                          {otherProduct.isNewArrival && (
                            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#5c49d9] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+31px+10px)]">
                              <MdOutlineNewReleases className="mx-1.5 h-9 w-6 object-contain" />
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                New!
                              </p>
                            </div>
                          )}
                          {otherProduct.discount && (
                            <div
                              className={`relative h-9 w-9 overflow-hidden rounded-lg bg-[#32aa54] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] ${otherProduct.discount.amount.includes("%") ? "hover:w-[calc(36px+56px+10px)]" : "hover:w-[calc(36px+68px+10px)]"}`}
                            >
                              <TbRosetteDiscount className="mx-1.5 h-9 w-6 object-contain" />
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                {otherProduct.discount.amount} OFF!
                              </p>
                            </div>
                          )}
                        </div>
                        {!otherProduct.inStock && (
                          <p className="pointer-events-none absolute left-0 right-0 top-1/2 w-full -translate-y-1/2 bg-neutral-600 bg-opacity-25 py-2.5 text-center font-semibold text-white backdrop-blur-md">
                            Out of Stock
                          </p>
                        )}
                      </div>
                      <div className="flex gap-x-3">
                        <p
                          className={`relative w-fit text-base font-semibold xl:text-lg ${otherProduct.discount ? "text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']" : "text-neutral-800"}`}
                        >
                          ৳ {otherProduct.price.toLocaleString()}
                        </p>
                        {otherProduct.discount && (
                          <p className="text-base font-semibold text-neutral-800 xl:text-lg">
                            ৳{" "}
                            {otherProduct.discount.finalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <h3 className="line-clamp-1 text-base font-semibold text-neutral-800 xl:text-lg">
                        {otherProduct.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-1 text-xs text-neutral-700 xl:text-sm">
                        {otherProduct.categories.mainCategory +
                          ", " +
                          otherProduct.categories.subCategories.join(", ")}
                      </p>
                    </TransitionLink>
                    <div className="absolute right-2.5 top-2.5 flex -translate-x-5 flex-col items-end space-y-1.5 opacity-0 transition-[transform,opacity] duration-300 ease-in-out [&>button]:rounded-lg [&>button]:font-semibold [&>button]:text-neutral-700 [&>button]:shadow-[3px_3px_20px_0_rgba(0,0,0,0.25)] hover:[&>button]:opacity-100">
                      {!!otherProduct.inStock && (
                        <button
                          className="relative h-9 w-9 overflow-hidden bg-[#FBEDE2] transition-[background-color,width] hover:w-[calc(36px+72px+10px)] hover:bg-[#F4D3BA]"
                          onClick={() => {
                            setSelectedAddToCartProduct(otherProduct);
                            setIsAddToCartModalOpen(true);
                          }}
                        >
                          <CgShoppingCart className="mx-2.5 h-9 w-4 object-contain" />
                          <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                            Add to Cart
                          </p>
                        </button>
                      )}
                      <button
                        className="relative h-9 w-9 overflow-hidden bg-[#E0FCDC] transition-[background-color,width] hover:w-[calc(36px+96px+10px)] hover:bg-[#C1F7B9]"
                        onClick={() => handleAddToWishlist(otherProduct)}
                      >
                        <CgHeart className="mx-2.5 h-9 w-4 object-contain" />
                        <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                          Add to Wishlist
                        </p>
                      </button>
                    </div>
                    <div className="absolute left-1/2 top-[250px] flex w-full -translate-x-1/2 -translate-y-2/3 items-center gap-x-1.5 rounded-b-3xl border border-[#F0F0F0] bg-white bg-opacity-75 px-4 py-3 opacity-0 transition-[transform,opacity] duration-300 ease-in-out sm:top-[320px] sm:gap-x-2.5 lg:top-[26vh]">
                      <h5 className="text-[13px] font-semibold text-neutral-600">
                        <span className="max-sm:hidden">Available </span>Colors:
                      </h5>
                      <div className="flex items-center justify-center sm:gap-x-1">
                        {otherProduct.colors.map((color, colorIndex) => {
                          return (
                            <div
                              key={color + colorIndex}
                              className="grid size-[26px] cursor-pointer place-items-center rounded-full border-3 transition-[border-color] duration-300 ease-in-out hover:border-[#c18d6c]"
                              style={{
                                borderColor:
                                  colorIndex === 0 ? "#c18d6c" : "transparent",
                              }}
                              onClick={(e) => {
                                const selectedColorElement = e.currentTarget,
                                  colorElements =
                                    selectedColorElement.parentElement.children,
                                  imageContainerElements =
                                    selectedColorElement.parentElement.parentElement.parentElement.querySelectorAll(
                                      ".img-container",
                                    );

                                Object.values(colorElements).forEach(
                                  (colorElement) =>
                                    (colorElement.style.borderColor =
                                      "transparent"),
                                );

                                selectedColorElement.style.borderColor =
                                  "#c18d6c";

                                Object.values(imageContainerElements).forEach(
                                  (imageElement) => {
                                    imageElement.style.opacity = "0";
                                    imageElement.style.pointerEvents = "none";
                                  },
                                );

                                Object.values(imageContainerElements)[
                                  colorIndex
                                ].style.opacity = "1";
                                Object.values(imageContainerElements)[
                                  colorIndex
                                ].style.pointerEvents = "auto";
                              }}
                            >
                              <div
                                className={`size-4 rounded-full ring-1 ${color === "white" ? "ring-neutral-200" : "ring-transparent"}`}
                                style={{
                                  background:
                                    color !== "Multicolor"
                                      ? color
                                      : "linear-gradient(90deg, blue 0%, red 40%, green 80%)",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {!!similarProducts.length && (
        <section
          className={`relative ${
            !product.restOfOutfit.length
              ? "mt-8 bg-[#fffaf4] py-8"
              : recentlyViewedProducts.length > 1
                ? "pt-8"
                : "pb-10 pt-8"
          }`}
        >
          <div
            className={`absolute inset-0 flex h-full w-full items-center justify-between space-y-5 px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${similarProducts.length < 5 ? "hidden" : "flex"}`}
          >
            <Button
              className={`z-[1] size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:block md:-translate-x-1/2 [&>svg]:mx-auto ${!isSimilarProductsSlid ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
              isIconOnly
              disableRipple
              startContent={<CgChevronLeft />}
              onClick={() => setIsSimilarProductsSlid(false)}
            ></Button>
            <Button
              className={`z-[1] size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:translate-x-1/2 [&>svg]:mx-auto ${isSimilarProductsSlid ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
              isIconOnly
              disableRipple
              startContent={<CgChevronRight />}
              onClick={() => setIsSimilarProductsSlid(true)}
            ></Button>
          </div>
          <div className="space-y-5 overflow-hidden px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
            <div>
              <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
                You May Also Like
              </h2>
            </div>
            <div
              className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:max-lg:[&>div:last-child]:hidden lg:[&>div]:min-w-[calc(25%-16px*3/4)] ${similarProducts.length < 5 ? "lg:grid-cols-4" : "transition-transform duration-300 ease-in-out lg:flex lg:flex-nowrap"} ${isSimilarProductsSlid ? "-translate-x-[calc(100%+16px)]" : "-translate-x-0"}`}
            >
              {similarProducts.map((similarProduct, similarProductIndex) => {
                return (
                  <div
                    key={similarProductIndex + similarProduct.title}
                    className="relative [&>div:last-child]:hover:-translate-y-[calc(100%-1px)] [&>div:not(:last-child)]:hover:translate-x-0 [&>div]:hover:opacity-100 [&_img]:hover:scale-110"
                  >
                    <TransitionLink
                      href={`/product/${similarProduct.title.split(" ").join("-").toLowerCase()}`}
                    >
                      <div className="relative mb-3 h-[250px] w-full overflow-hidden rounded-[20px] bg-[#F0F0F0] sm:h-80 lg:h-[26vh]">
                        {similarProduct.imageURLs.map(
                          (imageURL, imageURLIndex) => {
                            return (
                              <div
                                key={imageURL + imageURLIndex}
                                className="img-container absolute h-[250px] w-full transition-[opacity] duration-300 ease-in-out sm:h-80 lg:h-[26vh]"
                                style={{
                                  opacity: imageURLIndex === 0 ? "1" : "0",
                                  pointerEvents:
                                    imageURLIndex === 0 ? "auto" : "none",
                                }}
                              >
                                <Image
                                  className="h-full w-full object-contain transition-[transform,opacity] duration-300 ease-in-out"
                                  src={imageURL}
                                  alt={similarProduct.title}
                                  sizes="50vw"
                                  fill
                                />
                                {[
                                  "/single-product/blue-1-main.jpeg",
                                  "/single-product/blue-2.jpeg",
                                  "/single-product/blue-3.jpeg",
                                  "/single-product/blue-4.jpeg",
                                  "/single-product/blue-5.jpeg",
                                  "/single-product/blue-6.jpeg",
                                ].map((hoverImage, hoverImageIndex) => {
                                  return (
                                    <Image
                                      key={hoverImage + hoverImageIndex}
                                      className="h-full w-full object-contain opacity-0 transition-[transform,opacity] duration-300 ease-in-out"
                                      src={hoverImage}
                                      alt={similarProduct.title}
                                      sizes="50vw"
                                      fill
                                    />
                                  );
                                })}
                              </div>
                            );
                          },
                        )}
                        <div className="absolute left-4 top-4 space-y-2">
                          {similarProduct.salesThisMonth >= 15 && (
                            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#cd4747] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+58px+10px)]">
                              <div className="relative mx-1.5 h-9 w-6">
                                <LuBadge className="h-full w-full object-contain" />
                                <HiOutlineLightningBolt className="absolute left-1/2 top-1/2 h-full w-2/3 -translate-x-1/2 -translate-y-1/2 object-contain" />
                              </div>
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                Trending!
                              </p>
                            </div>
                          )}
                          {similarProduct.isNewArrival && (
                            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#5c49d9] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+31px+10px)]">
                              <MdOutlineNewReleases className="mx-1.5 h-9 w-6 object-contain" />
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                New!
                              </p>
                            </div>
                          )}
                          {similarProduct.discount && (
                            <div
                              className={`relative h-9 w-9 overflow-hidden rounded-lg bg-[#32aa54] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] ${similarProduct.discount.amount.includes("%") ? "hover:w-[calc(36px+56px+10px)]" : "hover:w-[calc(36px+68px+10px)]"}`}
                            >
                              <TbRosetteDiscount className="mx-1.5 h-9 w-6 object-contain" />
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                {similarProduct.discount.amount} OFF!
                              </p>
                            </div>
                          )}
                        </div>
                        {!similarProduct.inStock && (
                          <p className="pointer-events-none absolute left-0 right-0 top-1/2 w-full -translate-y-1/2 bg-neutral-600 bg-opacity-25 py-2.5 text-center font-semibold text-white backdrop-blur-md">
                            Out of Stock
                          </p>
                        )}
                      </div>
                      <div className="flex gap-x-3">
                        <p
                          className={`relative w-fit text-base font-semibold xl:text-lg ${similarProduct.discount ? "text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']" : "text-neutral-800"}`}
                        >
                          ৳ {similarProduct.price.toLocaleString()}
                        </p>
                        {similarProduct.discount && (
                          <p className="text-base font-semibold text-neutral-800 xl:text-lg">
                            ৳{" "}
                            {similarProduct.discount.finalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <h3 className="line-clamp-1 text-base font-semibold text-neutral-800 xl:text-lg">
                        {similarProduct.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-1 text-xs text-neutral-700 xl:text-sm">
                        {similarProduct.categories.mainCategory +
                          ", " +
                          similarProduct.categories.subCategories.join(", ")}
                      </p>
                    </TransitionLink>
                    <div className="absolute right-2.5 top-2.5 flex -translate-x-5 flex-col items-end space-y-1.5 opacity-0 transition-[transform,opacity] duration-300 ease-in-out [&>button]:rounded-lg [&>button]:font-semibold [&>button]:text-neutral-700 [&>button]:shadow-[3px_3px_20px_0_rgba(0,0,0,0.25)] hover:[&>button]:opacity-100">
                      {!!similarProduct.inStock && (
                        <button
                          className="relative h-9 w-9 overflow-hidden bg-[#FBEDE2] transition-[background-color,width] hover:w-[calc(36px+72px+10px)] hover:bg-[#F4D3BA]"
                          onClick={() => {
                            setSelectedAddToCartProduct(similarProduct);
                            setIsAddToCartModalOpen(true);
                          }}
                        >
                          <CgShoppingCart className="mx-2.5 h-9 w-4 object-contain" />
                          <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                            Add to Cart
                          </p>
                        </button>
                      )}
                      <button
                        className="relative h-9 w-9 overflow-hidden bg-[#E0FCDC] transition-[background-color,width] hover:w-[calc(36px+96px+10px)] hover:bg-[#C1F7B9]"
                        onClick={() => handleAddToWishlist(similarProduct)}
                      >
                        <CgHeart className="mx-2.5 h-9 w-4 object-contain" />
                        <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                          Add to Wishlist
                        </p>
                      </button>
                    </div>
                    <div className="absolute left-1/2 top-[250px] flex w-full -translate-x-1/2 -translate-y-2/3 items-center gap-x-1.5 rounded-b-3xl border border-[#F0F0F0] bg-white bg-opacity-75 px-4 py-3 opacity-0 transition-[transform,opacity] duration-300 ease-in-out sm:top-[320px] sm:gap-x-2.5 lg:top-[26vh]">
                      <h5 className="text-[13px] font-semibold text-neutral-600">
                        <span className="max-sm:hidden">Available </span>
                        Colors:
                      </h5>
                      <div className="flex items-center justify-center sm:gap-x-1">
                        {similarProduct.colors.map((color, colorIndex) => {
                          return (
                            <div
                              key={color + colorIndex}
                              className="grid size-[26px] cursor-pointer place-items-center rounded-full border-3 transition-[border-color] duration-300 ease-in-out hover:border-[#c18d6c]"
                              style={{
                                borderColor:
                                  colorIndex === 0 ? "#c18d6c" : "transparent",
                              }}
                              onClick={(e) => {
                                const selectedColorElement = e.currentTarget,
                                  colorElements =
                                    selectedColorElement.parentElement.children,
                                  imageContainerElements =
                                    selectedColorElement.parentElement.parentElement.parentElement.querySelectorAll(
                                      ".img-container",
                                    );

                                Object.values(colorElements).forEach(
                                  (colorElement) =>
                                    (colorElement.style.borderColor =
                                      "transparent"),
                                );

                                selectedColorElement.style.borderColor =
                                  "#c18d6c";

                                Object.values(imageContainerElements).forEach(
                                  (imageElement) => {
                                    imageElement.style.opacity = "0";
                                    imageElement.style.pointerEvents = "none";
                                  },
                                );

                                Object.values(imageContainerElements)[
                                  colorIndex
                                ].style.opacity = "1";
                                Object.values(imageContainerElements)[
                                  colorIndex
                                ].style.pointerEvents = "auto";
                              }}
                            >
                              <div
                                className={`size-4 rounded-full ring-1 ${color === "white" ? "ring-neutral-200" : "ring-transparent"}`}
                                style={{
                                  background:
                                    color !== "Multicolor"
                                      ? color
                                      : "linear-gradient(90deg, blue 0%, red 40%, green 80%)",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {recentlyViewedProducts.length > 1 && (
        <section
          className={`relative ${
            !product.restOfOutfit.length
              ? "pb-10 pt-8"
              : "mt-8 bg-[#fffaf4] py-8"
          }`}
        >
          <div
            className={`absolute inset-0 h-full w-full items-center justify-between space-y-5 px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${recentlyViewedProducts.length < 6 ? "hidden" : "flex"}`}
          >
            <Button
              className={`z-[1] size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:block md:-translate-x-1/2 [&>svg]:mx-auto ${!isRecentlyViewedProductsSlid ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
              isIconOnly
              disableRipple
              startContent={<CgChevronLeft />}
              onClick={() => setIsRecentlyViewedProductsSlid(false)}
            ></Button>
            <Button
              className={`z-[1] size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:translate-x-1/2 [&>svg]:mx-auto ${isRecentlyViewedProductsSlid ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
              isIconOnly
              disableRipple
              startContent={<CgChevronRight />}
              onClick={() => setIsRecentlyViewedProductsSlid(true)}
            ></Button>
          </div>
          <div className="space-y-10 overflow-hidden px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
            <div>
              <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
                Recently Viewed Products
              </h2>
            </div>
            <div
              className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:max-lg:[&>div:last-child]:hidden lg:[&>div]:min-w-[calc(25%-16px*3/4)] ${recentlyViewedProducts.length < 6 ? "lg:grid-cols-4" : "transition-transform duration-300 ease-in-out lg:flex lg:flex-nowrap"} ${isRecentlyViewedProductsSlid ? "-translate-x-[calc(100%+16px)]" : "-translate-x-0"}`}
            >
              {recentlyViewedProducts.map(
                (recentlyViewedProduct, recentlyViewedProductIndex) => {
                  if (recentlyViewedProduct.title !== product.title)
                    return (
                      <div
                        key={
                          recentlyViewedProductIndex +
                          recentlyViewedProduct.title
                        }
                        className="relative [&>div:last-child]:hover:-translate-y-[calc(100%-1px)] [&>div:not(:last-child)]:hover:translate-x-0 [&>div]:hover:opacity-100 [&_img]:hover:scale-110"
                      >
                        <TransitionLink
                          href={`/product/${recentlyViewedProduct.title.split(" ").join("-").toLowerCase()}`}
                        >
                          <div className="relative mb-3 h-[250px] w-full overflow-hidden rounded-[20px] bg-[#F0F0F0] sm:h-80 lg:h-[26vh]">
                            {recentlyViewedProduct.imageURLs.map(
                              (imageURL, imageURLIndex) => {
                                return (
                                  <div
                                    key={imageURL + imageURLIndex}
                                    className="img-container absolute h-[250px] w-full transition-[opacity] duration-300 ease-in-out sm:h-80 lg:h-[26vh]"
                                    style={{
                                      opacity: imageURLIndex === 0 ? "1" : "0",
                                      pointerEvents:
                                        imageURLIndex === 0 ? "auto" : "none",
                                    }}
                                  >
                                    <Image
                                      className="h-full w-full object-contain transition-[transform,opacity] duration-300 ease-in-out"
                                      src={imageURL}
                                      alt={recentlyViewedProduct.title}
                                      sizes="50vw"
                                      fill
                                    />
                                    {[
                                      "/single-product/blue-1-main.jpeg",
                                      "/single-product/blue-2.jpeg",
                                      "/single-product/blue-3.jpeg",
                                      "/single-product/blue-4.jpeg",
                                      "/single-product/blue-5.jpeg",
                                      "/single-product/blue-6.jpeg",
                                    ].map((hoverImage, hoverImageIndex) => {
                                      return (
                                        <Image
                                          key={hoverImage + hoverImageIndex}
                                          className="h-full w-full object-contain opacity-0 transition-[transform,opacity] duration-300 ease-in-out"
                                          src={hoverImage}
                                          alt={recentlyViewedProduct.title}
                                          sizes="50vw"
                                          fill
                                        />
                                      );
                                    })}
                                  </div>
                                );
                              },
                            )}
                            <div className="absolute left-4 top-4 space-y-2">
                              {recentlyViewedProduct.salesThisMonth >= 15 && (
                                <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#cd4747] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+58px+10px)]">
                                  <div className="relative mx-1.5 h-9 w-6">
                                    <LuBadge className="h-full w-full object-contain" />
                                    <HiOutlineLightningBolt className="absolute left-1/2 top-1/2 h-full w-2/3 -translate-x-1/2 -translate-y-1/2 object-contain" />
                                  </div>
                                  <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                    Trending!
                                  </p>
                                </div>
                              )}
                              {recentlyViewedProduct.isNewArrival && (
                                <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#5c49d9] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+31px+10px)]">
                                  <MdOutlineNewReleases className="mx-1.5 h-9 w-6 object-contain" />
                                  <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                    New!
                                  </p>
                                </div>
                              )}
                              {recentlyViewedProduct.discount && (
                                <div
                                  className={`relative h-9 w-9 overflow-hidden rounded-lg bg-[#32aa54] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] ${recentlyViewedProduct.discount.amount.includes("%") ? "hover:w-[calc(36px+56px+10px)]" : "hover:w-[calc(36px+68px+10px)]"}`}
                                >
                                  <TbRosetteDiscount className="mx-1.5 h-9 w-6 object-contain" />
                                  <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                    {recentlyViewedProduct.discount.amount} OFF!
                                  </p>
                                </div>
                              )}
                            </div>
                            {!recentlyViewedProduct.inStock && (
                              <p className="pointer-events-none absolute left-0 right-0 top-1/2 w-full -translate-y-1/2 bg-neutral-600 bg-opacity-25 py-2.5 text-center font-semibold text-white backdrop-blur-md">
                                Out of Stock
                              </p>
                            )}
                          </div>
                          <div className="flex gap-x-3">
                            <p
                              className={`relative w-fit text-base font-semibold xl:text-lg ${recentlyViewedProduct.discount ? "text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']" : "text-neutral-800"}`}
                            >
                              ৳ {recentlyViewedProduct.price.toLocaleString()}
                            </p>
                            {recentlyViewedProduct.discount && (
                              <p className="text-base font-semibold text-neutral-800 xl:text-lg">
                                ৳{" "}
                                {recentlyViewedProduct.discount.finalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <h3 className="line-clamp-1 text-base font-semibold text-neutral-800 xl:text-lg">
                            {recentlyViewedProduct.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-1 text-xs text-neutral-700 xl:text-sm">
                            {recentlyViewedProduct.categories.mainCategory +
                              ", " +
                              recentlyViewedProduct.categories.subCategories.join(
                                ", ",
                              )}
                          </p>
                        </TransitionLink>
                        <div className="absolute right-2.5 top-2.5 flex -translate-x-5 flex-col items-end space-y-1.5 opacity-0 transition-[transform,opacity] duration-300 ease-in-out [&>button]:rounded-lg [&>button]:font-semibold [&>button]:text-neutral-700 [&>button]:shadow-[3px_3px_20px_0_rgba(0,0,0,0.25)] hover:[&>button]:opacity-100">
                          {!!recentlyViewedProduct.inStock && (
                            <button
                              className="relative h-9 w-9 overflow-hidden bg-[#FBEDE2] transition-[background-color,width] hover:w-[calc(36px+72px+10px)] hover:bg-[#F4D3BA]"
                              onClick={() => {
                                setSelectedAddToCartProduct(
                                  recentlyViewedProduct,
                                );
                                setIsAddToCartModalOpen(true);
                              }}
                            >
                              <CgShoppingCart className="mx-2.5 h-9 w-4 object-contain" />
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                Add to Cart
                              </p>
                            </button>
                          )}
                          <button
                            className="relative h-9 w-9 overflow-hidden bg-[#E0FCDC] transition-[background-color,width] hover:w-[calc(36px+96px+10px)] hover:bg-[#C1F7B9]"
                            onClick={() =>
                              handleAddToWishlist(recentlyViewedProduct)
                            }
                          >
                            <CgHeart className="mx-2.5 h-9 w-4 object-contain" />
                            <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                              Add to Wishlist
                            </p>
                          </button>
                        </div>
                        <div className="absolute left-1/2 top-[250px] flex w-full -translate-x-1/2 -translate-y-2/3 items-center gap-x-1.5 rounded-b-3xl border border-[#F0F0F0] bg-white bg-opacity-75 px-4 py-3 opacity-0 transition-[transform,opacity] duration-300 ease-in-out sm:top-[320px] sm:gap-x-2.5 lg:top-[26vh]">
                          <h5 className="text-[13px] font-semibold text-neutral-600">
                            <span className="max-sm:hidden">Available </span>
                            Colors:
                          </h5>
                          <div className="flex items-center justify-center sm:gap-x-1">
                            {recentlyViewedProduct.colors.map(
                              (color, colorIndex) => {
                                return (
                                  <div
                                    key={color + colorIndex}
                                    className="grid size-[26px] cursor-pointer place-items-center rounded-full border-3 transition-[border-color] duration-300 ease-in-out hover:border-[#c18d6c]"
                                    style={{
                                      borderColor:
                                        colorIndex === 0
                                          ? "#c18d6c"
                                          : "transparent",
                                    }}
                                    onClick={(e) => {
                                      const selectedColorElement =
                                          e.currentTarget,
                                        colorElements =
                                          selectedColorElement.parentElement
                                            .children,
                                        imageContainerElements =
                                          selectedColorElement.parentElement.parentElement.parentElement.querySelectorAll(
                                            ".img-container",
                                          );

                                      Object.values(colorElements).forEach(
                                        (colorElement) =>
                                          (colorElement.style.borderColor =
                                            "transparent"),
                                      );

                                      selectedColorElement.style.borderColor =
                                        "#c18d6c";

                                      Object.values(
                                        imageContainerElements,
                                      ).forEach((imageElement) => {
                                        imageElement.style.opacity = "0";
                                        imageElement.style.pointerEvents =
                                          "none";
                                      });

                                      Object.values(imageContainerElements)[
                                        colorIndex
                                      ].style.opacity = "1";
                                      Object.values(imageContainerElements)[
                                        colorIndex
                                      ].style.pointerEvents = "auto";
                                    }}
                                  >
                                    <div
                                      className={`size-4 rounded-full ring-1 ${color === "white" ? "ring-neutral-200" : "ring-transparent"}`}
                                      style={{
                                        background:
                                          color !== "Multicolor"
                                            ? color
                                            : "linear-gradient(90deg, blue 0%, red 40%, green 80%)",
                                      }}
                                    />
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    );
                },
              )}
            </div>
          </div>
        </section>
      )}
      <AddToCart
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        product={selectedAddToCartProduct}
      />
    </main>
  );
}
