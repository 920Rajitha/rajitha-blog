import prisma from "@/lib/prisma";

export async function POST(req) {
  const { username, password } = await req.json();

  const user = await prisma.user.findFirst({
    where: { username, password },
  });

  if (!user) {
    return Response.json({ error: "Invalid login" }, { status: 401 });
  }

  return Response.json({ message: "Success" });
}