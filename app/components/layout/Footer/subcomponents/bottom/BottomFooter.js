import Copyright from "./Copyright";
import FooterMenu from "./FooterMenu";

export default function BottomFooter() {
  return (
    <div className="static z-[200] bg-white px-5 text-sm text-neutral-500 sm:px-8 md:text-base lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 [&_:is(h2,h3,h4)]:text-neutral-700">
      <FooterMenu />
      <hr />
      <Copyright />
    </div>
  );
}