"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiUser,
  FiFileText,
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "About", path: "/about", icon: <FiUser /> },
    { name: "Blog", path: "/", icon: <FiFileText /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-24 
    bg-[#020617]/90 backdrop-blur-xl 
    border-r border-white/10 
    flex flex-col items-center py-8 z-50">

      {/* LOGO */}
      <div className="text-white text-2xl font-bold mb-12 tracking-widest 
      bg-gradient-to-br from-blue-400 to-purple-500 
      bg-clip-text text-transparent">
        R
      </div>

      {/* NAV ITEMS */}
      <div className="flex flex-col gap-8">

        {navItems.map((item, index) => {
          const isActive = pathname === item.path;

          return (
            <Link key={index} href={item.path} className="relative group">

              {/* ACTIVE GLOW */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl 
                bg-blue-500/10 blur-lg"></div>
              )}

              {/* ACTIVE LINE */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 
                w-1 h-6 bg-blue-500 rounded-r"></div>
              )}

              {/* ICON BOX */}
              <div
                className={`
                relative flex items-center justify-center 
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
              transition-all duration-300 
              pointer-events-none shadow-xl border border-white/10">
                {item.name}
              </span>

            </Link>
          );
        })}

      </div>

      {/* BOTTOM (OPTIONAL) */}
      <div className="mt-auto text-xs text-gray-500">
        © R
      </div>

    </div>
  );
}