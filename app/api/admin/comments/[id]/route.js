import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

// APPROVE COMMENT
export async function PATCH(req, { params }) {
  try {
    if (!(await isAdmin())) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const commentId = Number(id);

    if (!Number.isInteger(commentId) || commentId <= 0) {
      return Response.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (body.approved !== true) {
      return Response.json(
        { error: "Invalid approval request" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        approved: true,
      },
    });

    return Response.json({
      success: true,
      message: "Comment approved successfully",
      comment,
    });
  } catch (error) {
    console.error("Approve comment error:", error);

    if (error.code === "P2025") {
      return Response.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { error: "Failed to approve comment" },
      { status: 500 }
    );
  }
}

// DELETE COMMENT
export async function DELETE(req, { params }) {
  try {
    if (!(await isAdmin())) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const commentId = Number(id);

    if (!Number.isInteger(commentId) || commentId <= 0) {
      return Response.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return Response.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    if (error.code === "P2025") {
      return Response.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}