import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

const displayFont = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const sansFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

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
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-paper text-ink font-sans">
        <Navbar />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1B2A4A",
              color: "#FFFFFF",
              border: "1px solid #3D4F73",
              borderRadius: "4px",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}