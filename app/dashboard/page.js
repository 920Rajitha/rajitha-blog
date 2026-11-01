
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const categories = [
    "Gaming",
    "Technology",
    "Programming",
    "Tutorials",
  ];

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      router.push("/login");
    }
  }, [router]);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/posts", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const addPost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add post");
      }

      setTitle("");
      setContent("");
      setCategory("Technology");

      await loadPosts();
      alert("Post published successfully!");
    } catch (err) {
      console.error("Add post error:", err);
      alert("Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#0f172a] min-h-screen text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("admin");
            window.location.href = "/login";
          }}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* ADD POST */}
      <div className="bg-[#1e293b] p-5 mb-6 rounded-xl">

        <h2 className="text-xl font-semibold mb-4">
          Publish New Post
        </h2>

        <input
          placeholder="Post Title"
          className="w-full p-3 mb-3 text-black rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CATEGORY DROPDOWN */}
        <label className="block mb-2 text-gray-300">
          Select Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-3 text-black rounded"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your post content..."
          className="w-full p-3 mb-3 text-black rounded"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={addPost}
          disabled={loading}
          className="bg-blue-500 px-5 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </div>

      {/* POSTS */}
      <h2 className="text-xl font-bold mb-4">
        All Posts ({posts.length})
      </h2>

      <div className="space-y-4">
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-[#1e293b] p-4 rounded-xl"
          >
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="text-lg font-semibold">
                {p.title}
              </h3>

              <span className="bg-blue-600 px-3 py-1 rounded-full text-xs">
                {p.category || "Technology"}
              </span>
            </div>

            <p className="text-gray-300 text-sm mt-2 whitespace-pre-wrap">
              {p.content}
            </p>

            <button
              onClick={() => deletePost(p.id)}
              className="bg-red-500 px-3 py-1 mt-3 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
