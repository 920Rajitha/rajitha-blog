"use client";

import { useCallback, useEffect, useState } from "react";

export default function CommentSection() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState("all");

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Unable to load posts");

        const data = await res.json();

        if (active) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Posts error:", error);
      }
    }

    fetchPosts();

    return () => {
      active = false;
    };
  }, []);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);

      const query =
        selectedPost === "all"
          ? ""
          : `?postId=${encodeURIComponent(selectedPost)}`;

      const res = await fetch(
        `/api/comments${query}${query ? "&" : "?"}t=${Date.now()}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to load comments");
      }

      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Comments error:", error);
      setComments([]);
      setMessage(error.message || "Unable to load comments.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [selectedPost]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const getPostTitle = (postId) => {
    const post = posts.find(
      (item) => String(item.id) === String(postId)
    );

    return post?.title || "Rajitha Blog";
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (
      !selectedPost ||
      selectedPost === "all" ||
      !name.trim() ||
      !content.trim()
    ) {
      setMessage("Please select a blog post and complete all fields.");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: Number(selectedPost),
          name: name.trim(),
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Comment submission failed");
      }

      setName("");
      setContent("");

      setMessage(
        "Thank you! Your comment has been submitted and is awaiting approval."
      );
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="comments"
      className="relative isolate w-full mt-0 px-4 sm:px-6 lg:px-10 pt-32 md:pt-40 pb-16 md:pb-24 bg-[#050b1a] overflow-hidden"
    >
      {/* SEAMLESS TRANSITION FROM THE BLOG SECTION */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
      >
        {/* Blends the previous section into the community background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080e1d] via-[#070d1b]/90 to-transparent" />

        {/* Fine editorial divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="w-px h-8 bg-gradient-to-b from-transparent to-sky-500/40" />
          <span className="w-16 h-px bg-gradient-to-r from-transparent via-sky-500/70 to-transparent" />
          <span className="w-1.5 h-1.5 rotate-45 border border-sky-500/60 bg-[#050b1a] -mt-[3px]" />
        </div>
      </div>

      {/* CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/[0.045] blur-[140px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/[0.04] blur-[130px] rounded-full" />

        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* EDITORIAL HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">

          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-10 h-px bg-sky-500/70" />

            <span className="text-sky-400 text-[10px] sm:text-xs font-semibold uppercase tracking-[5px]">
              The Community Journal
            </span>

            <span className="w-10 h-px bg-sky-500/70" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-[#eff6ff] leading-tight">
            Ideas Worth
            <br />
            <span className="italic text-sky-400">
              Sharing.
            </span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-7 mt-6 max-w-xl mx-auto">
            A space for thoughtful conversations, fresh perspectives
            and meaningful connections. Join the Rajitha Blog community.
          </p>

          <div className="mt-8 flex justify-center">
            <span className="text-[10px] uppercase tracking-[4px] text-gray-600">
              Share · Connect · Inspire
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-7">

          {/* COMMENT FORM */}
          <div className="bg-[#111316] border border-[#3b82f6]/20 rounded-sm p-6 sm:p-8 md:p-9 h-fit shadow-2xl">

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xl">
                ✒
              </div>

              <div>
                <p className="text-sky-400 text-[10px] uppercase tracking-[3px] mb-1">
                  Your contribution
                </p>

                <h3 className="text-2xl font-serif text-[#eff6ff]">
                  Write a Comment
                </h3>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-sky-500/50 via-white/10 to-transparent mb-8" />

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label
                  htmlFor="commentPost"
                  className="block text-xs uppercase tracking-[2px] text-gray-400 mb-3"
                >
                  Choose an Article
                </label>

                <select
                  id="commentPost"
                  value={selectedPost === "all" ? "" : selectedPost}
                  onChange={(e) => {
                    setSelectedPost(e.target.value);
                    setMessage("");
                  }}
                  required
                  className="w-full bg-[#090b0e] border border-white/10 rounded-sm px-4 py-4 text-sm text-[#eff6ff] outline-none focus:border-sky-500/60 transition"
                >
                  <option value="">Select a blog post</option>

                  {posts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="commentName"
                  className="block text-xs uppercase tracking-[2px] text-gray-400 mb-3"
                >
                  Your Name
                </label>

                <input
                  id="commentName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={60}
                  required
                  className="w-full bg-[#090b0e] border border-white/10 rounded-sm px-4 py-4 text-sm text-white placeholder-gray-600 outline-none focus:border-sky-500/60 transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label
                    htmlFor="commentContent"
                    className="text-xs uppercase tracking-[2px] text-gray-400"
                  >
                    Your Thoughts
                  </label>

                  <span className="text-[10px] text-gray-600">
                    {content.length}/2000
                  </span>
                </div>

                <textarea
                  id="commentContent"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write something worth sharing..."
                  rows={6}
                  maxLength={2000}
                  required
                  className="w-full bg-[#090b0e] border border-white/10 rounded-sm px-4 py-4 text-sm text-white placeholder-gray-600 outline-none focus:border-sky-500/60 transition resize-y leading-7"
                />
              </div>

              {message && (
                <div
                  role="status"
                  className={`p-4 text-xs leading-6 border rounded-sm ${
                    messageType === "success"
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || posts.length === 0}
                className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-[#111316] text-xs font-bold uppercase tracking-[3px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Publish Comment  →"}
              </button>

              <p className="text-center text-[10px] text-gray-600 tracking-wide">
                Comments are reviewed before publication.
              </p>
            </form>
          </div>

          {/* COMMUNITY FEED */}
          <div className="bg-[#111316] border border-white/10 rounded-sm p-6 sm:p-8 md:p-9 shadow-2xl">

            {/* FEED HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">

              <div>
                <p className="text-sky-400 text-[10px] uppercase tracking-[3px] mb-2">
                  Reader Perspectives
                </p>

                <h3 className="text-3xl font-serif text-[#eff6ff]">
                  The Conversation
                </h3>
              </div>

              <button
                type="button"
                onClick={loadComments}
                disabled={loading}
                className="self-start sm:self-auto text-xs text-sky-400 border border-sky-500/30 px-4 py-3 hover:bg-sky-500/10 transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "↻  Refresh"}
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-sky-500/50 via-white/10 to-transparent mb-7" />

            {/* FILTER AND COUNT */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7">

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost("all")}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[2px] border transition ${
                    selectedPost === "all"
                      ? "bg-sky-500 text-[#111316] border-sky-500"
                      : "text-gray-400 border-white/10 hover:border-sky-500/40"
                  }`}
                >
                  All Comments
                </button>

                {selectedPost !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedPost("all")}
                    className="px-4 py-2 text-[10px] uppercase tracking-[2px] text-gray-400 border border-white/10 hover:text-white transition"
                  >
                    Clear Filter ×
                  </button>
                )}
              </div>

              <span className="text-xs text-gray-500">
                {comments.length} {comments.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            {selectedPost !== "all" && (
              <p className="text-xs text-sky-400/80 mb-5">
                Article: {getPostTitle(selectedPost)}
              </p>
            )}

            {/* FEED CONTENT */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse border border-white/5 p-5"
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full" />

                      <div className="flex-1 space-y-3 pt-2">
                        <div className="w-1/3 h-3 bg-white/10" />
                        <div className="w-1/4 h-2 bg-white/10" />
                      </div>
                    </div>

                    <div className="w-full h-3 bg-white/10 mt-5" />
                    <div className="w-2/3 h-3 bg-white/10 mt-3" />
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10">
                <div className="text-4xl text-sky-400/60 mb-5">
                  ✦
                </div>

                <h4 className="text-xl font-serif text-[#eff6ff]">
                  The First Word
                </h4>

                <p className="text-gray-500 text-xs mt-3">
                  No approved comments yet. Start the conversation.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[760px] overflow-y-auto pr-2">

                {comments.map((comment) => (
                  <article
                    key={comment.id}
                    className="group relative bg-[#090b0e] border border-white/[0.07] hover:border-sky-500/30 p-5 sm:p-6 transition-all duration-300"
                  >
                    <div className="absolute top-0 left-0 w-10 h-px bg-sky-500/70 group-hover:w-20 transition-all duration-500" />

                    <div className="flex gap-4">

                      {/* AVATAR */}
                      <div className="w-11 h-11 shrink-0 rounded-full border border-sky-500/30 bg-gradient-to-br from-[#2563eb] to-[#0c2348] flex items-center justify-center text-sky-100 text-lg font-serif">
                        {(comment.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-semibold text-[#eff6ff]">
                              {comment.name || "Anonymous"}
                            </h4>

                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                              {comment.createdAt
                                ? new Date(comment.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )
                                : ""}
                            </p>
                          </div>

                          <span className="text-[9px] text-sky-500/80 uppercase tracking-[2px]">
                            Reader
                          </span>
                        </div>

                        <p className="text-sm text-gray-300 leading-7 mt-5 whitespace-pre-wrap break-words">
                          {comment.content}
                        </p>

                        <div className="mt-5 pt-3 border-t border-white/[0.06]">
                          <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                            Article
                          </p>

                          <p className="text-xs text-sky-400/80 mt-1">
                            {getPostTitle(comment.postId)}
                          </p>
                        </div>

                      </div>
                    </div>
                  </article>
                ))}

              </div>
            )}

            <div className="mt-7 pt-5 border-t border-white/[0.07] text-center">
              <p className="text-[9px] uppercase tracking-[3px] text-gray-600">
                Rajitha Blog · A Community of Ideas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}