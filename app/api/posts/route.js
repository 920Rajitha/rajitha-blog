
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

const allowedCategories = [
  "Gaming",
  "Technology",
  "Programming",
  "Tutorials",
];

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(posts);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    return Response.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    if (!(await isAdmin())) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, content, category } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return Response.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    if (!allowedCategories.includes(category)) {
      return Response.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category,
      },
    });

    return Response.json(post, { status: 201 });
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    return Response.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
