
import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaArrowUp,
  FaCode,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
  FaLaptopCode,
  FaChevronRight,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Me", href: "/about" },
    { name: "My Blog", href: "/blog" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  const topics = [
    { name: "Technology", href: "/blog" },
    { name: "Programming", href: "/blog" },
    { name: "Artificial Intelligence", href: "/blog" },
    { name: "Gaming", href: "/blog" },
  ];

  const socialLinks = [
    {
      icon: <FaGithub />,
      href: "https://github.com/920Rajitha",
      label: "GitHub",
    },
    {
      icon: <FaLinkedin />,
      href: "https://linkedin.com/in/rajitha-lakshan-4b269b351",
      label: "LinkedIn",
    },
    {
      icon: <FaFacebook />,
      href: "https://www.facebook.com/share/1DjDYyx4Dm/",
      label: "Facebook",
    },
    {
      icon: <FaInstagram />,
      href: "https://www.instagram.com/ra_j_i_t_h_a?igsh=MjFsN3F1Mmdicjcx",
      label: "Instagram",
    },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden bg-[#070b14] text-gray-400">

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">

        {/* TOP CTA SECTION */}
        <div className="py-12 md:py-16 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div className="text-center md:text-left">
              <span className="text-blue-400 text-xs font-semibold uppercase tracking-[4px]">
                Let's Connect
              </span>

              <h2 className="text-2xl md:text-4xl font-bold text-white mt-3">
                Have an idea?
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  {" "}Let's build it.
                </span>
              </h2>

              <p className="text-sm md:text-base text-gray-400 mt-3 max-w-xl">
                Interested in working together, discussing technology, or
                exploring new opportunities? Feel free to reach out.
              </p>
            </div>

            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
            >
              Get In Touch
              <FaChevronRight className="text-xs" />
            </Link>

          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-14">

          {/* BRAND */}
          <div className="lg:col-span-1">

            <Link href="/" className="inline-flex items-center gap-3 group mb-6">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
                <FaCode className="text-white text-xl" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Rajitha<span className="text-blue-400">.</span>
                </h2>

                <p className="text-[10px] uppercase tracking-[3px] text-gray-500">
                  Developer & Blogger
                </p>
              </div>

            </Link>

            <p className="text-sm leading-7 text-gray-400 max-w-xs">
              Exploring the world of technology, software development,
              artificial intelligence, and modern digital experiences.
              Sharing knowledge and building creative solutions.
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex items-center gap-3 mt-7">

              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}

            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-7">
              Quick Links
            </h3>

            <ul className="space-y-4">

              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm hover:text-blue-400 transition-colors duration-300"
                  >
                    <FaChevronRight className="text-[9px] text-blue-500 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* EXPLORE TOPICS */}
          <div>
  <h3 className="text-white font-semibold text-sm mb-7">
    Useful Resources
  </h3>

  <ul className="space-y-4">
    <li>
      <a
        href="https://github.com/920Rajitha"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors"
      >
        <FaGithub className="text-blue-400" />
        GitHub Profile
      </a>
    </li>

    <li>
      <a
        href="https://linkedin.com/in/rajitha-lakshan-4b269b351"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors"
      >
        <FaLinkedin className="text-blue-400" />
        LinkedIn Profile
      </a>
    </li>

    <li>
      <a
        href="mailto:rajitha.development@gmail.com"
        className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors"
      >
        <FaEnvelope className="text-blue-400" />
        Send an Email
      </a>
    </li>

    
  </ul>
</div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-7">
              Contact Information
            </h3>

            <div className="space-y-5">

              <a
                href="mailto:rajitha.development@gmail.com"
                className="flex items-start gap-3 text-sm hover:text-blue-400 transition-colors"
              >
                <FaEnvelope className="text-blue-400 mt-1 shrink-0" />
                <span className="break-all">
                  rajitha.development@gmail.com
                </span>
              </a>

              <div className="flex items-center gap-3 text-sm">
                <FaMapMarkerAlt className="text-blue-400 shrink-0" />
                <span>Sri Lanka</span>
              </div>

            </div>

            <div className="mt-7 p-4 rounded-xl bg-white/[0.04] border border-white/10">
              <p className="text-xs text-gray-400 leading-6">
                Open to internships, software projects, collaborations,
                and exciting opportunities.
              </p>
            </div>

          </div>

        </div>

        {/* BOTTOM FOOTER */}
        <div className="border-t border-white/10 py-7">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <p className="text-xs text-gray-500 text-center md:text-left">
              © {currentYear} Rajitha Lakshan. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs">

              <Link
                href="/privacy-policy"
                className="hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="hover:text-blue-400 transition-colors"
              >
                Terms & Conditions
              </Link>

            </div>

            <a
              href="#top"
              aria-label="Back to top"
              className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-1 transition-all duration-300"
            >
              <FaArrowUp />
            </a>

          </div>

          <div className="flex items-center justify-center gap-1 mt-7 text-[11px] text-gray-600">
            Designed & Built with
            <FaHeart className="text-red-500 mx-1" />
            by Rajitha Lakshan
          </div>

        </div>

      </div>
    </footer>
  );
}
