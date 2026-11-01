
"use client";

import { FaGlobe } from "react-icons/fa";
import { FaGithub, FaBlog } from "react-icons/fa";
import { FaReceipt } from "react-icons/fa";
import { FaCode, FaServer, FaDatabase, FaTools } from "react-icons/fa";

export default function About() {
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
                  src="/profile.png"
                  alt="Rajitha"
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl border border-white/10 shadow-xl"
                />

                {/* GLOW EFFECT */}
                <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl opacity-60"></div>
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

          {/* SKILLS & TECHNOLOGIES */}
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
                  items: ["SQL Server", "MySQL", "Firebase", "MongoDB", "PhpMyAdmin", "postgreSQL"],
                  icon: <FaDatabase />,
                  color: "purple",
                },
                {
                  title: "Tools",
                  items: ["Git", "VS Code", "Figma", "Android Studio", "Visual Studio"],
                  icon: <FaTools />,
                  color: "orange",
                },
              ].map((section, i) => (
                <div
                  key={i}
                  className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >

                  {/* HEADER */}
                  <div className="flex items-center gap-3 mb-4">

                    <div
                      className={`p-2 rounded-lg ${
                        section.color === "blue"
                          ? "bg-blue-500/10 text-blue-400"
                          : section.color === "green"
                          ? "bg-green-500/10 text-green-400"
                          : section.color === "purple"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-orange-500/10 text-orange-400"
                      }`}
                    >
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
                        className="text-xs px-3 py-1 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition"
                      >
                        {item}
                      </span>
                    ))}

                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* FEATURED PROJECTS */}
          <div className="w-full max-w-6xl mx-auto px-4 py-10">

            <h2 className="text-2xl font-semibold mb-8 text-white tracking-wide">
              Featured Projects
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {[
                {
                  title: "AI Resume Screening System",
                  desc: "Automates resume evaluation using AI and intelligent skill matching.",
                  icon: <FaReceipt />,
                  image: "/projects/image 1.png",
                  github: "https://github.com/920Rajitha/CVResumeScreeningApp",
                },
                {
                  title: "Rajitha Portfolio Web",
                  desc: "Modern and responsive personal portfolio website built using React.js, Node.js, and Tailwind CSS. Showcases my projects, skills, and experience with a clean UI, smooth navigation, and interactive user experience.",
                  icon: <FaGlobe />,
                  image: "/projects/portfolio.png",
                  github: "https://github.com/920Rajitha/portfolio",
                },
                {
                  title: "DevTip Blog Platform",
                  desc: "Modern blog system with admin dashboard built using Php/PhpMyAdmin.",
                  icon: <FaBlog />,
                  image: "/projects/download.png",
                  github: "https://github.com/920Rajitha/dev-tips-hub",
                },
                {
                  title: "Tuition Fee Management System",
                  desc: "A .NET-based tuition management system integrated with SQL Server for efficient student fee tracking, payment updates, and real-time dashboard insights.",
                  icon: <FaReceipt />,
                  image: "/projects/tuition_project2.png",
                },
                {
                  title: "Firewood Billing System",
                  desc: "A .NET-based billing application integrated with SQL Server to calculate firewood costs, generate invoices, and print detailed bills with an easy-to-use interface.",
                  icon: <FaReceipt />,
                  image: "/projects/print.png",
                },
                {
                  title: "My Personal Blog & Portfolio",
                  desc: "Modern full-stack portfolio & blog platform with admin dashboard, built using Next.js, Prisma, and PostgreSQL. Showcases projects, skills, and experience with a clean UI, smooth navigation, and interactive user experience.",
                  icon: <FaBlog />,
                  image: "/projects/blog.png",
                  github: "https://github.com/920Rajitha/rajitha-blog",
                },
                {
                  title: "Flutter mobile app for anthurium plant sales",
                  desc: "Developed a Flutter mobile app for anthurium plant sales with real-time updates powered by Firebase. Features include categorized browsing, detailed plant views, WhatsApp-based ordering, and an admin panel for live data management.",
                  icon: <FaBlog />,
                  image: "/projects/anthurim.jpeg",
                  github: "https://github.com/920Rajitha/anthurium-shop-app",
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                >

                  {/* IMAGE */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* OVERLAY */}
                    {p.github && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">

                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-white border border-white/30 rounded-lg backdrop-blur-md hover:bg-white/10 transition"
                        >
                          <FaGithub />
                          View on GitHub
                        </a>

                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h3 className="text-sm font-semibold mb-2 text-white">
                      {p.title}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {p.desc}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
