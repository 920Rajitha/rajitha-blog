"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { FiUser, FiFileText } from "react-icons/fi";
import {
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaPlus
} from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showResume, setShowResume] = useState(false); // ✅ NEW

  const navItems = [
    { name: "About", path: "/about", icon: <FiUser /> },
    { name: "Blog", path: "/", icon: <FiFileText /> },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-24 
      bg-[#020617]/90 backdrop-blur-xl 
      border-r border-white/10 
      flex-col items-center py-8 z-50">

        <div className="text-2xl font-bold mb-12 tracking-widest 
        bg-gradient-to-br from-blue-400 to-purple-500 
        bg-clip-text text-transparent">
          R
        </div>

        <div className="flex flex-col gap-8 flex-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <Link key={index} href={item.path} className="relative group">
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 
                  w-1 h-6 bg-blue-500 rounded-r"></div>
                )}

                <div className={`
                  flex items-center justify-center 
                  w-12 h-12 rounded-xl text-xl 
                  transition-all duration-300
                  ${
                    isActive
                      ? "text-white bg-blue-500/10 shadow-lg"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }
                `}>
                  {item.icon}
                </div>

                <span className="absolute left-20 top-1/2 -translate-y-1/2 
                bg-[#0f172a] text-white text-xs px-3 py-1 rounded-lg 
                opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* SOCIAL ICONS DESKTOP */}
        <div className="flex flex-col items-center gap-4 mt-6 mb-10">
          <a href="https://linkedin.com/in/rajitha-lakshan-4b269b351" target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/20 transition hover:scale-110">
            <FaLinkedin className="text-gray-400 hover:text-blue-400" />
          </a>

          <a href="https://www.facebook.com/share/1DjDYyx4Dm/" target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-blue-600/20 transition hover:scale-110">
            <FaFacebook className="text-gray-400 hover:text-blue-500" />
          </a>

          <a href="https://wa.me/94750979908" target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-green-500/20 transition hover:scale-110">
            <FaWhatsapp className="text-gray-400 hover:text-green-400" />
          </a>

          <a href="https://www.instagram.com/ra_j_i_t_h_a" target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-pink-500/20 transition hover:scale-110">
            <FaInstagram className="text-gray-400 hover:text-pink-400" />
          </a>
        </div>

        <div className="mt-auto text-xs text-gray-500">
          © R
        </div>
      </div>

      {/* ================= MOBILE NAV ================= */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 
      w-[90%] max-w-sm 
      bg-[#020617]/90 backdrop-blur-xl 
      border border-white/10 
      rounded-2xl px-4 py-3 
      flex justify-between items-center 
      shadow-2xl z-50">

        {/* ABOUT */}
        <Link href="/about" className="flex flex-col items-center">
          <div className={`w-11 h-11 flex items-center justify-center rounded-xl text-lg
            ${pathname === "/about" ? "text-white bg-blue-500/20 scale-110 shadow-lg" : "text-gray-400"}`}>
            <FiUser />
          </div>
          <span className={`text-[10px] mt-1 ${
            pathname === "/about" ? "text-blue-400" : "text-gray-500"
          }`}>About</span>
        </Link>

        {/* RESUME PREVIEW 🔥 */}
        <button onClick={() => setShowResume(true)} className="flex flex-col items-center">
          <div className="w-11 h-11 flex items-center justify-center rounded-xl text-lg text-gray-400 hover:text-white">
            <FiFileText />
          </div>
          <span className="text-[10px] mt-1 text-gray-500">Resume</span>
        </button>

        {/* BLOG */}
        <Link href="/" className="flex flex-col items-center">
          <div className={`w-11 h-11 flex items-center justify-center rounded-xl text-lg
            ${pathname === "/" ? "text-white bg-blue-500/20 scale-110 shadow-lg" : "text-gray-400"}`}>
            <FiFileText />
          </div>
          <span className={`text-[10px] mt-1 ${
            pathname === "/" ? "text-blue-400" : "text-gray-500"
          }`}>Blog</span>
        </Link>

      </div>

      {/* ================= RESUME MODAL ================= */}
      {showResume && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm 
        flex items-center justify-center z-[9999]">

          <div className="w-[95%] h-[85%] 
          bg-[#020617] border border-white/10 
          rounded-xl shadow-2xl relative overflow-hidden">

            <button
              onClick={() => setShowResume(false)}
              className="absolute top-3 right-3 text-white bg-white/10 
              px-3 py-1 rounded-lg hover:bg-red-500 transition"
            >
              ✕
            </button>

            <iframe src="/resume.pdf" className="w-full h-full"></iframe>
          </div>
        </div>
      )}

      {/* ================= FLOATING SOCIAL FAB ================= */}
      <div className="md:hidden fixed bottom-28 right-5 z-[999] flex flex-col items-end gap-3">

        <div className={`flex flex-col gap-3 mb-2 transition-all duration-300
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}>

          <a href="https://linkedin.com/in/rajitha-lakshan-4b269b351" target="_blank"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
            <FaLinkedin />
          </a>

          <a href="https://www.facebook.com/share/1DjDYyx4Dm/" target="_blank"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
            <FaFacebook />
          </a>

          <a href="https://wa.me/94750979908" target="_blank"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
            <FaWhatsapp />
          </a>

          <a href="https://www.instagram.com/ra_j_i_t_h_a" target="_blank"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-lg">
            <FaInstagram />
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`w-12 h-12 rounded-full flex items-center justify-center 
          bg-gradient-to-br from-blue-500 to-purple-500 
          text-white shadow-xl transition ${open ? "rotate-45" : ""}`}
        >
          <FaPlus />
        </button>

      </div>
    </>
  );
}