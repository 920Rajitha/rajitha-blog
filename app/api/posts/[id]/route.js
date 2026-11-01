
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

// DELETE POST
export async function DELETE(req, context) {
  try {
    if (!(await isAdmin())) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const postId = Number(id);

    if (!Number.isInteger(postId) || postId <= 0) {
      return Response.json(
        { success: false, error: "Invalid post ID" },
        { status: 400 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return Response.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}

// UPDATE POST
export async function PUT(req, context) {
  try {
    if (!(await isAdmin())) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const postId = Number(id);

    if (!Number.isInteger(postId) || postId <= 0) {
      return Response.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body.title?.trim() || !body.content?.trim()) {
      return Response.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return Response.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
