"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiFileText } from "react-icons/fi";
import { FaLinkedin, FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();

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

        {/* LOGO */}
        <div className="text-2xl font-bold mb-12 tracking-widest 
        bg-gradient-to-br from-blue-400 to-purple-500 
        bg-clip-text text-transparent">
          R
        </div>

       {/* NAV ITEMS */}
<div className="flex flex-col gap-8 flex-1">

  {navItems.map((item, index) => {
    const isActive = pathname === item.path;

    return (
      <Link key={index} href={item.path} className="relative group">

        {/* ACTIVE LINE */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 
          w-1 h-6 bg-blue-500 rounded-r"></div>
        )}

        <div
          className={`
          flex items-center justify-center 
          w-12 h-12 rounded-xl text-xl 
          transition-all duration-300
          ${
            isActive
              ? "text-white bg-blue-500/10 shadow-lg"
              : "text-gray-500 hover:text-white hover:bg-white/5"
          }
          `}
        >
          {item.icon}
        </div>

        {/* TOOLTIP */}
        <span className="absolute left-20 top-1/2 -translate-y-1/2 
        bg-[#0f172a] text-white text-xs px-3 py-1 rounded-lg 
        opacity-0 group-hover:opacity-100 
        transition pointer-events-none">
          {item.name}
        </span>

      </Link>
    );
  })}

</div>

{/* ================= SOCIAL ICONS ================= */}
<div className="flex flex-col items-center gap-4 mt-6 mb-10">

  <a
    href="https://linkedin.com/in/rajitha-lakshan-4b269b351"
    target="_blank"
    className="group relative flex items-center justify-center 
    w-10 h-10 rounded-lg bg-white/5 border border-white/10 
    hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
  >
    <FaLinkedin className="text-gray-400 group-hover:text-blue-400" />
    <span className="absolute left-16 text-xs bg-[#0f172a] px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition">
      LinkedIn
    </span>
  </a>

  <a
    href="https://www.facebook.com/share/1DjDYyx4Dm/"
    target="_blank"
    className="group relative flex items-center justify-center 
    w-10 h-10 rounded-lg bg-white/5 border border-white/10 
    hover:bg-blue-600/20 transition-all duration-300 hover:scale-110"
  >
    <FaFacebook className="text-gray-400 group-hover:text-blue-500" />
    <span className="absolute left-16 text-xs bg-[#0f172a] px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition">
      Facebook
    </span>
  </a>

  <a
    href="https://wa.me/94750979908"
    target="_blank"
    className="group relative flex items-center justify-center 
    w-10 h-10 rounded-lg bg-white/5 border border-white/10 
    hover:bg-green-500/20 transition-all duration-300 hover:scale-110"
  >
    <FaWhatsapp className="text-gray-400 group-hover:text-green-400" />
    <span className="absolute left-16 text-xs bg-[#0f172a] px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition">
      WhatsApp
    </span>
  </a>

  <a
    href="https://www.instagram.com/ra_j_i_t_h_a?igsh=MjFsN3F1Mmdicjcx"
    target="_blank"
    className="group relative flex items-center justify-center 
    w-10 h-10 rounded-lg bg-white/5 border border-white/10 
    hover:bg-pink-500/20 transition-all duration-300 hover:scale-110"
  >
    <FaInstagram className="text-gray-400 group-hover:text-pink-400" />
    <span className="absolute left-16 text-xs bg-[#0f172a] px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition">
      Instagram
    </span>
  </a>

</div>

        <div className="mt-auto text-xs text-gray-500">
          © R
        </div>
      </div>

     {/* ================= MODERN MOBILE NAV ================= */}
<div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 
w-[90%] max-w-sm 
bg-[#020617]/90 backdrop-blur-xl 
border border-white/10 
rounded-2xl px-4 py-3 
flex justify-between items-center 
shadow-2xl z-50">

  {navItems.map((item, index) => {
    const isActive = pathname === item.path;

    return (
      <Link key={index} href={item.path} className="flex flex-col items-center relative">

        {/* ACTIVE BACKGROUND */}
        {isActive && (
          <div className="absolute inset-0 rounded-xl 
          bg-blue-500/10 blur-md"></div>
        )}

        {/* ICON */}
        <div
          className={`
          relative flex items-center justify-center 
          w-11 h-11 rounded-xl text-lg 
          transition-all duration-300
          ${
            isActive
              ? "text-white bg-blue-500/20 scale-110 shadow-lg"
              : "text-gray-400 hover:text-white"
          }
          `}
        >
          {item.icon}
        </div>

        {/* LABEL */}
        <span
          className={`
          text-[10px] mt-1 transition-all
          ${
            isActive
              ? "text-blue-400"
              : "text-gray-500"
          }
          `}
        >
          {item.name}
        </span>

      </Link>
    );
  })}

</div>
    </>
  );
}