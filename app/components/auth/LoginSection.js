import TransitionLink from "@/app/components/ui/TransitionLink";
import LoginForm from "./login/LoginForm";

export default function LoginSection({ children }) {
  return (
    <>
      {/* Heading */}
      <h1 className="text-2xl font-semibold">Welcome Back</h1>
      <p className="mb-10 mt-2">
        Enter your credentials to access your account.
      </p>
      {/* Email and password login section */}
      <LoginForm />
      {children}
      {/* Register page link if user doesn't have an account */}
      <p className="mt-5 text-xs md:text-sm">
        Don&apos;t have an account?{" "}
        <TransitionLink
          className="font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
          href="/register"
        >
          Register
        </TransitionLink>
      </p>
    </>
  );
}