"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateIsFromCheckout(isFromCheckout, redirectURL) {
  cookies().set("is_from_checkout", isFromCheckout);
  if (redirectURL) redirect(redirectURL);
}

export async function CheckoutVisitBasedRedirect() {
  const isFromCheckout = cookies().get("is_from_checkout")?.value;
  if (isFromCheckout === "true") redirect("/checkout");
  else redirect("/login");
}
