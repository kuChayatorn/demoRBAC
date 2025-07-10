import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const JWT_SECRET = process.env.JWT_SECRET!;
  const TOKEN_NAME = "token";
  const MAX_AGE = 60 * 60 * 24; // 1 day
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax",
  });

  return NextResponse.redirect(new URL("/home", req.url));
}
