"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { getEmail, clearAuth, isLoggedIn } from "@/lib/auth";
import Button from "./Button";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setEmail(getEmail());
  }, []);

  function handleLogout() {
    clearAuth();
    setLoggedIn(false);
    router.push("/login");
  }

  const links = [
    { href: "/search", label: "Search" },
    { href: "/upload", label: "Upload" },
    { href: "/library", label: "Library" },
    { href: "/lit-review", label: "Lit Review" },
  ];

  return (
    <nav className="border-b border-margin bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="/" className="font-display font-semibold text-ink text-base">
          Research Assistant
        </a>

        <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-ink-faint">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden sm:flex items-center gap-6 text-sm">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-ink-light hover:text-ink transition-colors">
              {link.label}
            </a>
          ))}
          {loggedIn ? (
            <div className="flex items-center gap-3 pl-3 border-l border-margin">
              <span className="text-ink-faint font-mono text-xs">{email}</span>
              <Button variant="ghost" onClick={handleLogout}>Log out</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-3 border-l border-margin">
              <a href="/login" className="text-ink-light hover:text-ink">Log in</a>
              <Button variant="primary" href="/register">Register</Button>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 text-sm px-6 pb-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-ink-light">
              {link.label}
            </a>
          ))}
          {loggedIn ? (
            <>
              <span className="text-ink-faint font-mono text-xs">{email}</span>
              <button onClick={handleLogout} className="text-left text-ink-light underline">Log out</button>
            </>
          ) : (
            <>
              <a href="/login" className="text-ink-light">Log in</a>
              <a href="/register" className="text-citation underline">Register</a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}