
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import NavigationLoader from "@/components/NavigationLoader";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        id="top"
        className="
          flex
          min-h-screen
          flex-col
          md:flex-row
          bg-[#f8fafc]
          dark:bg-[#0f172a]
          transition-colors
          duration-500
        "
      >

        <NavigationLoader />
        {/* Sidebar */}
        <Navbar />

        {/* Main Content + Footer */}
        <div className="md:ml-20 flex min-h-screen w-full flex-col">
          
          {/* Page Content */}
          <main className="flex-1 w-full pb-20 md:pb-0">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />

        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </body>
    </html>
  );
}
