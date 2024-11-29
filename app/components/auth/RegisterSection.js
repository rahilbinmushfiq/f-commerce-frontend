import TransitionLink from "@/app/components/ui/TransitionLink";
import RegisterForm from "./register/RegisterForm";

export default function RegisterSection({ children }) {
  return (
    <div className="sm:max-xl:mx-auto sm:max-xl:max-w-[350px]">
      {/* Heading */}
      <h1 className="text-2xl font-semibold sm:max-xl:text-center">
        Create Account
      </h1>
      <p className="mb-10 mt-2 sm:max-xl:text-center">
        Sign up to get started.
      </p>
      {/* Login page link if user has account */}
      {/* <p className="mb-4 flex justify-between text-xs font-bold md:text-sm">
        Already have an account?{" "}
        <TransitionLink
          className="font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
          href="/login"
        >
          Login
        </TransitionLink>
      </p> */}
      {/* Email and password login section */}
      <RegisterForm />
      {children}
      {/* Login page link if user has account */}
      <p className="mt-5 text-xs md:text-sm">
        Already have an account?{" "}
        <TransitionLink
          className="font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
          href="/login"
        >
          Login
        </TransitionLink>
      </p>
    </div>
  );
}
