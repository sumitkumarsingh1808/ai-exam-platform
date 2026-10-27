import { NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIES.user);
  return response;
}
