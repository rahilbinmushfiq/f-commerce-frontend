import { Oxygen, Leckerli_One } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const oxygen = Oxygen({ subsets: ["latin"], weight: ["300", "400", "700"] });
const leckerliOne = Leckerli_One({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Fashion Commerce",
  description:
    "Discover the latest trends in men's fashion at Fashion Commerce. Shop our extensive collection of stylish clothing, footwear, and accessories. Enjoy exclusive deals, fast shipping, and top-notch customer service. Elevate your wardrobe with our curated selection of high-quality men's products.",
};

export default function RootLayout({ children }) {
  return (
    <html
      className="landscape:[&:not(:has(.without-layout))]:[scrollbar-gutter:stable]"
      lang="en"
    >
      {/* <head>
        <link rel="icon" href="/favicon.ico" />
      </head> */}
      <body className={oxygen.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
