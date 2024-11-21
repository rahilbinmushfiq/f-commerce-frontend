import TransitionLink from "@/app/components/ui/TransitionLink";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";

const Category = () => {
  const categories = [
    {
      name: "Casual Shirts",
      img: "/categories/casual-shirt.jpg",
    },
    {
      name: "Denim Pants",
      img: "/categories/denim-pant.jpg",
    },
    {
      name: "Polos",
      img: "/categories/polo.jpg",
    },
    {
      name: "T-shirts",
      img: "/categories/t-shirt.jpg",
    },
  ];
  return (
    <div className="relative w-full overflow-hidden bg-[#FBEDE2]">
      <div className="absolute -bottom-24 h-[90%] w-[350%] opacity-50 sm:bottom-0 sm:top-0 sm:w-[150%] md:w-[125%] lg:top-1/2 lg:w-[125%] lg:-translate-y-1/2 xl:w-full 2xl:-bottom-10 2xl:top-[unset] 2xl:h-[105%] 2xl:translate-y-0">
        <Image
          src="/shapes/curved-dotted-line-3.svg"
          alt="Curved dotted line"
          className="object-contain lg:object-cover"
          height={0}
          width={0}
          sizes="100vw"
          fill
        />
      </div>
      <div className="relative mx-auto px-5 py-8 md:py-10 lg:py-12 xl:max-w-[1200px] xl:px-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
            Browse <span className="max-sm:hidden">Our</span> Categories
          </h1>
          <div className="relative">
            <TransitionLink
              className="flex items-center gap-2 text-[10px] transition-[gap] duration-300 ease-in-out hover:gap-3 md:text-base"
              href="/shop"
            >
              View All{" "}
              <span className="rounded-full border border-black p-1 md:p-2">
                <FaArrowRightLong />
              </span>
            </TransitionLink>
            <div className="absolute -left-3 top-0 aspect-[2.1/1] w-14 -translate-x-full md:-left-7 md:w-16 lg:w-20 xl:-left-16">
              <Image
                src="/shapes/custom-arrow-right.png"
                alt="Right arrow"
                className="object-contain"
                height={0}
                width={0}
                sizes="25vw"
                fill
              />
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:max-lg:[&>a:last-child]:hidden">
          {categories.map((category, categoryIndex) => {
            return (
              <TransitionLink
                key={category.name + categoryIndex}
                href={{
                  pathname: "/shop",
                  query: {
                    category: category.name,
                  },
                }}
                className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-[length:100%] bg-center bg-no-repeat text-2xl font-semibold text-white transition-[background-size] duration-300 ease-in-out after:absolute after:inset-0 after:h-full after:w-full after:bg-black after:bg-opacity-40 after:content-[''] hover:bg-[length:115%]"
                style={{
                  backgroundImage: `url(${category.img})`,
                }}
              >
                <p className="z-[2]">{category.name}</p>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Category;
