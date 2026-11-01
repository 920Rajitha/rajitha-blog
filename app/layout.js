import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavigationLoader from "@/components/NavigationLoader";

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
          bg-[#020617]
          text-gray-200
          transition-colors
          duration-500
        "
      >
        <NavigationLoader />
        <Navbar />

        <div className="md:ml-20 flex min-h-screen w-full min-w-0 flex-col bg-[#020617]">
          <main className="flex-1 w-full min-w-0 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
