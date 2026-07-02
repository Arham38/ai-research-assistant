import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast"; // <-- Toast import kiya

export const metadata: Metadata = {
  title: "AI Research Assistant",
  description: "Search, summarize, and chat with research papers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <Navbar />
        {children}
        
        {/* Toast notifications display karne ke liye */}
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}