import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavigationLoader from "@/components/NavigationLoader";
import CommentSection from "@/components/CommentSection";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8218773820387181"
          crossOrigin="anonymous"
        ></script>
      </head>

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
        <Navbar />

        <div className="md:ml-20 flex min-h-screen w-full flex-col">
          <main className="flex-1 w-full pb-20 md:pb-0">
            {children}
          </main>
          <CommentSection />


          <Footer />
        </div>

        
      </body>
    </html>
  );
}