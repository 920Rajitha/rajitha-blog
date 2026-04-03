import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { postId, userId } = await req.json();

  try {
    // already liked?
    const existing = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existing) {
      return Response.json({ message: "Already liked" });
    }

    // create like
    await prisma.like.create({
      data: { postId, userId },
    });

    // increase count
    await prisma.post.update({
      where: { id: postId },
      data: {
        likes: { increment: 1 },
      },
    });

    return Response.json({ message: "Liked" });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error" }, { status: 500 });
  }
}