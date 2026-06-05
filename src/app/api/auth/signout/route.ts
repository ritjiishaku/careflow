import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  response.cookies.set("next-auth.session-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("next-auth.csrf-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("__Host-next-auth.csrf-token", "", { maxAge: 0, path: "/" });
  return response;
}
