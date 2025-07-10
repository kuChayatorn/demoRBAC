import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload; // e.g. { sub, role, email }
  } catch {
    return null;
  }
}
