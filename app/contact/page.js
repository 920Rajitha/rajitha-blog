
"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Same working email logic from About page
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#0b1120] text-gray-200 px-5 md:px-16 py-10">

      <div className="w-full max-w-6xl mx-auto px-4 py-10">

        {/* PAGE TITLE */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            Get In Touch
          </h1>

          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
            Have a question, project idea, or collaboration opportunity?
            Feel free to contact me. I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* CONTACT FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-5"
          >
            <h2 className="text-white text-xl font-semibold mb-2">
              Send Me a Message
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              required
              className="w-full p-3 bg-transparent border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              required
              className="w-full p-3 bg-transparent border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              placeholder="Write your message here..."
              required
              className="w-full p-3 bg-transparent border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 text-white py-3 rounded-lg text-sm font-medium transition"
            >
              {loading ? "Sending..." : "Send Message 🚀"}
            </button>

            {success && (
              <p className="text-green-400 text-sm text-center">
                ✅ Message sent successfully!
              </p>
            )}
          </form>

          {/* CONTACT INFORMATION */}
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-md">

            <h2 className="text-white text-xl font-semibold mb-6 tracking-wide">
              Contact Information
            </h2>

            <div className="space-y-6 text-sm">

              <a
                href="mailto:rajitha.development@gmail.com"
                className="flex items-center gap-4 text-gray-300 hover:text-white transition"
              >
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FaEnvelope className="text-blue-400 text-lg" />
                </div>
                <span className="break-all">
                  rajitha.development@gmail.com
                </span>
              </a>

              <a
                href="tel:+94750979908"
                className="flex items-center gap-4 text-gray-300 hover:text-white transition"
              >
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <FaPhoneAlt className="text-green-400 text-lg" />
                </div>
                <span>+94 75 097 9908</span>
              </a>

              <a
                href="https://rajitha.site"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-gray-300 hover:text-white transition"
              >
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FaGlobe className="text-purple-400 text-lg" />
                </div>
                <span>rajitha.site</span>
              </a>

            </div>

            <div className="border-t border-white/10 my-8"></div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Available for internships, freelance projects, and
              collaborations. Let's build something amazing together!
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex items-center gap-4">

              <a
                href="https://linkedin.com/in/rajitha-lakshan-4b269b351"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/20 transition"
              >
                <FaLinkedin className="text-gray-400 hover:text-blue-400 text-lg" />
              </a>

              <a
                href="https://www.facebook.com/share/1DjDYyx4Dm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-600/20 transition"
              >
                <FaFacebook className="text-gray-400 hover:text-blue-500 text-lg" />
              </a>

              <a
                href="https://wa.me/94750979908"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-green-500/20 transition"
              >
                <FaWhatsapp className="text-gray-400 hover:text-green-400 text-lg" />
              </a>

              <a
                href="https://www.instagram.com/ra_j_i_t_h_a?igsh=MjFsN3F1Mmdicjcx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-pink-500/20 transition"
              >
                <FaInstagram className="text-gray-400 hover:text-pink-400 text-lg" />
              </a>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
