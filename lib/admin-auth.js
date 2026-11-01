
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function isAdmin() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("admin_session")?.value;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!token || !secret) {
      return false;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    return payload.role === "admin";
  } catch (error) {
    console.error("Admin authentication failed:", error);
    return false;
  }
}
