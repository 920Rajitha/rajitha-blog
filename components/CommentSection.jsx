"use client";

import { useCallback, useEffect, useState } from "react";

export default function CommentSection() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState("");

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // LOAD BLOG POSTS
  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      try {
        const res = await fetch("/api/posts", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load blog posts");
        }

        const data = await res.json();

        if (!cancelled) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Posts loading error:", error);
      }
    };

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  // LOAD APPROVED COMMENTS
  const loadComments = useCallback(async () => {
    if (!selectedPost) {
      setComments([]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/comments?postId=${encodeURIComponent(selectedPost)}&t=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load comments");
      }

      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Comments loading error:", error);
      setComments([]);

      setMessage(error.message || "Unable to load comments.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [selectedPost]);

  // LOAD COMMENTS WHEN POST CHANGES
  useEffect(() => {
    setComments([]);

    if (selectedPost) {
      loadComments();
    }
  }, [selectedPost, loadComments]);

  // SUBMIT COMMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!selectedPost || !name.trim() || !content.trim()) {
      setMessage("Please complete all fields.");
      setMessageType("error");
      return;
    }

    if (name.trim().length > 60 || content.trim().length > 2000) {
      setMessage("Name or comment is too long.");
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
        "Your comment was submitted successfully! It will appear after admin approval."
      );

      setMessageType("success");
    } catch (error) {
      console.error("Comment submission error:", error);

      setMessage(
        error.message || "Something went wrong. Please try again."
      );

      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="comments"
      className="w-full mt-16 px-5 md:px-10"
    >
      <div className="max-w-7xl mx-auto bg-[#0f172a]/90 border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">

        {/* SECTION HEADING */}
        <div className="mb-8">
          <span className="text-blue-400 text-xs font-semibold uppercase tracking-[3px]">
            Community Discussion
          </span>

          <h2 className="text-2xl md:text-3xl font-bold text-white mt-3">
            💬 Join the Discussion
          </h2>

          <p className="text-gray-400 text-sm mt-3">
            Share your thoughts and ideas with the Rajitha Blog community.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* COMMENT FORM */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">
              Leave a Comment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* SELECT BLOG POST */}
              <div>
                <label
                  htmlFor="commentPost"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Select Blog Post
                </label>

                <select
                  id="commentPost"
                  value={selectedPost}
                  onChange={(e) => {
                    setSelectedPost(e.target.value);
                    setMessage("");
                  }}
                  required
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Choose a blog post</option>

                  {posts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* NAME */}
              <div>
                <label
                  htmlFor="commentName"
                  className="block text-sm text-gray-300 mb-2"
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
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500"
                />
              </div>

              {/* COMMENT */}
              <div>
                <label
                  htmlFor="commentContent"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Your Comment
                </label>

                <textarea
                  id="commentContent"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows={5}
                  maxLength={2000}
                  required
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 resize-y"
                />

                <p className="text-xs text-gray-500 text-right mt-2">
                  {content.length}/2000
                </p>
              </div>

              {/* MESSAGE */}
              {message && (
                <div
                  role="status"
                  className={`p-4 rounded-xl text-sm border ${
                    messageType === "success"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting || posts.length === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Post Comment →"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Comments will appear after admin approval.
              </p>
            </form>
          </div>

          {/* APPROVED COMMENTS */}
          <div>

            {/* COMMENTS HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">

              <h3 className="text-lg font-semibold text-white">
                Community Comments
              </h3>

              <div className="flex items-center gap-2">

                <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-2 rounded-full">
                  {comments.length} Comments
                </span>

                <button
                  type="button"
                  onClick={loadComments}
                  disabled={!selectedPost || loading}
                  className="text-xs text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg hover:bg-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Loading..." : "↻ Refresh"}
                </button>

              </div>
            </div>

            {/* NO POST SELECTED */}
            {!selectedPost ? (

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
                <div className="text-3xl mb-3">📝</div>

                <p className="text-gray-400 text-sm">
                  Select a blog post to view its comments.
                </p>
              </div>

            ) : loading ? (

              <div className="text-center py-10 text-gray-400 text-sm">
                Loading comments...
              </div>

            ) : comments.length === 0 ? (

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
                <div className="text-3xl mb-3">💬</div>

                <p className="text-gray-300 text-sm">
                  No approved comments yet.
                </p>

                <p className="text-gray-500 text-xs mt-2">
                  Be the first to share your thoughts!
                </p>
              </div>

            ) : (

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">

                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white/[0.03] border border-white/10 rounded-xl p-5"
                  >

                    {/* USER DETAILS */}
                    <div className="flex items-center gap-3 mb-3">

                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {(comment.name || "U").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          {comment.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>

                    </div>

                    {/* COMMENT TEXT */}
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>

                  </div>
                ))}

              </div>

            )}

          </div>
        </div>
      </div>
    </section>
  );
}