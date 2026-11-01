"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) =>
              attributes.fontSize
                ? { style: `font-size: ${attributes.fontSize}` }
                : {},
          },
        },
      },
    ];
  },
});

const FontFamily = Extension.create({
  name: "fontFamily",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily || null,
            renderHTML: (attributes) =>
              attributes.fontFamily
                ? { style: `font-family: ${attributes.fontFamily}` }
                : {},
          },
        },
      },
    ];
  },
});

const categories = ["Gaming", "Technology", "Programming", "Tutorials"];

function ToolbarButton({ editor, action, children, active = false }) {
  return (
    <button
      type="button"
      onClick={action}
      disabled={!editor}
      className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
        active
          ? "bg-blue-600 border-blue-500 text-white"
          : "bg-[#0f172a] border-white/10 text-gray-300 hover:bg-[#334155]"
      }`}
    >
      {children}
    </button>
  );
}

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentStatus, setCommentStatus] = useState("pending");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentActionId, setCommentActionId] = useState(null);

  const router = useRouter();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-5 outline-none text-gray-200 leading-relaxed",
      },
    },
  });

  // Admin authentication check
  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      router.replace("/login");
    }
  }, [router]);

  // Load posts
  const loadPosts = async () => {
    try {
      const res = await fetch("/api/posts", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch posts error:", error);
      setPosts([]);
    }
  };

  // Load comments
  const loadComments = async (status = commentStatus) => {
    try {
      setCommentsLoading(true);

      const res = await fetch(
        `/api/admin/comments?status=${status}`,
        { cache: "no-store" }
      );

      if (res.status === 401 || res.status === 403) {
        alert("Admin session expired. Please log in again.");
        localStorage.removeItem("admin");
        router.replace("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load comments");
      }

      const data = await res.json();
      setComments(Array.isArray(data) ? data : data.comments || []);
    } catch (error) {
      console.error("Load comments error:", error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("admin")) {
      loadComments(commentStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentStatus]);

  // Publish post
  const addPost = async () => {
    if (
      !title.trim() ||
      !editor ||
      editor.isEmpty ||
      !editor.getText().trim()
    ) {
      alert("Please enter a title and post content.");
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
          title: title.trim(),
          content: editor.getHTML(),
          category,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to publish post");
      }

      setTitle("");
      setCategory("Technology");
      editor.commands.clearContent();

      await loadPosts();

      alert("Post published successfully!");
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPosts((prev) => prev.filter((post) => post.id !== id));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete post error:", error);
      alert("Something went wrong.");
    }
  };

  // Insert link
  const addLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    const url = prompt("Enter website URL:", previousUrl);

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    try {
      const candidate = /^https?:\/\//i.test(url.trim())
        ? url.trim()
        : `https://${url.trim()}`;

      const parsed = new URL(candidate);

      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid URL");
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: parsed.href })
        .run();
    } catch {
      alert("Please enter a valid website URL.");
    }
  };

  // Approve or delete comment
  const moderateComment = async (commentId, action) => {
    const promptText =
      action === "approve"
        ? "Approve this comment?"
        : "Permanently delete this comment?";

    if (!confirm(promptText)) return;

    try {
      setCommentActionId(commentId);

      const res =
        action === "approve"
          ? await fetch(`/api/admin/comments/${commentId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ approved: true }),
            })
          : await fetch(`/api/admin/comments/${commentId}`, {
              method: "DELETE",
            });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403) {
        alert("Admin session expired. Please log in again.");
        localStorage.removeItem("admin");
        router.replace("/login");
        return;
      }

      if (!res.ok || data.success === false) {
        throw new Error(data.error || "Comment action failed");
      }

      await loadComments(commentStatus);
    } catch (error) {
      console.error("Comment moderation error:", error);
      alert(error.message || "Could not update comment.");
    } finally {
      setCommentActionId(null);
    }
  };

  // Secure logout
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("admin");
      router.replace("/login");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#0f172a] min-h-screen text-white">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* PUBLISH FORM */}
      <div className="bg-[#1e293b] p-5 md:p-6 mb-8 rounded-xl">
        <h2 className="text-xl font-semibold mb-5">
          Publish New Post
        </h2>

        <input
          placeholder="Post Title"
          className="w-full p-3 mb-5 text-white bg-[#0f172a] border border-white/10 rounded-lg outline-none focus:border-blue-500"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        {/* CATEGORY */}
        <label className="block mb-2 text-gray-300">
          Select Category
        </label>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full p-3 mb-5 text-white bg-[#0f172a] border border-white/10 rounded-lg outline-none"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* RICH TEXT EDITOR */}
        <label className="block mb-3 text-gray-300">
          Write Your Post
        </label>

        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0f172a]">

          {/* TOOLBAR */}
          <div className="p-3 border-b border-white/10 flex flex-wrap gap-2">

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("bold")}
              action={() => editor?.chain().focus().toggleBold().run()}
            >
              <b>B</b>
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("italic")}
              action={() => editor?.chain().focus().toggleItalic().run()}
            >
              <i>I</i>
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("underline")}
              action={() => editor?.chain().focus().toggleUnderline().run()}
            >
              <u>U</u>
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("strike")}
              action={() => editor?.chain().focus().toggleStrike().run()}
            >
              <s>S</s>
            </ToolbarButton>

            <div className="w-px bg-white/20 mx-1" />

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("heading", { level: 1 })}
              action={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              H1
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("heading", { level: 2 })}
              action={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              action={() => editor?.chain().focus().setParagraph().run()}
            >
              Paragraph
            </ToolbarButton>

            <div className="w-px bg-white/20 mx-1" />

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("bulletList")}
              action={() => editor?.chain().focus().toggleBulletList().run()}
            >
              • List
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("orderedList")}
              action={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              1. List
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("blockquote")}
              action={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              Quote
            </ToolbarButton>

            <div className="w-px bg-white/20 mx-1" />

            <ToolbarButton
              editor={editor}
              action={addLink}
              active={editor?.isActive("link")}
            >
              🔗 Link
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              action={() => editor?.chain().focus().unsetLink().run()}
            >
              Unlink
            </ToolbarButton>

            <div className="w-px bg-white/20 mx-1" />

            {/* ALIGNMENT */}
            <ToolbarButton
              editor={editor}
              action={() => editor?.chain().focus().setTextAlign("left").run()}
            >
              ⇤
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              action={() => editor?.chain().focus().setTextAlign("center").run()}
            >
              ☰
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              action={() => editor?.chain().focus().setTextAlign("right").run()}
            >
              ⇥
            </ToolbarButton>

            <div className="w-px bg-white/20 mx-1" />

            {/* FONT SIZE */}
            <select
              defaultValue="16px"
              onChange={(event) =>
                editor
                  ?.chain()
                  .focus()
                  .setMark("textStyle", { fontSize: event.target.value })
                  .run()
              }
              className="bg-[#1e293b] text-white border border-white/10 rounded-lg px-2 py-2 text-sm"
              aria-label="Font size"
            >
              {["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"].map(
                (size) => (
                  <option key={size} value={size}>
                    {size.replace("px", " px")}
                  </option>
                )
              )}
            </select>

            {/* FONT FAMILY */}
            <select
              defaultValue="Arial"
              onChange={(event) =>
                editor
                  ?.chain()
                  .focus()
                  .setMark("textStyle", { fontFamily: event.target.value })
                  .run()
              }
              className="bg-[#1e293b] text-white border border-white/10 rounded-lg px-2 py-2 text-sm"
              aria-label="Font family"
            >
              {[
                "Arial",
                "Georgia",
                "Verdana",
                "Tahoma",
                "Times New Roman",
                "Courier New",
              ].map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>

            {/* TEXT COLOR */}
            <label className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-white/10 rounded-lg text-sm cursor-pointer">
              <span>Text Color</span>
              <input
                type="color"
                defaultValue="#ffffff"
                onChange={(event) =>
                  editor?.chain().focus().setColor(event.target.value).run()
                }
                className="w-6 h-6 bg-transparent cursor-pointer"
                aria-label="Text color"
              />
            </label>

            {/* UNDO / REDO */}
            <div className="w-px bg-white/20 mx-1" />

            <ToolbarButton
              editor={editor}
              action={() => editor?.chain().focus().undo().run()}
            >
              ↶ Undo
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              action={() => editor?.chain().focus().redo().run()}
            >
              ↷ Redo
            </ToolbarButton>
          </div>

          {/* EDITOR AREA */}
          <EditorContent
            editor={editor}
            className="min-h-[300px] text-white [&_.tiptap]:min-h-[300px] [&_.tiptap]:p-5 [&_.tiptap]:outline-none [&_.tiptap_h1]:text-3xl [&_.tiptap_h1]:font-bold [&_.tiptap_h2]:text-2xl [&_.tiptap_h2]:font-bold [&_.tiptap_p]:mb-3 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-blue-500 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_a]:text-blue-400 [&_.tiptap_a]:underline"
          />
        </div>

        {/* PUBLISH BUTTON */}
        <button
          onClick={addPost}
          disabled={loading || !editor}
          className="bg-blue-600 px-6 py-3 mt-5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </div>

      {/* COMMENT MODERATION */}
      <section className="bg-[#1e293b] p-5 md:p-6 mb-8 rounded-xl">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
          <h2 className="text-xl font-bold">
            Comment Management
          </h2>

          <button
            onClick={() => loadComments(commentStatus)}
            disabled={commentsLoading}
            className="px-4 py-2 rounded-lg bg-[#0f172a] border border-white/10 hover:bg-[#334155] disabled:opacity-50"
          >
            {commentsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* COMMENT TABS */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setCommentStatus("pending")}
            className={`px-4 py-2 rounded-lg text-sm ${
              commentStatus === "pending"
                ? "bg-blue-600 text-white"
                : "bg-[#0f172a] text-gray-300"
            }`}
          >
            Pending Comments
          </button>

          <button
            onClick={() => setCommentStatus("approved")}
            className={`px-4 py-2 rounded-lg text-sm ${
              commentStatus === "approved"
                ? "bg-blue-600 text-white"
                : "bg-[#0f172a] text-gray-300"
            }`}
          >
            Approved Comments
          </button>
        </div>

        {commentsLoading ? (
          <p className="text-gray-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400">
            No {commentStatus} comments found.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="bg-[#0f172a] p-4 rounded-lg border border-white/10"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">
                      {comment.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {comment.post?.title
                        ? `Post: ${comment.post.title} • `
                        : ""}
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full h-fit ${
                      comment.approved
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {comment.approved ? "Approved" : "Pending"}
                  </span>
                </div>

                <p className="text-gray-300 whitespace-pre-wrap break-words mt-3">
                  {comment.content}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {!comment.approved && (
                    <button
                      onClick={() =>
                        moderateComment(comment.id, "approve")
                      }
                      disabled={commentActionId === comment.id}
                      className="bg-green-600 px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {commentActionId === comment.id
                        ? "Please wait..."
                        : "Approve"}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      moderateComment(comment.id, "delete")
                    }
                    disabled={commentActionId === comment.id}
                    className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ALL POSTS */}
      <h2 className="text-xl font-bold mb-4">
        All Posts ({posts.length})
      </h2>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#1e293b] p-5 rounded-xl border border-white/5"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <h3 className="text-lg font-semibold">
                {post.title}
              </h3>

              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                {post.category || "Technology"}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => deletePost(post.id)}
              className="bg-red-500 px-4 py-2 mt-4 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}