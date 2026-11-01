import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;
    const SECRET = process.env.ADMIN_SESSION_SECRET;

    if (!SECRET || !ADMIN_USER || !ADMIN_PASS) {
      return Response.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return Response.json(
        { success: false },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(SECRET);

    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const cookieStore = await cookies();

    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ success: true });

  } catch (error) {
    return Response.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}