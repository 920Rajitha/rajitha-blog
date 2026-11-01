"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleNavigation = (event) => {
      // Ignore modified clicks (new tab, etc.)
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target.closest("a");

      if (!link) return;

      // Ignore external links and special links
      if (
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        !link.href
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      if (destination.origin !== window.location.origin) return;

      // Ignore same-page hash navigation
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search
      ) {
        return;
      }

      setLoading(true);

      // Safety timeout if navigation fails
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    document.addEventListener("click", handleNavigation, true);

    return () => {
      document.removeEventListener("click", handleNavigation, true);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Stop loading when the new page arrives
  useEffect(() => {
    setLoading(false);
    clearTimeout(timeoutRef.current);
  }, [pathname]);

  return (
    <>
      {loading && (
        <>
          {/* TOP PROGRESS BAR */}
          <div className="fixed top-0 left-0 w-full h-[3px] z-[99999] overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-navigation-progress shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
          </div>

          {/* CENTER LOADER */}
          <div className="fixed inset-0 z-[99998] flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#020617]/90 backdrop-blur-xl px-8 py-7 shadow-2xl">

              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-[3px] border-blue-500/20" />

                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-400 border-r-purple-500 animate-spin" />

                <div className="absolute inset-0 flex items-center justify-center text-blue-400 font-bold">
                  R
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-white">
                  Loading...
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  Preparing your experience
                </p>
              </div>

            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes navigation-progress {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-navigation-progress {
          animation: navigation-progress 1.2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}