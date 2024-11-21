import { adminAuth } from "@/firebase-admin.config";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { uid } = await req.json();

  console.log("verify body", req.body);
  console.log("verify uid (api)", req.uid);

  try {
    // Update the user's emailVerified field
    await adminAuth.updateUser(uid, { emailVerified: true });

    console.log("verify success");

    return NextResponse.json(
      { message: "Email verified successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.log("verify fail", error);
    return NextResponse.json(
      { message: "Failed to verify email." },
      { status: 500 },
    );
  }
}
