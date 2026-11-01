
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Load all approved comments or comments for one post
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    // Validate only when postId is provided
    if (
      postId &&
      (!/^\d+$/.test(postId) || Number(postId) <= 0)
    ) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        approved: true,
        ...(postId ? { postId: Number(postId) } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        content: true,
        postId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comments, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("GET comments error:", error);

    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

// POST: Submit a new comment for admin approval
export async function POST(request) {
  try {
    const body = await request.json();

    const postId = Number(body.postId);
    const name = String(body.name || "").trim();
    const content = String(body.content || "").trim();

    if (
      !Number.isInteger(postId) ||
      postId <= 0 ||
      !name ||
      !content
    ) {
      return NextResponse.json(
        { error: "Please provide a valid post, name and comment." },
        { status: 400 }
      );
    }

    if (name.length > 60 || content.length > 2000) {
      return NextResponse.json(
        { error: "Name or comment is too long." },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        name,
        content,
        postId,
        approved: false,
      },
      select: {
        id: true,
        name: true,
        content: true,
        postId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment submitted for admin approval.",
        comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST comment error:", error);

    return NextResponse.json(
      { error: "Failed to submit comment." },
      { status: 500 }
    );
  }
}
