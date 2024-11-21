import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";
import { useEffect } from "react";
import { CgClose, CgTrash } from "react-icons/cg";
import { TbHeartExclamation } from "react-icons/tb";

export default function Wishlist({
  isWishlistModalOpen,
  setIsWishlistModalOpen,
  wishlistItems,
}) {
  useEffect(() => {
    document.body.style.overflow = isWishlistModalOpen ? "hidden" : "unset";
  }, [isWishlistModalOpen]);

  return (
    <div
      className={`fixed inset-0 h-dvh w-dvw overflow-y-auto overflow-x-hidden text-sm font-semibold transition-[opacity,background-color] duration-500 ease-in-out md:text-base [&::-webkit-scrollbar]:[-webkit-appearance:scrollbarthumb-vertical] ${isWishlistModalOpen ? "pointer-events-auto bg-neutral-700/60 opacity-100 delay-0" : "opcaity-0 pointer-events-none bg-neutral-700/0 delay-100"}`}
      id="wishlist-bg"
      onClick={(event) =>
        event.target.id === "wishlist-bg" && setIsWishlistModalOpen(false)
      }
    >
      <div
        className={`ml-auto flex min-h-full w-full flex-col justify-between bg-neutral-50 px-5 pt-5 text-neutral-500 transition-[transform] delay-200 duration-300 ease-in-out sm:w-3/4 sm:rounded-l-lg sm:px-6 sm:pt-6 md:w-[450px] ${isWishlistModalOpen ? "translate-x-0 delay-200" : "translate-x-full delay-0"}`}
      >
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold md:text-lg">
              Wishlist (
              {wishlistItems?.length
                ? wishlistItems.reduce(
                    (accumulator, item) => accumulator + 1,
                    0,
                  )
                : 0}
              )
            </h3>
            <CgClose
              className="cursor-pointer"
              size={24}
              onClick={() => setIsWishlistModalOpen(false)}
            />
          </div>
          {!!wishlistItems?.length ? (
            <ul className="mb-4 space-y-2.5">
              {wishlistItems.map((wishlistItem, wishlistItemIndex) => {
                return (
                  <li
                    key={wishlistItem + wishlistItemIndex}
                    className="flex w-full items-stretch justify-between gap-x-2.5 rounded-lg bg-white p-2.5 shadow-[2px_2px_10px_0_rgba(0,0,0,0.025)]"
                  >
                    <TransitionLink
                      href={`/product/${wishlistItem.title.split(" ").join("-").toLowerCase()}`}
                      className="relative min-h-full overflow-hidden rounded-md bg-[#F0F0F0] max-sm:w-16 sm:aspect-[1.1/1] sm:h-14"
                      hasModal={true}
                      setIsModalOpen={setIsWishlistModalOpen}
                    >
                      <Image
                        className="h-full w-full object-contain"
                        src={wishlistItem.imgURL}
                        alt={wishlistItem.title}
                        fill
                        sizes="15vh"
                      />
                    </TransitionLink>
                    <div className="grow text-neutral-400">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex justify-between gap-x-5">
                          <div>
                            <TransitionLink
                              href={`/product/${wishlistItem.title.split(" ").join("-").toLowerCase()}`}
                              className="underline-offset-1 hover:underline"
                              hasModal={true}
                              setIsModalOpen={setIsWishlistModalOpen}
                            >
                              <h4 className="text-neutral-600">
                                {wishlistItem.title}
                              </h4>
                            </TransitionLink>
                          </div>
                          <span className="shrink-0 text-neutral-600">
                            ৳{" "}
                            {(
                              wishlistItem.discount || wishlistItem.price
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex grow items-end justify-between">
                          <div
                            className="mt-auto flex w-fit cursor-pointer items-center justify-between gap-x-1 font-semibold transition-[color] duration-300 ease-in-out hover:text-red-500"
                            onClick={() => {
                              localStorage.setItem(
                                "wishlistItems",
                                JSON.stringify(
                                  wishlistItems.filter(
                                    (item) => item.title !== wishlistItem.title,
                                  ),
                                ),
                              );
                              window.dispatchEvent(
                                new Event("storageWishlist"),
                              );
                            }}
                          >
                            <CgTrash className="text-sm" />
                            <p className="text-xs">Remove</p>
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
              <TbHeartExclamation className="size-24 text-[#F4D3BA]" />
              <p className="mt-2 text-neutral-400">The wishlist is empty.</p>
              <TransitionLink
                hasModal={true}
                setIsModalOpen={setIsWishlistModalOpen}
                href="/shop"
                className="mt-9 block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
              >
                Let&apos;s Shop
              </TransitionLink>
            </div>
          )}
        </div>
        {!!wishlistItems?.length && (
          <div className="sticky bottom-0 space-y-4 bg-neutral-50 pb-5 sm:pb-6">
            <hr className="h-0.5 w-full bg-neutral-100" />
            <button
              onClick={() => {
                localStorage.removeItem("wishlistItems");
                window.dispatchEvent(new Event("storageWishlist"));
              }}
              className="block w-full rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
            >
              Remove All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
