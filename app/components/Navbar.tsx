"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setRole(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setRole(data?.role ?? null);
    };
    fetchRole();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-4 md:px-12 py-4 transition-colors duration-300 ${
        scrolled
          ? "bg-[#141414]"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* BAGIAN KIRI: Logo & Menu */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" className="h-6 md:h-8" />
          </Link>

          <ul className="hidden md:flex gap-5 text-sm font-medium text-gray-300">
            <li>
              <Link href="/" className="text-white font-bold cursor-pointer">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-gray-400 cursor-pointer transition"
              >
                TV Shows
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-gray-400 cursor-pointer transition"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                href="/mylist"
                className="hover:text-gray-400 cursor-pointer transition"
              >
                My List
              </Link>
            </li>
          </ul>
        </div>

        {/* BAGIAN KANAN: Search, Admin, User */}
        <div className="flex items-center gap-5 text-white">
          <Link href="/search">
            <Search className="w-5 h-5 cursor-pointer hover:text-gray-300" />
          </Link>

          {role === "admin" && (
            <Link
              href="/admin"
              className="text-xs font-bold border border-white px-2 py-1 rounded hover:bg-white hover:text-black transition"
            >
              ADMIN
            </Link>
          )}

          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />

          {/* === USER PROFILE DROPDOWN (FIXED) === */}
          <div className="group relative flex items-center gap-2 cursor-pointer py-2">
            {/* Avatar Icon */}
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5" />
            </div>

            {/* LOGIKA FIX: 
                - pt-4: Memberikan 'jembatan' transparan agar mouse tidak putus
                - invisible group-hover:visible: Memastikan menu benar-benar hilang saat tidak di-hover
            */}
            <div className="absolute top-full right-0 w-32 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {/* Kontainer Menu yang Sebenarnya */}
              <div className="bg-black border border-gray-700 rounded shadow-lg overflow-hidden flex flex-col">
                <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700 cursor-default">
                  Account
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#e50914] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          {/* === END DROPDOWN === */}
        </div>
      </div>
    </nav>
  );
}
