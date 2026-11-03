
"use client";

import { useEffect, useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import CommentSection from "@/components/CommentSection";

const categories = [
  "All Posts",
  "Gaming",
  "Technology",
  "Programming",
  "Tutorials",
];

function getCategory(post) {
  return post.category || "Technology";
}

// Convert HTML to plain text for search
function getPlainText(html) {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Safely display formatted post content
function FormattedContent({ content, expanded }) {
  const safeHTML = DOMPurify.sanitize(content || "", {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className={`post-content text-gray-400 text-sm leading-relaxed ${
        expanded ? "" : "line-clamp-4"
      }`}
      dangerouslySetInnerHTML={{ __html: safeHTML }}
    />
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [loading, setLoading] = useState(true);
  const [likingPost, setLikingPost] = useState(null);

  // Load Posts
  const loadPosts = async (showLoading = true) => {
  try {
    if (showLoading) setLoading(true);

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
    if (showLoading) setLoading(false);
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
    if (likedPosts.includes(postId) || likingPost === postId) return;

    try {
      setLikingPost(postId);

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

      // Refresh likes without replacing the page with the loading screen.
      await loadPosts(false);
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikingPost(null);
    }
  };

  // Search and Category Filtering
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const content = getPlainText(post.content).toLowerCase();
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
    <>
      <div className="relative isolate min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] text-gray-200 flex">
      {/* SUBTLE SQUARE GRID BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:70px_70px]"
      />
      {/* SOFT BLUE AMBIENT GLOW */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/3 z-0 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-blue-500/[0.045] blur-[140px]"
      />

      {/* MAIN */}
      <div className="relative z-10 flex-1 min-w-0 px-5 md:px-10 py-10">

        {/* HERO */}
        <div className="bg-[#0f172a] border border-white/10 p-6 md:p-8 rounded-2xl mb-5 shadow-xl backdrop-blur-md">

          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-wide">
            Welcome to Rajitha Blog 🚀
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            Explore the world of technology through insightful articles, practical tutorials, gaming, programming, AI, software development, and digital innovations. Discover useful tips, guides, reviews, and ideas to learn, create, and stay ahead in the digital world.
          </p>

        </div>

        {/* GAME CHECKER BUTTON - CENTERED BETWEEN HERO AND SEARCH */}
        <div className="flex justify-center items-center mb-5">
          <a
            href="/game-checker"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0f172a]"
          >
            <span aria-hidden="true">🎮</span>
            Game Requirements Checker
            <span aria-hidden="true">→</span>
          </a>
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
                onClick={() => {
                  setActiveCategory(category);
                  setExpandedPost(null);
                }}
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
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "Post" : "Posts"} Found
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

          <div className="grid md:grid-cols-2 gap-8 items-start">

            {filteredPosts.map((p) => {
              const liked = likedPosts.includes(p.id);
              const category = getCategory(p);
              const isExpanded = expandedPost === p.id;

              const plainContent = getPlainText(p.content);

              return (
                <article
                  key={p.id}
                  className="group self-start h-fit bg-[#0f172a]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                >

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

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

                    {/* FORMATTED CONTENT */}
                    <FormattedContent
                      content={p.content}
                      expanded={isExpanded}
                    />

                    {/* READ MORE */}
                    {plainContent.length > 180 && (
                      <button
                        onClick={() =>
                          setExpandedPost(
                            isExpanded ? null : p.id
                          )
                        }
                        className="text-blue-400 text-sm mt-3 hover:underline"
                      >
                        {isExpanded
                          ? "Show Less ▲"
                          : "Read More →"}
                      </button>
                    )}

                    {/* FOOTER */}
                    <div className="flex justify-between items-center gap-3 mt-5">

                      <span className="text-xs text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-3">

                        <span className="text-sm text-gray-400">
                          ❤️ {p.likes}
                        </span>

                        <button
                          onClick={() => likePost(p.id)}
                          disabled={liked || likingPost === p.id}
                          aria-label={
                            likingPost === p.id
                              ? "Liking post"
                              : liked
                                ? "Post liked"
                                : "Like post"
                          }
                          className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border transition-all duration-300 disabled:cursor-not-allowed ${
                            liked
                              ? "bg-red-500/15 text-red-400 border-red-500/50"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 hover:scale-105"
                          }`}
                        >
                          {likingPost === p.id ? (
                            <>
                              <span className="like-spinner" aria-hidden="true" />
                              Liking...
                            </>
                          ) : (
                            <>
                              <span className={liked ? "heart-pop" : ""}>
                                {liked ? "❤️" : "♡"}
                              </span>
                              {liked ? "Liked" : "Like"}
                            </>
                          )}
                        </button>

                      </div>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="relative z-10 hidden xl:block w-72 shrink-0 p-6 border-l-0 bg-white/[0.035] backdrop-blur-md before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-white/10 before:via-white/[0.07] before:to-transparent">

        {/* RECENT POSTS */}
        <h3 className="text-xs text-gray-400 mb-4 font-semibold tracking-wide">
          RECENT POSTS
        </h3>

        <div className="space-y-3 text-sm">

          {posts.slice(0, 5).map((p) => (
            <div key={p.id}>
              <p className="text-gray-200 hover:text-white">
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

          {["React", "Node", "Next.js", "Tailwind", "AI"].map((tag) => (
            <span
              key={tag}
              className="bg-white/10 px-3 py-1 rounded text-xs text-gray-300 hover:bg-white/20 transition"
            >
              {tag}
            </span>
          ))}

        </div>

      </aside>

      {/* RICH TEXT CONTENT STYLES */}
      <style jsx global>{`
        .post-content {
          overflow-wrap: anywhere;
        }

        .post-content h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin: 1rem 0;
        }

        .post-content h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0.9rem 0;
        }

        .post-content h3 {
          font-size: 1.15rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0.8rem 0;
        }

        .post-content p {
          margin-bottom: 0.8rem;
        }

        .post-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.8rem 0;
        }

        .post-content ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.8rem 0;
        }

        .post-content li {
          margin-bottom: 0.35rem;
        }

        .post-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #cbd5e1;
          font-style: italic;
        }

        .post-content a {
          color: #60a5fa;
          text-decoration: underline;
        }

        .post-content strong {
          color: #ffffff;
          font-weight: 700;
        }

        .post-content u {
          text-decoration: underline;
        }

        .post-content s {
          text-decoration: line-through;
        }

        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1rem 0;
        }

        .post-content pre {
          background: #020617;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .post-content code {
          background: #1e293b;
          padding: 0.15rem 0.35rem;
          border-radius: 0.25rem;
        }

        /* LIKE LOADING SPINNER */
        .like-spinner {
          width: 12px;
          height: 12px;
          flex: 0 0 12px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-top-color: #60a5fa;
          border-radius: 50%;
          display: inline-block;
          animation: likeSpin 0.65s linear infinite;
        }

        @keyframes likeSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* HEART LIKE ANIMATION */
        @keyframes heartPop {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.3);
          }
          70% {
            transform: scale(0.92);
          }
          100% {
            transform: scale(1);
          }
        }

        .heart-pop {
          display: inline-block;
          animation: heartPop 0.4s ease-out;
          transform-origin: center;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      </div>
      <CommentSection />
    </>
  );
}