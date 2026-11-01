import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(req) {
  try {
    if (!(await isAdmin())) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    if (!["pending", "approved"].includes(status)) {
      return Response.json(
        { error: "Invalid comment status" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        approved: status === "approved",
      },
      include: {
        post: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);

    return Response.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}