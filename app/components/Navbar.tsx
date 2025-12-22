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
        return;
      }

      console.log("User detected:", user.email);

      // Set Username
      if (user.email) {
        setUsername(user.email.split("@")[0]);
      }

      // Set Role
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      setRole(data?.role ?? null);
    };

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
    // Sign out logic here
    fetch('/api/signout', { method: 'POST' })
        .then((res) => {
          if (res.ok) {
            // sukses, akan ke page login
            window.location.href = '/login';
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
          <Link href="/" className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 170 79" 
              className="h-6 md:h-8 w-auto"
            >
              <path d="M0 0 C1.51400391 0.01740234 1.51400391 0.01740234 3.05859375 0.03515625 C4.07050781 0.04417969 5.08242187 0.05320313 6.125 0.0625 C7.29869141 0.07990234 7.29869141 0.07990234 8.49609375 0.09765625 C8.50640121 0.7970079 8.51670868 1.49635956 8.52732849 2.21690369 C8.62514407 8.79479288 8.72763532 15.37259045 8.83543301 21.95032406 C8.89069177 25.33232747 8.94411631 28.71433949 8.9934082 32.09643555 C9.05010321 35.98105052 9.1146696 39.86551503 9.1796875 43.75 C9.19639999 44.96977036 9.21311249 46.18954071 9.23033142 47.4462738 C9.25027664 48.56736038 9.27022186 49.68844696 9.29077148 50.84350586 C9.30631577 51.83611923 9.32186005 52.8287326 9.33787537 53.85142517 C9.24727819 56.06739922 9.24727819 56.06739922 10.49609375 57.09765625 C12.80609375 57.09765625 15.11609375 57.09765625 17.49609375 57.09765625 C17.82609375 38.28765625 18.15609375 19.47765625 18.49609375 0.09765625 C22.45609375 0.09765625 26.41609375 0.09765625 30.49609375 0.09765625 C30.57045005 7.64157982 30.62479431 15.18528833 30.66088867 22.72949219 C30.67594154 25.29398313 30.69638836 27.85844848 30.72241211 30.42285156 C30.75894842 34.11660088 30.77585569 37.81000871 30.7890625 41.50390625 C30.80454636 42.64380005 30.82003021 43.78369385 30.83598328 44.95812988 C30.83761757 52.75131287 30.25080247 58.76300885 25.12109375 64.97265625 C20.87885461 68.40684984 16.87785273 69.39531961 11.49609375 69.91015625 C9.98015625 70.07451172 9.98015625 70.07451172 8.43359375 70.2421875 C4.95153043 70.07086258 3.28316938 69.13923788 0.49609375 67.09765625 C-3.07002093 63.02209662 -3.62922889 59.67178433 -3.63330078 54.35693359 C-3.63645294 53.17916351 -3.6396051 52.00139343 -3.64285278 50.78793335 C-3.64082855 49.51600128 -3.63880432 48.24406921 -3.63671875 46.93359375 C-3.63767548 45.63064362 -3.6386322 44.32769348 -3.63961792 42.98526001 C-3.64109145 40.2297446 -3.63895073 37.47426164 -3.63427734 34.71875 C-3.62856903 31.17990233 -3.63186817 27.64113031 -3.63784981 24.10228539 C-3.64232175 20.73354869 -3.63919597 17.3648326 -3.63671875 13.99609375 C-3.63874298 12.72011322 -3.64076721 11.44413269 -3.64285278 10.12948608 C-3.63970062 8.95802032 -3.63654846 7.78655457 -3.63330078 6.57958984 C-3.63250519 5.54273041 -3.63170959 4.50587097 -3.63088989 3.43759155 C-3.45408595 0.1796146 -3.2728845 0.1276476 0 0 Z " fill="#E5020B" transform="translate(6.50390625,1.90234375)"/>
              <path d="M0 0 C4.29 0 8.58 0 13 0 C13.42152344 1.28777344 13.84304687 2.57554688 14.27734375 3.90234375 C14.8305717 5.58078108 15.38396568 7.25916368 15.9375 8.9375 C16.35418945 10.21270508 16.35418945 10.21270508 16.77929688 11.51367188 C17.04677734 12.32255859 17.31425781 13.13144531 17.58984375 13.96484375 C17.83597412 14.7137085 18.08210449 15.46257324 18.33569336 16.23413086 C18.86064269 17.99825981 18.86064269 17.99825981 20 19 C20.42152344 17.79601562 20.84304687 16.59203125 21.27734375 15.3515625 C21.83066017 13.77601743 22.38404936 12.20049792 22.9375 10.625 C23.21529297 9.8309375 23.49308594 9.036875 23.77929688 8.21875 C24.04677734 7.45820313 24.31425781 6.69765625 24.58984375 5.9140625 C24.83597412 5.2123291 25.08210449 4.5105957 25.33569336 3.78759766 C26 2 26 2 27 0 C30.63 0 34.26 0 38 0 C37.76255849 4.80988668 36.56586469 8.07043343 34.29296875 12.32421875 C28.07660544 24.6441524 25.71844131 32.96344701 29.77134705 46.18995667 C32.10109706 53.21407425 34.82375662 60.09716069 37.73974609 66.89672852 C39 70 39 70 39 72 C34.71 71.34 30.42 70.68 26 70 C23.69 63.07 21.38 56.14 19 49 C16.73928845 52.39106733 15.34731177 55.91514137 13.875 59.6875 C13.45927734 60.7403418 13.45927734 60.7403418 13.03515625 61.81445312 C12.35364259 63.54173775 11.67640228 65.27070737 11 67 C9.18674449 66.88648483 7.37436643 66.75887039 5.5625 66.625 C4.55316406 66.55539063 3.54382813 66.48578125 2.50390625 66.4140625 C1.67761719 66.27742188 0.85132813 66.14078125 0 66 C-0.33 65.34 -0.66 64.68 -1 64 C-0.11962891 61.3737793 -0.11962891 61.3737793 1.2734375 58.07421875 C1.7684375 56.88505859 2.2634375 55.69589844 2.7734375 54.47070312 C3.30669005 53.2093809 3.8405503 51.94831543 4.375 50.6875 C5.40934725 48.23537271 6.43648054 45.78052681 7.4609375 43.32421875 C8.15388916 41.6858606 8.15388916 41.6858606 8.86083984 40.0144043 C11.11530719 34.04871456 11.08987837 31.29262821 8.69140625 25.2734375 C8.44583481 24.64394196 8.20026337 24.01444641 7.94725037 23.36587524 C7.16425472 21.36397378 6.3644407 19.3693791 5.5625 17.375 C4.76685838 15.37255109 3.97492064 13.36877466 3.1884613 11.36270142 C2.47505706 9.54660174 1.75061387 7.73484998 1.02563477 5.92333984 C0 3 0 3 0 0 Z " fill="#E5020B" transform="translate(129,2)"/>
              <path d="M0 0 C10.23 0 20.46 0 31 0 C31 3.3 31 6.6 31 10 C24.60046458 10.82574651 18.45301461 11.09088753 12 11 C12 16.28 12 21.56 12 27 C13.32 26.67 14.64 26.34 16 26 C19.67190052 25.87179118 23.32438021 25.95624262 27 26 C27 29.63 27 33.26 27 37 C22.05 37 17.1 37 12 37 C12.01740234 39.90619141 12.01740234 39.90619141 12.03515625 42.87109375 C12.04453221 45.39322821 12.05363262 47.9153637 12.0625 50.4375 C12.07087891 51.71689453 12.07925781 52.99628906 12.08789062 54.31445312 C12.09111328 55.52939453 12.09433594 56.74433594 12.09765625 57.99609375 C12.10289307 59.12200928 12.10812988 60.2479248 12.11352539 61.40795898 C12 64 12 64 11 65 C7.37 65 3.74 65 0 65 C0 43.55 0 22.1 0 0 Z " fill="#E6020B" transform="translate(43,2)"/>
              <path d="M0 0 C3.96 0 7.92 0 12 0 C12 17.49 12 34.98 12 53 C17.61 53 23.22 53 29 53 C31.60341656 55.60341656 30 60.31821299 30 64 C15.15 63.505 15.15 63.505 0 63 C0 42.21 0 21.42 0 0 Z " fill="#E5020B" transform="translate(78,2)"/>
              <path d="M0 0 C3.96 0 7.92 0 12 0 C12 21.45 12 42.9 12 65 C5 65 5 65 0 64 C0 42.88 0 21.76 0 0 Z " fill="#E6020C" transform="translate(112,2)"/>
            </svg>
          </Link>

          <ul className="hidden md:flex gap-5 text-sm font-medium text-gray-300">
            <li>
              <Link href="/" className="text-white font-bold cursor-pointer">
                Home
              </Link>
            </li>
            {role !== "admin" && (
              <li>
                <Link
                  href="/tv-shows"
                  className="hover:text-gray-400 cursor-pointer transition"
                >
                  TV Shows
                </Link>
              </li>
            )}
            {role !== "admin" && (
              <li>
                <Link
                  href="/movie"
                  className="hover:text-gray-400 cursor-pointer transition"
                >
                  Movies
                </Link>
              </li>
            )}
            {role !== "admin" && (
              <li>
                <Link
                  href="/mylist"
                  className="hover:text-gray-400 cursor-pointer transition"
                >
                  My List
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* BAGIAN KANAN: Search, Admin, User */}
        <div className="flex items-center gap-5 text-white">
          {role !== "admin" && (
            <Link href="/search">
              <Search className="w-5 h-5 cursor-pointer hover:text-gray-300" />
            </Link>
          )}

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
