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
  const [username, setUsername] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log("Current Navbar Role State:", role);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleUserSession = async (session: any) => {
      const user = session?.user;

      if (!user) {
        console.log("Belum login / Session kosong");
        setRole(null);
        setUsername(null);
        setIsLoading(false);
        return;
      }

      console.log("User detected:", user.email);

      // Set Username
      if (user.email) {
        setUsername(user.email.split("@")[0]);
      }

      try {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        const userRole = data?.role?.toLowerCase() ?? null;
        setRole(userRole);
        console.log("Fetched Role from DB:", userRole);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };console.log("Role:", role);

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth Event:", _event); // event apa yang terjadi
      handleUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOutClick = async () => {
    fetch('/api/signout', { method: 'POST' })
        .then((res) => {
          if (res.ok) {
            // sukses, akan ke page login
            router.push('/login');
            router.refresh();
          }
        })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  if (
    pathname === "/login" || 
    pathname === "/register" || 
    pathname?.startsWith("/movies")
  ) {
    return null;
  }

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
            <img src="/images/logo.svg" alt="Logo" className="h-6 md:h-8" />
          </Link>

          <ul className="hidden md:flex gap-5 text-sm font-medium text-gray-300">
            <li>
              <Link 
                href={role === "admin" ? "/admin" : "/"} 
                className="text-white font-bold cursor-pointer"
              >
                Home
              </Link>
            </li>
            {!isLoading && role !== "admin" && (
              <>
                <li>
                  <Link
                    href="/tv-shows"
                    className="hover:text-gray-400 cursor-pointer transition"
                  >
                    TV Shows
                  </Link>
                </li>
                <li> 
                  <Link
                    href="/movie"
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
              </>
            )}
          </ul>
        </div>

        {/* BAGIAN KANAN: Search, Admin, User */}
        <div className="flex items-center gap-5 text-white">
          {!isLoading && role !== "admin" && (
            <Link href="/search">
              <Search className="w-5 h-5" />
            </Link>
          )}

          {!isLoading && role === "admin" && (
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
                  <p className="text-xs text-gray-500 mb-1">Signed in as</p>
                  <p className="text-white font-semibold truncate">
                    {username || "none"}
                  </p>
                </div>
                <button
                  onClick={handleSignOutClick}
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
