import Footer from "../components/layout/Footer/Footer";
import Header from "../components/layout/Header";

export const metadata = {
  title: "Fashion Commerce",
  description:
    "Discover the latest trends in men's fashion at Fashion Commerce. Shop our extensive collection of stylish clothing, footwear, and accessories. Enjoy exclusive deals, fast shipping, and top-notch customer service. Elevate your wardrobe with our curated selection of high-quality men's products.",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col [&>main]:grow">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
