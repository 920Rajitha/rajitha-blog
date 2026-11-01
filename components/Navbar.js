"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  FiUser,
  FiFileText,
  FiShield,
  FiBookOpen,
  FiMail,
  FiX,
} from "react-icons/fi";

import {
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaPlus,
} from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const navItems = [
    {
      name: "About",
      path: "/about",
      icon: <FiUser />,
    },
    {
      name: "Blog",
      path: "/",
      icon: <FiFileText />,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <FiMail />,
    },
    {
      name: "Privacy Policy",
      path: "/privacy-policy",
      icon: <FiShield />,
    },
    {
      name: "Terms & Conditions",
      path: "/terms",
      icon: <FiBookOpen />,
    },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/rajitha-lakshan-4b269b351",
      icon: <FaLinkedin />,
      color: "hover:bg-blue-500/20 hover:text-blue-400",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1DjDYyx4Dm/",
      icon: <FaFacebook />,
      color: "hover:bg-blue-600/20 hover:text-blue-400",
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/94750979908",
      icon: <FaWhatsapp />,
      color: "hover:bg-green-500/20 hover:text-green-400",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/ra_j_i_t_h_a",
      icon: <FaInstagram />,
      color: "hover:bg-pink-500/20 hover:text-pink-400",
    },
  ];

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside
        className="
          hidden md:flex
          fixed top-0 left-0
          h-screen w-20
          flex-col items-center
          bg-[#020617]/95
          backdrop-blur-xl
          border-r border-white/10
          z-50
        "
      >
        {/* LOGO */}

        <Link
          href="/"
          aria-label="Go to homepage"
          className="
            flex items-center justify-center
            w-full h-16 shrink-0
            text-3xl font-bold
            bg-gradient-to-br from-blue-400 to-purple-500
            bg-clip-text text-transparent
            hover:scale-110 transition-transform duration-300
          "
        >
          R
        </Link>

        {/* NAVIGATION */}

        <nav
          aria-label="Main navigation"
          className="
            flex flex-col items-center justify-center
            flex-1 w-full
            gap-5
          "
        >
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                aria-label={item.name}
                aria-current={active ? "page" : undefined}
                title={item.name}
                className="relative group flex items-center justify-center"
              >
                {/* ACTIVE INDICATOR */}

                {active && (
                  <span
                    className="
                      absolute left-0
                      top-1/2 -translate-y-1/2
                      w-1 h-7
                      rounded-r-full
                      bg-blue-500
                      shadow-[0_0_12px_rgba(59,130,246,0.7)]
                    "
                  />
                )}

                {/* ICON */}

                <span
                  className={`
                    w-12 h-12
                    flex items-center justify-center
                    rounded-xl text-xl
                    transition-all duration-300
                    ${
                      active
                        ? "text-white bg-blue-500/15 shadow-lg shadow-blue-500/10"
                        : "text-gray-500 hover:text-white hover:bg-white/[0.06] hover:scale-110"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {/* TOOLTIP */}

                <span
                  className="
                    absolute left-[68px]
                    top-1/2 -translate-y-1/2
                    px-3 py-2
                    rounded-lg
                    bg-[#111827]
                    border border-white/10
                    text-white text-xs font-medium
                    whitespace-nowrap
                    opacity-0 invisible
                    group-hover:opacity-100
                    group-hover:visible
                    group-hover:translate-x-1
                    transition-all duration-200
                    pointer-events-none
                    shadow-xl
                  "
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* SOCIAL LINKS */}

        <div className="w-full flex flex-col items-center gap-3 pb-5 shrink-0">

          <div className="w-10 h-px bg-white/10 mb-2" />

          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              className={`
                w-10 h-10
                flex items-center justify-center
                rounded-xl
                bg-white/[0.04]
                border border-white/10
                text-gray-400 text-lg
                transition-all duration-300
                hover:-translate-y-1
                hover:border-white/20
                ${social.color}
              `}
            >
              {social.icon}
            </a>
          ))}

          {/* COPYRIGHT */}

          <span className="text-[10px] text-gray-600 mt-2">
            © {new Date().getFullYear()}
          </span>

        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}

      <nav
        aria-label="Mobile navigation"
        className="
          md:hidden
          fixed bottom-4 left-1/2 -translate-x-1/2
          w-[95%] max-w-md
          px-2 py-3
          flex items-center justify-around
          bg-[#020617]/95
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          shadow-2xl shadow-black/40
          z-[100]
        "
      >

        {/* ABOUT */}

        <Link
          href="/about"
          className="flex flex-col items-center gap-1 min-w-0"
        >
          <span
            className={`
              w-9 h-9 flex items-center justify-center
              rounded-xl text-lg transition-all
              ${
                isActive("/about")
                  ? "text-white bg-blue-500/20"
                  : "text-gray-400"
              }
            `}
          >
            <FiUser />
          </span>

          <span className={`text-[10px] ${
            isActive("/about") ? "text-blue-400" : "text-gray-500"
          }`}>
            About
          </span>
        </Link>

        {/* RESUME */}

        <button
          onClick={() => setShowResume(true)}
          className="flex flex-col items-center gap-1 min-w-0"
          aria-label="View Resume"
        >
          <span className="
            w-9 h-9 flex items-center justify-center
            rounded-xl text-lg text-gray-400
            hover:text-white transition
          ">
            <FiFileText />
          </span>

          <span className="text-[10px] text-gray-500">
            Resume
          </span>
        </button>

        {/* BLOG */}

        <Link
          href="/"
          className="flex flex-col items-center gap-1 min-w-0"
        >
          <span
            className={`
              w-9 h-9 flex items-center justify-center
              rounded-xl text-lg transition-all
              ${
                isActive("/")
                  ? "text-white bg-blue-500/20"
                  : "text-gray-400"
              }
            `}
          >
            <FiFileText />
          </span>

          <span className={`text-[10px] ${
            isActive("/") ? "text-blue-400" : "text-gray-500"
          }`}>
            Blog
          </span>
        </Link>

        {/* CONTACT */}

        <Link
          href="/contact"
          className="flex flex-col items-center gap-1 min-w-0"
        >
          <span
            className={`
              w-9 h-9 flex items-center justify-center
              rounded-xl text-lg transition-all
              ${
                isActive("/contact")
                  ? "text-white bg-blue-500/20"
                  : "text-gray-400"
              }
            `}
          >
            <FiMail />
          </span>

          <span className={`text-[10px] ${
            isActive("/contact") ? "text-blue-400" : "text-gray-500"
          }`}>
            Contact
          </span>
        </Link>

        {/* PRIVACY */}

        <Link
          href="/privacy-policy"
          className="flex flex-col items-center gap-1 min-w-0"
        >
          <span
            className={`
              w-9 h-9 flex items-center justify-center
              rounded-xl text-lg transition-all
              ${
                isActive("/privacy-policy")
                  ? "text-white bg-blue-500/20"
                  : "text-gray-400"
              }
            `}
          >
            <FiShield />
          </span>

          <span className={`text-[10px] ${
            isActive("/privacy-policy") ? "text-blue-400" : "text-gray-500"
          }`}>
            Privacy
          </span>
        </Link>

        {/* TERMS */}

        <Link
          href="/terms"
          className="flex flex-col items-center gap-1 min-w-0"
        >
          <span
            className={`
              w-9 h-9 flex items-center justify-center
              rounded-xl text-lg transition-all
              ${
                isActive("/terms")
                  ? "text-white bg-blue-500/20"
                  : "text-gray-400"
              }
            `}
          >
            <FiBookOpen />
          </span>

          <span className={`text-[10px] ${
            isActive("/terms") ? "text-blue-400" : "text-gray-500"
          }`}>
            Terms
          </span>
        </Link>

      </nav>

      {/* ================= MOBILE SOCIAL BUTTON ================= */}

      <div
        className="
          md:hidden
          fixed bottom-28 right-5
          z-[110]
          flex flex-col items-end
        "
      >

        {/* SOCIAL ICONS */}

        <div
          className={`
            flex flex-col gap-3 mb-3
            transition-all duration-300
            ${
              open
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }
          `}
        >
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="
                w-11 h-11
                flex items-center justify-center
                rounded-full
                bg-[#111827]
                border border-white/10
                text-white text-lg
                shadow-xl
                hover:scale-110
                transition-all duration-300
              "
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* TOGGLE BUTTON */}

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close social links" : "Open social links"}
          aria-expanded={open}
          className={`
            w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-gradient-to-br from-blue-500 to-indigo-600
            text-white text-lg
            shadow-xl shadow-blue-500/30
            transition-all duration-300
            hover:scale-110
            ${open ? "rotate-45" : ""}
          `}
        >
          {open ? <FiX /> : <FaPlus />}
        </button>

      </div>

      {/* ================= RESUME MODAL ================= */}

      {showResume && (
        <div
          className="
            fixed inset-0
            bg-black/80 backdrop-blur-md
            flex items-center justify-center
            p-3
            z-[9999]
          "
          onClick={() => setShowResume(false)}
        >
          <div
            className="
              relative
              w-full max-w-5xl
              h-[85vh]
              bg-[#020617]
              border border-white/10
              rounded-2xl
              overflow-hidden
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}

            <button
              onClick={() => setShowResume(false)}
              aria-label="Close resume"
              className="
                absolute top-3 right-3
                z-10
                w-10 h-10
                flex items-center justify-center
                rounded-xl
                bg-black/70
                border border-white/10
                text-white
                hover:bg-red-500
                transition
              "
            >
              <FiX />
            </button>

            {/* RESUME PDF */}

            <iframe
              src="/Rajitha%20NEW%20CV.pdf"
              title="Rajitha Resume"
              className="w-full h-full"
            />
          </div>
        </div>
      )}

    </>
  );
}