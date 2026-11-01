"use client";

import { useEffect, useMemo, useState } from "react";

const categories = [
  "All Posts",
  "Gaming",
  "Technology",
  "Programming",
  "Tutorials",
];

function getCategory(post) {
  const text = `${post.title || ""} ${post.content || ""}`.toLowerCase();

  if (
    /gaming|game|gamer|fps|minecraft|wukong|playstation|xbox|steam/.test(text)
  ) {
    return "Gaming";
  }

  if (
    /tutorial|how to|step by step|guide|learn|beginner|installation/.test(text)
  ) {
    return "Tutorials";
  }

  if (
    /programming|javascript|python|java|c\+\+|coding|algorithm|function|react|node|next\.js|flutter/.test(text)
  ) {
    return "Programming";
  }

  return "Technology";
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);

  // Search and category states
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Posts");

  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/posts", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();

    try {
      const liked = JSON.parse(
        localStorage.getItem("likedPosts") || "[]"
      );

      setLikedPosts(Array.isArray(liked) ? liked : []);
    } catch {
      setLikedPosts([]);
    }
  }, []);

  // User ID
  const getUserId = () => {
    let id = localStorage.getItem("userId");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }

    return id;
  };

  // Like Post
  const likePost = async (postId) => {
    if (likedPosts.includes(postId)) return;

    try {
      const userId = getUserId();

      const res = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      });

      if (!res.ok) {
        throw new Error("Like failed");
      }

      const updated = [...likedPosts, postId];

      setLikedPosts(updated);
      localStorage.setItem("likedPosts", JSON.stringify(updated));

      await loadPosts();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Search and Category Filtering
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const content = (post.content || "").toLowerCase();
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        content.includes(query);

      const matchesCategory =
        activeCategory === "All Posts" ||
        getCategory(post) === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] text-gray-200 flex">

      {/* MAIN */}
      <div className="flex-1 px-5 md:px-10 py-10">

        {/* HERO */}
        <div className="bg-[#0f172a] border border-white/10 p-6 md:p-8 rounded-2xl mb-10 shadow-xl backdrop-blur-md">

          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-wide">
            Welcome to Rajitha Blog 🚀
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            Your source for development insights, tutorials and best practices.
          </p>

        </div>

        {/* SEARCH */}
        <div className="mb-8">

          <div className="relative max-w-2xl">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search blog posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}

          </div>

        </div>

        {/* CATEGORY FILTERS */}
        <div className="mb-8">

          <h3 className="text-sm font-semibold text-gray-400 mb-4">
            EXPLORE CATEGORIES
          </h3>

          <div className="flex flex-wrap gap-3">

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}

          </div>

        </div>

        {/* POSTS TITLE */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">

          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
            Featured Posts
          </h2>

          <span className="text-sm text-gray-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? "Post" : "Posts"} Found
          </span>

        </div>

        {/* POSTS GRID */}
        {loading ? (

          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Loading posts...</p>
          </div>

        ) : filteredPosts.length === 0 ? (

          <div className="bg-[#0f172a]/80 border border-white/10 rounded-2xl p-10 text-center">

            <div className="text-4xl mb-4">🔍</div>

            <h3 className="text-xl font-semibold text-white mb-2">
              No Posts Found
            </h3>

            <p className="text-gray-400 text-sm mb-5">
              We couldn't find any posts matching your search.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All Posts");
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-8">

            {filteredPosts.map((p) => {
              const liked = likedPosts.includes(p.id);
              const category = getCategory(p);

              return (
                <div
                  key={p.id}
                  className="group bg-[#0f172a]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                >

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

                  <div className="relative z-10">

                    {/* CATEGORY */}
                    <div className="mb-4">
                      <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                        {category}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-lg md:text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition">
                      {p.title}
                    </h2>

                    {/* CONTENT */}
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed whitespace-pre-line">
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
                          setExpandedPost(
                            expandedPost === p.id ? null : p.id
                          )
                        }
                        className="text-blue-400 text-xs mb-4 hover:underline"
                      >
                        {expandedPost === p.id
                          ? "Show Less ▲"
                          : "Read More →"}
                      </button>
                    )}

                    {/* FOOTER */}
                    <div className="flex justify-between items-center gap-3">

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
                          className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-300 border ${
                            liked
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500"
                          }`}
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

        )}

      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden xl:block w-72 p-6 border-l border-white/10 bg-white/5 backdrop-blur-md">

        {/* RECENT POSTS */}
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

        {/* POPULAR TAGS */}
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