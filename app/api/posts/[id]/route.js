import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ================= DELETE =================
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const postId = Number(id);

    if (!postId) {
      return NextResponse.json({ success: false });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ success: false });
  }
}

// ================= UPDATE =================
export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const postId = Number(id);
    const body = await req.json();

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ error: "Update failed" });
  }
}