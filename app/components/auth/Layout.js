import AuthHeader from "./Header";
import SideImageSection from "./SideImageSection";

export default function AuthLayout({ children }) {
  return (
    <main className="without-layout h-dvh w-full px-5 py-3 text-sm text-neutral-500 sm:flex sm:items-stretch sm:gap-5 sm:px-6 md:text-base lg:gap-8 lg:px-8 xl:px-12 xl:pl-[4.5vw] xl:pr-3 [&>div]:min-h-full [&_:is(h1,h2)]:text-neutral-700 [&_img]:pointer-events-none">
      <section className="w-full pb-8 sm:min-w-[280px] lg:min-w-[325px] xl:min-w-[450px] xl:overflow-y-auto xl:pr-[2vw] xl:[scrollbar-gutter:stable] xl:[&::-webkit-scrollbar-thumb:hover]:bg-neutral-600 xl:[&::-webkit-scrollbar-thumb]:rounded-full xl:[&::-webkit-scrollbar-thumb]:bg-neutral-300 xl:[&::-webkit-scrollbar-track]:rounded-full xl:[&::-webkit-scrollbar-track]:bg-neutral-100 xl:[&::-webkit-scrollbar]:w-[9px] xl:[&::-webkit-scrollbar]:rounded-full xl:[&::-webkit-scrollbar]:bg-neutral-100">
        <AuthHeader />
        {children}
      </section>
      <SideImageSection />
    </main>
  );
}
