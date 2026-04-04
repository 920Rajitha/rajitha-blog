

"use client";

import { FaEnvelope, FaPhoneAlt, FaGlobe } from "react-icons/fa";
import { FaRobot, FaMobileAlt, FaBlog, FaGithub } from "react-icons/fa";
import { FaCode, FaServer, FaDatabase, FaTools } from "react-icons/fa";
import { FaLinkedin, FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

import { useState } from "react";
export default function About() {

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

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-[260px_1fr] gap-6">

        {/* LEFT SIDEBAR */}
        <div className="hidden md:block space-y-6">

        

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">
              About This Blog
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sharing knowledge and experiences in software development, AI, and modern technologies.
            </p>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-10">

          {/* HERO */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row gap-6 items-center">

          
<div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

  {/* IMAGE */}
  <div className="relative">
    <img
      src="/profile.png"   // 👉 put your image in public folder
      alt="Rajitha"
      className="w-32 h-32 md:w-40 md:h-40 object-cover 
      rounded-2xl border border-white/10 shadow-xl"
    />

    {/* glow effect */}
    <div className="absolute inset-0 rounded-2xl 
    bg-blue-500/10 blur-xl opacity-60"></div>
  </div>

  {/* TEXT */}
  <div>

    <h1 className="text-2xl md:text-3xl font-semibold text-white">
      Rajitha Lakshan
    </h1>

    <p className="text-blue-400 text-sm mt-1">
      Full Stack Developer | IT Support | App Developer
    </p>

    <p className="text-gray-400 text-sm mt-3 max-w-xl leading-relaxed">
      Motivated and passionate Software Engineering student focused on building scalable,
      high-performance applications and intelligent systems using modern technologies.
    </p>

  </div>

</div>
          </div>

          {/* ABOUT */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-white">
              About Me
            </h2>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md text-gray-400 text-sm leading-relaxed">
              I am a Software Engineering student with strong experience in full-stack development
              and AI-based systems. I specialize in building scalable applications using modern
              frameworks such as React, Next.js, Node.js, and .NET.

              <br /><br />

              I have also worked in real-world IT environments, gaining hands-on experience in system
              support, networking, and technical problem-solving.
            </div>
          </div>


<div className="w-full max-w-6xl mx-auto px-4 py-10">

  <h2 className="text-2xl font-semibold mb-8 text-white tracking-wide">
    Skills & Technologies
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    {[
      {
        title: "Frontend",
        items: ["React", "Next.js", "HTML", "CSS", "Tailwind"],
        icon: <FaCode />,
        color: "blue",
      },
      {
        title: "Backend",
        items: ["Node.js", ".NET", "C#", "Java"],
        icon: <FaServer />,
        color: "green",
      },
      {
        title: "Database",
        items: ["SQL Server", "MySQL", "Firebase"],
        icon: <FaDatabase />,
        color: "purple",
      },
      {
        title: "Tools",
        items: ["Git", "VS Code", "Figma", "Android Studio"],
        icon: <FaTools />,
        color: "orange",
      },
    ].map((section, i) => (
      <div
        key={i}
        className="bg-[#0f172a] border border-white/10 
        rounded-2xl p-6 shadow-xl backdrop-blur-md 
        hover:-translate-y-1 hover:shadow-2xl 
        transition-all duration-300"
      >

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">

          <div className={`p-2 rounded-lg 
          ${
            section.color === "blue"
              ? "bg-blue-500/10 text-blue-400"
              : section.color === "green"
              ? "bg-green-500/10 text-green-400"
              : section.color === "purple"
              ? "bg-purple-500/10 text-purple-400"
              : "bg-orange-500/10 text-orange-400"
          }`}>
            {section.icon}
          </div>

          <h3 className="font-semibold text-gray-200 tracking-wide">
            {section.title}
          </h3>

        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2">

          {section.items.map((item, j) => (
            <span
              key={j}
              className="text-xs px-3 py-1 rounded-lg 
              bg-white/10 text-gray-300 
              hover:bg-white/20 hover:text-white 
              transition"
            >
              {item}
            </span>
          ))}

        </div>

      </div>
    ))}

  </div>
</div>

         <div className="w-full max-w-6xl mx-auto px-4 py-10">

  <h2 className="text-2xl font-semibold mb-8 text-white tracking-wide">
    Featured Projects
  </h2>

  <div className="grid md:grid-cols-3 gap-6">

    {[
      {
        title: "AI Resume Screening System",
        desc: "Automates resume evaluation using AI and intelligent skill matching.",
        icon: <FaRobot />,
        image: "/projects/image 1.png",
        github: "https://github.com/920Rajitha/CVResumeScreeningApp",
      },
      {
        title: "AI Accident Detection App",
        desc: "Mobile application using AI models to detect accidents and send alerts.",
        icon: <FaMobileAlt />,
        image: "/projects/accident-app.png",
        github: "https://github.com/yourusername/accident-ai",
      },
      {
        title: "DevTip Blog Platform",
        desc: "Modern blog system with admin dashboard built using Next.js.",
        icon: <FaBlog />,
        image: "/projects/download.png",
        github: "https://github.com/920Rajitha/dev-tips-hub",
      },
    ].map((p, i) => (
      <div
        key={i}
        className="bg-[#0f172a] border border-white/10 
        rounded-2xl overflow-hidden shadow-xl 
        backdrop-blur-md group hover:-translate-y-2 
        hover:shadow-2xl transition-all duration-300"
      >

        {/* IMAGE */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/40 opacity-0 
          group-hover:opacity-100 transition flex items-center justify-center">

            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 
              text-sm text-white border border-white/30 
              rounded-lg backdrop-blur-md 
              hover:bg-white/10 transition"
            >
              <FaGithub />
              View on GitHub
            </a>

          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">

          {/* TITLE */}
          <h3 className="text-sm font-semibold mb-2 text-white">
            {p.title}
          </h3>

          {/* DESC */}
          <p className="text-xs text-gray-400 leading-relaxed">
            {p.desc}
          </p>

        </div>

      </div>
    ))}

  </div>
</div>

      




<div className="w-full max-w-6xl mx-auto px-4 py-10">

  {/* TITLE */}
  <h2 className="text-2xl font-semibold mb-8 text-white tracking-wide">
    Contact
  </h2>

  <div className="grid md:grid-cols-2 gap-8">

    {/* ================= FORM ================= */}
   <form
  onSubmit={handleSubmit}
  className="bg-[#0f172a] border border-white/10 
  rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5"
>

  <input
    name="name"
    value={form.name}
    onChange={handleChange}
    type="text"
    placeholder="Full Name"
    required
    className="w-full p-3 bg-transparent border border-white/10 
    rounded-lg text-sm text-white outline-none 
    focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
  />

  <input
    name="email"
    value={form.email}
    onChange={handleChange}
    type="email"
    placeholder="Email Address"
    required
    className="w-full p-3 bg-transparent border border-white/10 
    rounded-lg text-sm text-white outline-none 
    focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
  />

  <textarea
    name="message"
    value={form.message}
    onChange={handleChange}
    rows="4"
    placeholder="Message"
    required
    className="w-full p-3 bg-transparent border border-white/10 
    rounded-lg text-sm text-white outline-none 
    focus:border-blue-400 focus:ring-1 focus:ring-blue-400 
    transition resize-none"
  />

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 
    hover:from-blue-600 hover:to-indigo-600 
    text-white py-3 rounded-lg text-sm font-medium transition"
  >
    {loading ? "Sending..." : "Send Message 🚀"}
  </button>

  {success && (
    <p className="text-green-400 text-sm text-center">
      ✅ Message sent successfully!
    </p>
  )}

</form>

    {/* ================= INFO ================= */}
    <div className="bg-[#0f172a] border border-white/10 
    rounded-2xl p-6 shadow-xl backdrop-blur-md">

      <h3 className="text-white text-lg font-semibold mb-5 tracking-wide">
        Contact Info
      </h3>

      <div className="space-y-5 text-sm">

        <a
          href="mailto:rajitha.development@gmail.com"
          className="flex items-center gap-4 text-gray-300 hover:text-white transition"
        >
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FaEnvelope className="text-blue-400" />
          </div>
          <span className="break-all">
            rajitha.development@gmail.com
          </span>
        </a>

        <a
          href="tel:+94750979908"
          className="flex items-center gap-4 text-gray-300 hover:text-white transition"
        >
          <div className="p-2 bg-green-500/10 rounded-lg">
            <FaPhoneAlt className="text-green-400" />
          </div>
          <span>+94 75 097 9908</span>
        </a>

        <a
          href="https://rajitha.site"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 text-gray-300 hover:text-white transition"
        >
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <FaGlobe className="text-purple-400" />
          </div>
          <span className="break-all">rajitha.site</span>
        </a>

      </div>

   {/* TEXT */}
  <p className="text-gray-400 text-xs leading-relaxed mb-4">
    Available for internships, freelance projects, and collaborations.
  </p>

  {/* SOCIAL ICONS */}
  <div className="flex items-center gap-4">

    {/* LINKEDIN */}
    <a
      href="https://linkedin.com/in/rajitha-lakshan-4b269b351"
      target="_blank"
      rel="noopener noreferrer"
      className="group p-2 rounded-lg bg-white/5 border border-white/10 
      hover:bg-blue-500/20 hover:border-blue-500/30 
      transition-all duration-300"
    >
      <FaLinkedin className="text-gray-400 group-hover:text-blue-400 text-lg transition" />
    </a>

    {/* FACEBOOK */}
    <a
      href="https://www.facebook.com/share/1DjDYyx4Dm/"
      target="_blank"
      rel="noopener noreferrer"
      className="group p-2 rounded-lg bg-white/5 border border-white/10 
      hover:bg-blue-600/20 hover:border-blue-600/30 
      transition-all duration-300"
    >
      <FaFacebook className="text-gray-400 group-hover:text-blue-500 text-lg transition" />
    </a>

    {/* WHATSAPP */}
    <a
      href="https://wa.me/94750979908"
      target="_blank"
      rel="noopener noreferrer"
      className="group p-2 rounded-lg bg-white/5 border border-white/10 
      hover:bg-green-500/20 hover:border-green-500/30 
      transition-all duration-300"
    >
      <FaWhatsapp className="text-gray-400 group-hover:text-green-400 text-lg transition" />
    </a>

    {/* INSTAGRAM */}
    <a
      href="www.instagram.com/ra_j_i_t_h_a?igsh=MjFsN3F1Mmdicjcx"
      target="_blank"
      rel="noopener noreferrer"
      className="group p-2 rounded-lg bg-white/5 border border-white/10 
      hover:bg-pink-500/20 hover:border-pink-500/30 
      transition-all duration-300"
    >
      <FaInstagram className="text-gray-400 group-hover:text-pink-400 text-lg transition" />
    </a>

  </div>

    


</div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}