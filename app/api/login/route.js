import { adminAuth } from "@/firebase-admin.config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = cookies().get("user_session")?.value;

  if (session == "undefined") {
    return NextResponse.json(
      { isLogged: false, isEmailVerified: false },
      { status: 401 },
    );
  }

  try {
    const token = await adminAuth.verifyIdToken(session);

    if (!token?.email_verified) {
      return NextResponse.json(
        { isLogged: true, isEmailVerified: false },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { isLogged: true, isEmailVerified: true },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { isLogged: true, isEmailVerified: false },
      { status: 401 },
    );
  }
}
