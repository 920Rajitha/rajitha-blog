import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="
      flex 
      bg-[#f8fafc] dark:bg-[#0f172a] 
      transition-colors duration-500
      ">

        {/* Sidebar */}
        <Navbar />

        {/* Main Content */}
        <div className="md:ml-20 w-full pb-20 md:pb-0">
          {children}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

      </body>
    </html>
  );
}