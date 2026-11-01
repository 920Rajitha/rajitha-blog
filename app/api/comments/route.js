import { prisma } from "@/lib/prisma";

// GET approved comments for a post
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = Number(searchParams.get("postId"));

    if (!Number.isInteger(postId) || postId <= 0) {
      return Response.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        approved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(comments);
  } catch (error) {
    return Response.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

// POST new comment
export async function POST(req) {
  try {
    const { name, content, postId } = await req.json();

    if (
      typeof name !== "string" ||
      typeof content !== "string" ||
      !Number.isInteger(postId) ||
      postId <= 0
    ) {
      return Response.json(
        { error: "Invalid comment details" },
        { status: 400 }
      );
    }

    if (!name.trim() || !content.trim()) {
      return Response.json(
        { error: "Name and comment are required" },
        { status: 400 }
      );
    }

    if (name.trim().length > 60 || content.trim().length > 2000) {
      return Response.json(
        { error: "Comment is too long" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return Response.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        name: name.trim(),
        content: content.trim(),
        postId,
        approved: false,
      },
    });

    return Response.json(
      {
        message: "Comment submitted for approval",
        comment,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}