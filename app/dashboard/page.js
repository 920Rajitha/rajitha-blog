"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");


const router = useRouter();

useEffect(() => {
  const isAdmin = localStorage.getItem("admin");

  if (!isAdmin) {
    router.push("/login");
  }
}, []);

 const loadPosts = async () => {
  try {
    const res = await fetch("/api/posts", {
      cache: "no-store",
    });

    const text = await res.text(); // 👈 important

    const data = text ? JSON.parse(text) : [];

    setPosts(data);

  } catch (err) {
    console.error("Fetch error:", err);
    setPosts([]); // fallback
  }
};

  useEffect(() => {
    loadPosts();
  }, []);

  const addPost = async () => {
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    loadPosts();
  };

  // 🔥 FIXED DELETE
  const deletePost = async (id) => {
  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    const text = await res.text(); // 🔥 SAFE
    const data = text ? JSON.parse(text) : {};

    if (data.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Delete failed");
    }

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="p-6 md:p-10 bg-[#0f172a] min-h-screen text-white">

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* ADD POST */}
      <div className="bg-[#1e293b] p-5 mb-6 rounded-xl">

        <input
          placeholder="Title"
          className="w-full p-2 mb-3 text-black rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          className="w-full p-2 mb-3 text-black rounded"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={addPost}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Post
        </button>
      </div>

      {/* POSTS */}
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="bg-[#1e293b] p-4 rounded-xl">

            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-gray-300 text-sm mt-1">
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

      <button
  onClick={() => {
    localStorage.removeItem("admin");
    window.location.href = "/login";
  }}
  className="bg-red-500 px-3 py-1 rounded mb-4"
>
  Logout
</button>

    </div>
  );
}