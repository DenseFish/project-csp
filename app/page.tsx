"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// --- IMPORT COMPONENT ---
import Navbar from "@/app/components/Navbar";
import Billboard from "@/app/components/Billboard";
import MovieList from "@/app/components/MovieList";
import InfoModal from "@/app/components/InfoModal"; 

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return <div className="h-screen w-full bg-[#141414]"></div>;
  }

  return (
    <main className="relative min-h-screen bg-[#141414] overflow-x-hidden">
      
      <InfoModal />

      <Navbar />

      <Billboard />

      <div className="pb-40 pl-4 md:pl-16 mt-4 md:-mt-32 relative z-10 flex flex-col gap-10">
        <MovieList title="Trending Now" />
        <MovieList title="Top Rated" />
        <MovieList title="Action Movies" />
        <MovieList title="Comedy Movies" />
        <MovieList title="Horror Movies" />
      </div>
    </main>
  );
}
