import { products } from "@/app/data/products";
import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";
import { useEffect, useState } from "react";
import thunderShape from "@/public/shapes/thunder-with-stroke.svg";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import curvedDottedLineShape from "@/public/shapes/curved-dotted-line-4 (1).svg";
import { LuBadge } from "react-icons/lu";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineNewReleases } from "react-icons/md";
import { Button, Input } from "@nextui-org/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { CgClose, CgHeart, CgRuler, CgShoppingCart } from "react-icons/cg";
import toast from "react-hot-toast";

export default function AddToCart({
  isAddToCartModalOpen,
  setIsAddToCartModalOpen,
  product,
}) {
  if (product)
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

  const [selectedOptions, setSelectedOptions] = useState({
    colorIndex: 0,
    sizeIndex: undefined,
    quantity: 1,
  });

  useEffect(() => {
    document.body.style.overflow = isAddToCartModalOpen ? "hidden" : "unset";
  }, [isAddToCartModalOpen]);

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
      setIsAddToCartModalOpen(false);
    } else {
      toast.error("Please select a size first.");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[11] flex h-dvh w-dvw items-center justify-center overflow-y-auto overflow-x-hidden text-sm font-semibold transition-[opacity,background-color] duration-500 ease-in-out md:text-base [&::-webkit-scrollbar]:[-webkit-appearance:scrollbarthumb-vertical] [&_:is(h1,h2,h3,h4,h5)]:text-neutral-700 ${isAddToCartModalOpen ? "pointer-events-auto bg-neutral-700/60 opacity-100 delay-0" : "opcaity-0 pointer-events-none bg-neutral-700/0 delay-100"}`}
      id="add-to-cart-bg"
      onClick={(event) => {
        if (event.target.id === "add-to-cart-bg") {
          setIsAddToCartModalOpen(false);
          setSelectedOptions({
            colorIndex: 0,
            sizeIndex: undefined,
            quantity: 1,
          });
        }
      }}
    >
      <div
        className={`rounded-xl bg-neutral-50 p-5 text-neutral-500 transition-[transform,opacity] duration-300 ease-in-out max-md:pt-14 ${isAddToCartModalOpen ? "translate-y-0 opacity-100 delay-200" : "translate-y-20 opacity-0 delay-0"}`}
      >
        {!!product && (
          <>
            <div className="relative h-fit md:flex md:gap-x-10">
              <div className="relative min-h-full rounded-lg bg-[#F0F0F0] p-5 max-md:h-[35vh] max-md:w-[60dvw] max-sm:w-[80dvw] md:w-60">
                <Image
                  src={product.images[selectedOptions.colorIndex].imageURLs[0]}
                  alt={`${product.title} ${product.images[selectedOptions.colorIndex].color}`}
                  className="h-full w-full select-none object-contain"
                  sizes="50vw"
                  fill
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
              </div>
              <div className="relative mt-4 md:mt-0 md:min-w-80 lg:min-w-96">
                <h1 className="mb-2.5 w-fit text-xl font-bold sm:text-2xl">
                  {product.title}
                </h1>
                <div className="relative mb-6 flex gap-x-3 text-base font-bold sm:text-lg">
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
                  <div className="flex items-center gap-x-2.5">
                    <h4 className="font-semibold text-neutral-600">
                      Quantity:
                    </h4>
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
              </div>
              <CgClose
                className="absolute right-0 top-0 cursor-pointer max-md:-translate-y-[calc(100%+12px)]"
                size={24}
                onClick={() => {
                  setIsAddToCartModalOpen(false);
                  setSelectedOptions({
                    colorIndex: 0,
                    sizeIndex: undefined,
                    quantity: 1,
                  });
                }}
              />
            </div>
            <hr className="mb-5 mt-10 h-0.5 bg-neutral-100 md:my-5" />
            <div className="flex gap-x-2.5">
              <TransitionLink
                href={`/product/${product.title.split(" ").join("-").toLowerCase()}`}
                className="ml-auto block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
              >
                View Product Details
              </TransitionLink>
              <button
                onClick={() => {
                  handleAddToCart();
                  setSelectedOptions({
                    colorIndex: 0,
                    sizeIndex: undefined,
                    quantity: 1,
                  });
                }}
                className="rounded-lg bg-[#ffddc2] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[#fbcfb0]"
              >
                Add to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
