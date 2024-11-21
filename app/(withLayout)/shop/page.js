"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { products } from "@/app/data/products";
import { useSearchParams } from "next/navigation";
import thunderShape from "@/public/shapes/thunder-with-stroke.svg";
import AddToCart from "@/app/components/shop/AddToCart";
import Filter from "@/app/components/shop/Filter";
import ShopCards from "@/app/components/shop/ShopCards";

export default function Shop() {
  const [isFilterButtonClicked, setIsFilterButtonClicked] = useState(false);
  const [selectedValues, setSelectedValues] = useState({
    sortBy: new Set([]),
    filterBy: new Set([]),
    category: new Set([]),
    sizes: new Set([]),
    colors: new Set([]),
    materials: new Set([]),
    price: {
      min: undefined,
      max: undefined,
    },
  });
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedAddToCartProduct, setSelectedAddToCartProduct] =
    useState(null);
  const [keyword, setKeyword] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // console.log("teshting searchParams", searchParams.get("filterBy"));
    // console.log("teshting selectedOption", searchParams.get("filterBy"));
    setKeyword(searchParams.get("search"));
    searchParams.get("filterBy") &&
      setSelectedValues((prevSelectedValues) => ({
        ...prevSelectedValues,
        filterBy: [searchParams.get("filterBy")],
      }));
    searchParams.get("category") &&
      setSelectedValues((prevSelectedValues) => ({
        ...prevSelectedValues,
        category: [searchParams.get("category")],
      }));
  }, [searchParams]);

  if (!products.length)
    return <h1 className="text-center text-5xl font-bold">Loading...</h1>;

  return (
    <main className="relative overflow-hidden pb-16 pt-28 [&_img]:pointer-events-none">
      <div className="absolute -left-3 top-28 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl min-[1200px]:fixed" />
      <div className="absolute -bottom-20 -right-3 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl lg:-bottom-5 min-[1200px]:fixed" />
      <div className="space-y-7 px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
        {!keyword?.length &&
        Object.values(selectedValues).every(
          (selectedValue) => !selectedValue.length,
        ) ? (
          <p>
            Displaying {filteredProducts.length || "no"} item
            {filteredProducts.length > 1 ? "s" : ""}
          </p>
        ) : (
          <p className="relative w-fit">
            {filteredProducts.length || "No"} item
            {filteredProducts.length > 1 && "s"} found {!!keyword && "for"}
            {!!keyword && (
              <span className="font-semibold"> &quot;{keyword}&quot;</span>
            )}
            {Object.values(selectedValues).some(
              (selectedValue) => selectedValue.length,
            ) && " with these selected filters:"}
            <div className="absolute -right-1.5 bottom-1/4 aspect-square w-7 translate-x-full rotate-[26deg]">
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
          </p>
        )}
        <button
          className={`flex items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[18px] py-3 transition-colors duration-300 ease-in-out hover:bg-[#fbcfb0] ${isFilterButtonClicked ? "hidden" : "block"}`}
          onClick={() => setIsFilterButtonClicked(true)}
        >
          <p className="font-semibold">Filter</p>
          <HiOutlineAdjustmentsHorizontal size={20} />
        </button>
        <Filter
          isFilterButtonClicked={isFilterButtonClicked}
          filteredProducts={filteredProducts}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
        <ShopCards
          keyword={keyword}
          selectedValues={selectedValues}
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
          setSelectedAddToCartProduct={setSelectedAddToCartProduct}
          setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        />
      </div>
      <AddToCart
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        product={selectedAddToCartProduct}
      />
    </main>
  );
}
