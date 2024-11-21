"use client";

import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import TransitionLink from "@/app/components/ui/TransitionLink";
import Image from "next/image";
import { products } from "@/app/data/products";
import { CgGift, CgHeart, CgShoppingCart, CgTrending } from "react-icons/cg";
import { LuBadge } from "react-icons/lu";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineNewReleases } from "react-icons/md";
import { TbRosetteDiscount } from "react-icons/tb";
import AddToCart from "@/app/components/shop/AddToCart";
import toast from "react-hot-toast";

const Trending = () => {
  const trendingProducts = products
    .filter((product) => product.salesThisMonth >= 15 && product.inStock)
    .slice(0, 4);

  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedAddToCartProduct, setSelectedAddToCartProduct] =
    useState(null);

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
  }, []);

  if (trendingProducts.length)
    return (
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-10 z-[0] h-full w-[200%] opacity-50 sm:-top-14 min-[800px]:-top-4 lg:top-14 lg:w-2/3 xl:w-1/2">
          <Image
            src="/shapes/curved-dotted-line-1.svg"
            alt="Curved dotted line"
            className="object-contain lg:object-cover"
            height={0}
            width={0}
            sizes="100vw"
            fill
          />
        </div>
        <div className="relative mx-auto xl:max-w-[1200px]">
          <div className="z-[-1]">
            <div className="absolute left-[75%] top-[85%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-[100%] bg-[#FEDCBF] opacity-70 blur-[60px] md:left-[90%] md:blur-[40px] xl:h-[187px] xl:w-[214px] 2xl:left-[100%]" />
            <div className="absolute top-[40%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-[100%] bg-[#FEDCBF] opacity-70 blur-[60px] md:blur-[40px] lg:top-[35%] xl:h-[187px] xl:w-[214px]" />
            <div className="absolute left-[60%] top-[20%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-[100%] bg-[#E0FCDC] opacity-70 blur-[60px] md:blur-[40px] xl:h-[187px] xl:w-[214px]" />
          </div>
          <div className="relative z-[0] mx-auto px-5 py-8 md:py-10 lg:py-12 xl:max-w-[1200px] xl:px-0">
            <div className="mb-10 flex items-center justify-between">
              <h1 className="relative text-xl font-bold md:text-2xl lg:text-3xl">
                <span className="max-sm:hidden">See What&apos;s </span>Trending
                Now
                <div className="absolute -right-1.5 bottom-1/2 aspect-square w-7 translate-x-full sm:w-8 lg:w-9">
                  <Image
                    src="/shapes/thunder.svg"
                    alt="Thunder"
                    className="object-contain"
                    height={0}
                    width={0}
                    sizes="25vw"
                    fill
                  />
                </div>
              </h1>
              <TransitionLink
                className="flex items-center gap-2 text-[10px] transition-[gap] duration-300 ease-in-out hover:gap-3 md:text-base"
                href={{
                  pathname: "/shop",
                  query: {
                    filterBy: "Popular",
                  },
                }}
              >
                View All{" "}
                <span className="rounded-full border border-black p-1 md:p-2">
                  <FaArrowRightLong />
                </span>
              </TransitionLink>
            </div>
            <section className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 sm:max-lg:[&>div:last-child]:hidden">
              {trendingProducts.map((trendingProduct, trendingProductIndex) => {
                return (
                  <div
                    key={trendingProductIndex + trendingProduct.title}
                    className="relative [&>div:last-child]:hover:-translate-y-[calc(100%-1px)] [&>div:not(:last-child)]:hover:translate-x-0 [&>div]:hover:opacity-100 [&_img]:hover:scale-110"
                  >
                    <TransitionLink
                      href={`/product/${trendingProduct.title.split(" ").join("-").toLowerCase()}`}
                    >
                      <div className="relative mb-3 h-[250px] w-full overflow-hidden rounded-[20px] bg-[#F0F0F0] sm:h-80 lg:h-[26vh]">
                        {trendingProduct.imageURLs.map(
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
                                  alt={trendingProduct.title}
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
                                      alt={trendingProduct.title}
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
                          {trendingProduct.salesThisMonth >= 15 && (
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
                          {trendingProduct.isNewArrival && (
                            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#5c49d9] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+31px+10px)]">
                              <MdOutlineNewReleases className="mx-1.5 h-9 w-6 object-contain" />
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                New!
                              </p>
                            </div>
                          )}
                          {trendingProduct.discount && (
                            <div
                              className={`relative h-9 w-9 overflow-hidden rounded-lg bg-[#32aa54] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] ${trendingProduct.discount.amount.includes("%") ? "hover:w-[calc(36px+56px+10px)]" : "hover:w-[calc(36px+68px+10px)]"}`}
                            >
                              <TbRosetteDiscount className="mx-1.5 h-9 w-6 object-contain" />
                              <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
                                {trendingProduct.discount.amount} OFF!
                              </p>
                            </div>
                          )}
                        </div>
                        {!trendingProduct.inStock && (
                          <p className="pointer-events-none absolute left-0 right-0 top-1/2 w-full -translate-y-1/2 bg-neutral-600 bg-opacity-25 py-2.5 text-center font-semibold text-white backdrop-blur-md">
                            Out of Stock
                          </p>
                        )}
                      </div>
                      <div className="flex gap-x-3 [&_p]:w-fit [&_p]:bg-white">
                        <p
                          className={`relative w-fit text-base font-semibold xl:text-lg ${trendingProduct.discount ? "text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']" : "text-neutral-800"}`}
                        >
                          ৳ {trendingProduct.price.toLocaleString()}
                        </p>
                        {trendingProduct.discount && (
                          <p className="text-base font-semibold text-neutral-800 xl:text-lg">
                            ৳{" "}
                            {trendingProduct.discount.finalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <h3 className="line-clamp-1 w-fit bg-white text-base font-semibold text-neutral-800 xl:text-lg">
                        {trendingProduct.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-1 w-fit bg-white text-xs text-neutral-700 xl:text-sm">
                        {trendingProduct.categories.mainCategory +
                          ", " +
                          trendingProduct.categories.subCategories.join(", ")}
                      </p>
                    </TransitionLink>
                    <div className="absolute right-2.5 top-2.5 flex -translate-x-5 flex-col items-end space-y-1.5 opacity-0 transition-[transform,opacity] duration-300 ease-in-out [&>button]:rounded-lg [&>button]:font-semibold [&>button]:text-neutral-700 [&>button]:shadow-[3px_3px_20px_0_rgba(0,0,0,0.25)] hover:[&>button]:opacity-100">
                      {!!trendingProduct.inStock && (
                        <button
                          className="relative h-9 w-9 overflow-hidden bg-[#FBEDE2] transition-[background-color,width] hover:w-[calc(36px+72px+10px)] hover:bg-[#F4D3BA]"
                          onClick={() => {
                            setSelectedAddToCartProduct(trendingProduct);
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
                        onClick={() => handleAddToWishlist(trendingProduct)}
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
                        {trendingProduct.colors.map((color, colorIndex) => {
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
            </section>
          </div>
        </div>
        <AddToCart
          isAddToCartModalOpen={isAddToCartModalOpen}
          setIsAddToCartModalOpen={setIsAddToCartModalOpen}
          product={selectedAddToCartProduct}
        />
      </div>
    );
};

export default Trending;
