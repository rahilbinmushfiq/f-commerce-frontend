import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";
import { useEffect } from "react";
import { CgClose, CgHeart, CgTrash } from "react-icons/cg";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { TbShoppingCartExclamation } from "react-icons/tb";

export default function Cart({
  isCartModalOpen,
  setIsCartModalOpen,
  cartItems,
}) {
  useEffect(() => {
    document.body.style.overflow = isCartModalOpen ? "hidden" : "unset";
  }, [isCartModalOpen]);

  return (
    <div
      className={`fixed inset-0 h-dvh w-dvw overflow-y-auto overflow-x-hidden text-sm font-semibold transition-[background-color] duration-500 ease-in-out md:text-base [&::-webkit-scrollbar]:[-webkit-appearance:scrollbarthumb-vertical] ${isCartModalOpen ? "pointer-events-auto bg-neutral-700/60 delay-0" : "pointer-events-none bg-neutral-700/0 delay-100"}`}
      id="cart-bg"
      onClick={(event) =>
        event.target.id === "cart-bg" && setIsCartModalOpen(false)
      }
    >
      <div
        className={`ml-auto flex min-h-full w-full flex-col justify-between bg-neutral-50 px-5 pt-5 text-neutral-500 transition-[transform] delay-200 duration-300 ease-in-out sm:w-3/4 sm:rounded-l-lg sm:px-6 sm:pt-6 md:w-[500px] ${isCartModalOpen ? "translate-x-0 delay-200" : "translate-x-full delay-0"}`}
      >
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold md:text-lg">
              Shopping Cart (
              {cartItems?.length
                ? cartItems.reduce(
                    (accumulator, item) =>
                      Number(item.selectedQuantity) + accumulator,
                    0,
                  )
                : 0}
              )
            </h3>
            <CgClose
              className="cursor-pointer"
              size={24}
              onClick={() => setIsCartModalOpen(false)}
            />
          </div>
          <div
            className={`mb-3 mt-7 flex w-fit cursor-pointer items-center justify-between gap-x-1.5 text-xs font-semibold text-red-500 md:text-sm ${!cartItems?.length ? "hidden" : ""}`}
            onClick={() => {
              localStorage.removeItem("cartItems");
              window.dispatchEvent(new Event("storageCart"));
            }}
          >
            <CgTrash size={15} />
            Remove All
          </div>
          {!!cartItems?.length ? (
            <ul className="mb-4 space-y-2.5">
              {cartItems.map((cartItem, cartItemIndex) => {
                return (
                  <li
                    key={cartItem + cartItemIndex}
                    className="flex w-full items-stretch justify-between gap-x-2.5 rounded-lg bg-white p-2.5 shadow-[2px_2px_10px_0_rgba(0,0,0,0.025)]"
                  >
                    <TransitionLink
                      href={`/product/${cartItem.title.split(" ").join("-").toLowerCase()}`}
                      className="relative block min-h-full w-1/4 overflow-hidden rounded-md bg-[#F0F0F0] max-sm:w-20"
                      hasModal={true}
                      setIsModalOpen={setIsCartModalOpen}
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
                              hasModal={true}
                              setIsModalOpen={setIsCartModalOpen}
                            >
                              <h4 className="text-neutral-600">
                                {cartItem.title}
                              </h4>
                            </TransitionLink>
                            <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                              <h5>
                                <span className="max-[389px]:hidden">Unit</span>{" "}
                                Price:
                              </h5>
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
                                  <p>৳ {cartItem.discount.toLocaleString()}</p>
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
                              window.dispatchEvent(new Event("storageCart"));
                            }}
                          >
                            <CgTrash className="text-sm" />
                            <p className="text-xs">Remove</p>
                          </div>
                          <div className="mt-auto flex gap-x-1.5 text-neutral-500 [&>*]:!m-0 [&>*]:grid [&>*]:size-8 [&>*]:place-content-center [&>*]:rounded-md [&>*]:bg-neutral-100 [&>*]:!p-0 [&>*]:text-center hover:[&>*]:bg-[#FBEDE2] sm:[&>*]:rounded-lg">
                            <button
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
                                window.dispatchEvent(new Event("storageCart"));
                              }}
                            >
                              <HiChevronLeft />
                            </button>
                            <input
                              className="w-fit text-center font-semibold [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                                window.dispatchEvent(new Event("storageCart"));
                              }}
                            />
                            <button
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
                                window.dispatchEvent(new Event("storageCart"));
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
          ) : (
            <div className="mt-14 [&>*]:mx-auto [&>*]:w-fit">
              <TbShoppingCartExclamation className="size-24 text-[#F4D3BA]" />
              <p className="mt-2 text-neutral-400">The cart is empty.</p>
              <TransitionLink
                hasModal={true}
                setIsModalOpen={setIsCartModalOpen}
                href="/shop"
                className="mt-9 block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
              >
                Let&apos;s Shop
              </TransitionLink>
            </div>
          )}
        </div>
        {!!cartItems?.length && (
          <div className="sticky bottom-0 space-y-4 bg-neutral-50 pb-5 sm:pb-6">
            <hr className="h-0.5 w-full bg-neutral-100" />
            <div className="flex justify-between">
              <h5 className="text-neutral-400">Subtotal</h5>
              <span>
                ৳{" "}
                {cartItems
                  .reduce(
                    (accumulator, item) =>
                      (item.discount || item.price) * item.selectedQuantity +
                      accumulator,
                    0,
                  )
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex gap-x-2.5 text-neutral-700">
              <TransitionLink
                hasModal={true}
                setIsModalOpen={setIsCartModalOpen}
                href="/shop"
                className="block w-full rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
              >
                Continue Shopping
              </TransitionLink>
              <TransitionLink
                hasModal={true}
                setIsModalOpen={setIsCartModalOpen}
                href="/checkout"
                className="block w-full rounded-lg bg-[#ffddc2] py-2.5 text-center text-sm transition-[background-color] duration-300 hover:bg-[#fbcfb0]"
              >
                Checkout
              </TransitionLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
