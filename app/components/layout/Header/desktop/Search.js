import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export default function Search({ isMobile, setIsMobileSearchSelected }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <form
      className="relative bg-white text-sm font-semibold text-neutral-600"
      onSubmit={(event) => {
        event.preventDefault();

        const keyword = event.target.lastChild.value;
        router.push(!keyword ? "/shop" : `/shop?search=${keyword}`);
        if (isMobile) setIsMobileSearchSelected(false);
      }}
    >
      <button
        id="search-bar-close-btn"
        className="absolute right-3 top-1/2 z-[1] flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 opacity-0 transition-[background-color,opacity] duration-300 ease-in-out hover:bg-neutral-300 [&>svg]:hover:text-neutral-800"
        type="button"
        onClick={(event) => {
          event.currentTarget.style.opacity = 0;
          event.currentTarget.style.pointerEvents = "none";
          event.currentTarget.parentElement.lastChild.value = "";

          if (!!searchParams.get("search")) router.push("/shop");
          if (isMobile) setIsMobileSearchSelected(false);
        }}
      >
        <IoClose className="size-4 text-neutral-500 transition-[color] duration-300 ease-in-out" />
      </button>
      <FiSearch
        onClick={(event) =>
          event.currentTarget.parentElement.querySelector("#search-bar").focus()
        }
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
      />
      <input
        id="search-bar"
        placeholder="Search Products"
        type="search"
        defaultValue={searchParams.get("search") || undefined}
        className="h-10 w-full rounded-lg border-2 border-transparent bg-[#f3f3f4] px-4 pl-[2.5rem] outline-none transition-[border-color,background-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white [&::-webkit-search-cancel-button]:[-webkit-appearance:none] [&:not(:placeholder-shown)]:border-[#F4D3BA] [&:not(:placeholder-shown)]:bg-white"
        onChange={(event) => {
          event.preventDefault();

          event.target.parentElement.firstChild.style.opacity = !event.target
            .value
            ? "0"
            : "1";

          event.target.parentElement.firstChild.style.pointerEvents = !event
            .target.value
            ? "none"
            : "auto";
        }}
      />
    </form>
  );
}
