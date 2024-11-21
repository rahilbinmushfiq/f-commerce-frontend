import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { updateIsFromCheckout } from "./app/actions/checkout";

export async function middleware(request) {
  const session = cookies().get("user_session")?.value;
  const pathname = request.url;

  // const response = await fetch(`${request.nextUrl.origin}/api/login`, {
  //   headers: {
  //     Cookie: `user_session=${session}`,
  //   },
  // });

  // const { isLogged, isEmailVerified } = await response.json();

  if (/\/user\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/user/profile", pathname));
  if (/\/product\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/shop", pathname));

  if (
    // (pathname.includes("checkout") && !isLogged) ||
    !session &&
    pathname.includes("user")
  ) {
    // const res = NextResponse.redirect(new URL("/login", request.url));
    // if (pathname.includes("checkout"))
    //   res.cookies.set("is_from_checkout", "true");
    // return res;
    return NextResponse.redirect(new URL("/login", pathname));
  }

  if (
    !!session &&
    (pathname.includes("login") || pathname.includes("register"))
  ) {
    return NextResponse.redirect(new URL("/", pathname));
    // else if (isLogged) return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
