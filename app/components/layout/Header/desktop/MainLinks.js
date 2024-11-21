import TransitionLink from "@/app/components/ui/TransitionLink";
import { usePathname, useSearchParams } from "next/navigation";

export default function MainLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="font-semibold text-neutral-400">
      {/* Navigation links */}
      <ul className="flex items-center gap-x-3.5 xl:gap-x-7 [&_a]:transition-[color] [&_a]:duration-300 [&_a]:ease-in-out">
        <li>
          <TransitionLink
            className={
              pathname === "/" ? "text-neutral-800" : "hover:text-neutral-500"
            }
            href="/"
          >
            Home
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            className={
              searchParams.get("filterBy") === "Popular"
                ? "text-neutral-800"
                : "hover:text-neutral-500"
            }
            // href={{
            //   pathname: "/shop",
            //   query: {
            //     filterBy: "Popular",
            //   },
            // }}
            href="/shop?filterBy=Popular"
          >
            Popular
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            className={
              searchParams.get("filterBy") === "New Arrivals"
                ? "text-neutral-800"
                : "hover:text-neutral-500"
            }
            // href={{
            //   pathname: "/shop",
            //   query: {
            //     filterBy: "New Arrivals",
            //   },
            // }}
            href="/shop?filterBy=New+Arrivals"
          >
            New Arrivals
          </TransitionLink>
        </li>
      </ul>
    </div>
  );
}