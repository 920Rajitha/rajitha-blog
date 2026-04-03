"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [counts, setCounts] = useState([]);

  // ✅ ADDED (fix error)
  const [expandedPost, setExpandedPost] = useState(null);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setPosts(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();

    const liked = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setLikedPosts(liked);

    const temp = ["All Posts", "Web Dev", "Programming", "DevOps", "Database"]
      .map(() => Math.floor(Math.random() * 20));
    setCounts(temp);
  }, []);

  const getUserId = () => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }
    return id;
  };

  const likePost = async (postId) => {
    if (likedPosts.includes(postId)) return;

    const userId = getUserId();

    await fetch("/api/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    });

    const updated = [...likedPosts, postId];
    setLikedPosts(updated);
    localStorage.setItem("likedPosts", JSON.stringify(updated));

    loadPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] text-gray-200 flex">

      {/* MAIN */}
      <div className="flex-1 px-5 md:px-10 py-10">

        {/* HERO */}
        <div className="bg-[#0f172a] border border-white/10 
        p-6 md:p-8 rounded-2xl mb-12 
        shadow-xl backdrop-blur-md">

          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-wide">
            Welcome to Rajitha Blog 🚀
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            Your source for development insights, tutorials and best practices.
          </p>

        </div>

        {/* POSTS TITLE */}
        <h2 className="text-xl md:text-2xl font-semibold mb-8 text-white tracking-wide">
          Featured Posts
        </h2>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">

          {posts.map((p) => {
            const liked = likedPosts.includes(p.id);

            return (
              <div
                key={p.id}
                className="group bg-[#0f172a]/80 
                border border-white/10 
                rounded-2xl p-6 
                backdrop-blur-lg shadow-lg 
                hover:shadow-2xl hover:-translate-y-2 
                transition-all duration-300 relative overflow-hidden"
              >

                {/* HOVER GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                transition duration-500 bg-gradient-to-br 
                from-blue-500/10 to-purple-500/10"></div>

                {/* CONTENT */}
                <div className="relative z-10">

                  {/* TITLE */}
                  <h2 className="text-lg md:text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition">
                    {p.title}
                  </h2>

                  {/* CONTENT */}
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {expandedPost === p.id
                      ? p.content
                      : p.content?.length > 120
                      ? `${p.content.substring(0, 120)}...`
                      : p.content}
                  </p>

                  {/* READ MORE */}
                  {p.content?.length > 120 && (
                    <button
                      onClick={() =>
                        setExpandedPost(expandedPost === p.id ? null : p.id)
                      }
                      className="text-blue-400 text-xs mb-4 hover:underline"
                    >
                      {expandedPost === p.id ? "Show Less ▲" : "Read More →"}
                    </button>
                  )}

                  {/* FOOTER */}
                  <div className="flex justify-between items-center">

                    <span className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-3">

                      <span className="text-sm text-gray-400">
                        ❤️ {p.likes}
                      </span>

                      <button
                        onClick={() => likePost(p.id)}
                        disabled={liked}
                        className={`
                          px-4 py-1.5 rounded-full text-xs font-medium
                          flex items-center gap-1
                          transition-all duration-300
                          border
                          ${
                            liked
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500"
                          }
                        `}
                      >
                        {liked ? "Liked ❤️" : "Like"}
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden xl:block w-72 p-6 border-l border-white/10 bg-white/5 backdrop-blur-md">

        <h3 className="text-xs text-gray-400 mb-4 font-semibold tracking-wide">
          RECENT POSTS
        </h3>

        <div className="space-y-3 text-sm">
          {posts.slice(0, 5).map((p) => (
            <div key={p.id}>
              <p className="text-gray-200 hover:text-white cursor-pointer">
                {p.title}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>

        <h3 className="text-xs text-gray-400 mt-8 mb-4 font-semibold tracking-wide">
          POPULAR TAGS
        </h3>

        <div className="flex flex-wrap gap-2">
          {["React", "Node", "Next.js", "Tailwind", "AI"].map((tag, i) => (
            <span
              key={i}
              className="bg-white/10 px-3 py-1 rounded text-xs text-gray-300 hover:bg-white/20 transition"
            >
              {tag}
            </span>
          ))}
        </div>

      </div>

    </div>
  );
}