import { deliveryPartnerLogos } from "@/app/data/deliveryPartnerLogos";
import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function LogoCarousel() {
  return (
    <div className="grid grid-cols-[auto,auto,auto,auto] justify-between">
      {deliveryPartnerLogos.map((logo) => {
        return (
          <TransitionLink href="#" key={logo.name}>
            <Image
              src={logo.src}
              alt={logo.name}
              className="h-11 w-auto contrast-[.125] grayscale transition-[filter] duration-300 ease-in-out hover:contrast-100 hover:grayscale-0"
            />
          </TransitionLink>
        );
      })}
    </div>
  );
}
