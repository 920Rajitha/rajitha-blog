import { prisma } from "@/lib/prisma";

// GET approved comments for a selected blog post
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
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(comments, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("GET comments error:", error);

    return Response.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

// POST a new comment for admin approval
export async function POST(req) {
  try {
    const body = await req.json();

    const { name, content, postId } = body;

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

    const cleanName = name.trim();
    const cleanContent = content.trim();

    if (!cleanName || !cleanContent) {
      return Response.json(
        { error: "Name and comment are required" },
        { status: 400 }
      );
    }

    if (cleanName.length > 60 || cleanContent.length > 2000) {
      return Response.json(
        { error: "Name or comment is too long" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return Response.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        name: cleanName,
        content: cleanContent,
        postId,
        approved: false,
      },
      select: {
        id: true,
        name: true,
        content: true,
        postId: true,
        approved: true,
        createdAt: true,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Comment submitted for admin approval",
        comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST comment error:", error);

    return Response.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}