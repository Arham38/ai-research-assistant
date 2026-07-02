"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getEmail, clearAuth, isLoggedIn } from "@/lib/auth";

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
    setMenuOpen(false);
    router.push("/login");
  }

  // Helper to get first letter of email for avatar
  const userInitial = email ? email.charAt(0).toUpperCase() : "U";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900 tracking-tight text-base group">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-sm group-hover:bg-slate-800 transition-colors">
                AI
              </div>
              <span>Research Assistant</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-1 text-sm font-medium">
            <Link href="/search" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">Search</Link>
            <Link href="/upload" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">Upload</Link>
            <Link href="/library" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">Library</Link>
            <Link href="/lit-review" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">Lit Review</Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
            {loggedIn ? (
              <div className="flex items-center gap-4">
                {/* User Badge */}
                <div className="flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-full shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                    {userInitial}
                  </div>
                  <span className="text-xs font-medium text-slate-700 max-w-[150px] truncate">
                    {email}
                  </span>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="text-slate-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                >
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-sm hover:bg-slate-800 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-all"
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-4 shadow-xl shadow-slate-200/40 absolute w-full left-0">
          <div className="flex flex-col space-y-1 font-medium pb-4 border-b border-slate-100">
            <Link onClick={() => setMenuOpen(false)} href="/search" className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors">Search</Link>
            <Link onClick={() => setMenuOpen(false)} href="/upload" className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors">Upload</Link>
            <Link onClick={() => setMenuOpen(false)} href="/library" className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors">Library</Link>
            <Link onClick={() => setMenuOpen(false)} href="/lit-review" className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors">Lit Review</Link>
          </div>
          
          <div className="pt-4">
            {loggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-lg">
                    {userInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Account</p>
                    <p className="text-xs text-slate-500 truncate">{email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  onClick={() => setMenuOpen(false)} 
                  href="/login" 
                  className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Log in
                </Link>
                <Link 
                  onClick={() => setMenuOpen(false)} 
                  href="/register" 
                  className="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}