
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

// Custom font size extension
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
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

// Custom font family extension
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
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
});

const categories = [
  "Gaming",
  "Technology",
  "Programming",
  "Tutorials",
];

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
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [loading, setLoading] = useState(false);

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

    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-5 outline-none text-gray-200 leading-relaxed",
      },
    },
  });

  // Admin authentication check
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      router.push("/login");
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
      console.error("Fetch error:", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Publish post
  const addPost = async () => {
    if (!title.trim() || !editor || editor.isEmpty) {
      alert("Please enter a title and post content.");
      return;
    }

    const htmlContent = editor.getHTML();

    if (!editor.getText().trim()) {
      alert("Please enter some post content.");
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
          content: htmlContent,
          category,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to publish post");
      }

      setTitle("");
      setCategory("Technology");
      setContent("");
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

      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
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
      const parsed = new URL(
        url.match(/^https?:\/\//i) ? url : `https://${url}`
      );

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

  return (
    <div className="p-6 md:p-10 bg-[#0f172a] min-h-screen text-white">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
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

      {/* PUBLISH FORM */}
      <div className="bg-[#1e293b] p-5 md:p-6 mb-8 rounded-xl">

        <h2 className="text-xl font-semibold mb-5">
          Publish New Post
        </h2>

        {/* TITLE */}
        <input
          placeholder="Post Title"
          className="w-full p-3 mb-5 text-white bg-[#0f172a] border border-white/10 rounded-lg outline-none focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CATEGORY */}
        <label className="block mb-2 text-gray-300">
          Select Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
              action={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </ToolbarButton>

            <ToolbarButton
              editor={editor}
              active={editor?.isActive("heading", { level: 2 })}
              action={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
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
              onChange={(e) =>
                editor?.chain().focus().setMark("textStyle", {
                  fontSize: e.target.value,
                }).run()
              }
              className="bg-[#1e293b] text-white border border-white/10 rounded-lg px-2 py-2 text-sm"
              aria-label="Font size"
            >
              <option value="12px">12 px</option>
              <option value="14px">14 px</option>
              <option value="16px">16 px</option>
              <option value="18px">18 px</option>
              <option value="20px">20 px</option>
              <option value="24px">24 px</option>
              <option value="30px">30 px</option>
              <option value="36px">36 px</option>
            </select>

            {/* FONT FAMILY */}
            <select
              defaultValue="Arial"
              onChange={(e) =>
                editor?.chain().focus().setMark("textStyle", {
                  fontFamily: e.target.value,
                }).run()
              }
              className="bg-[#1e293b] text-white border border-white/10 rounded-lg px-2 py-2 text-sm"
              aria-label="Font family"
            >
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>

            {/* TEXT COLOR */}
            <label className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-white/10 rounded-lg text-sm cursor-pointer">
              <span>Text Color</span>
              <input
                type="color"
                defaultValue="#ffffff"
                onChange={(e) =>
                  editor?.chain().focus().setColor(e.target.value).run()
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
            className="min-h-[300px] text-white
              [&_.tiptap]:min-h-[300px]
              [&_.tiptap]:p-5
              [&_.tiptap]:outline-none
              [&_.tiptap_h1]:text-3xl
              [&_.tiptap_h1]:font-bold
              [&_.tiptap_h2]:text-2xl
              [&_.tiptap_h2]:font-bold
              [&_.tiptap_p]:mb-3
              [&_.tiptap_ul]:list-disc
              [&_.tiptap_ul]:pl-6
              [&_.tiptap_ol]:list-decimal
              [&_.tiptap_ol]:pl-6
              [&_.tiptap_blockquote]:border-l-4
              [&_.tiptap_blockquote]:border-blue-500
              [&_.tiptap_blockquote]:pl-4
              [&_.tiptap_blockquote]:italic
              [&_.tiptap_a]:text-blue-400
              [&_.tiptap_a]:underline
            "
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

      {/* ALL POSTS */}
      <h2 className="text-xl font-bold mb-4">
        All Posts ({posts.length})
      </h2>

      <div className="space-y-4">

        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-[#1e293b] p-5 rounded-xl border border-white/5"
          >

            <div className="flex flex-wrap justify-between gap-3">

              <h3 className="text-lg font-semibold">
                {p.title}
              </h3>

              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                {p.category || "Technology"}
              </span>

            </div>

            <p className="text-gray-400 text-sm mt-2">
              {new Date(p.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => deletePost(p.id)}
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
