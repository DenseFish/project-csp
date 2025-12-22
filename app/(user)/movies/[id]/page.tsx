"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  backdrop_url: string;
  category: string;
  video_url: string;
};

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      // fetch detail movie
      const { data } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setMovie(data);

      // fetch movie rows
      const { data: allMovies } = await supabase
        .from("movies")
        .select("*");

      if (allMovies) setMovies(allMovies);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading || !movie) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ==== VIDEO SOURCE ====
  const videoSrc = movie.video_url?.includes("watch?v=")
    ? movie.video_url.replace("watch?v=", "embed/") +
      "?autoplay=1&controls=1&rel=0"
    : movie.video_url;

  const categories = ["Trending", "Top Rated", "Action"];

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* ========== HERO / INFO ========== */}
      <section className="relative min-h-[70vh]">
        <img
          src={movie.backdrop_url || movie.poster_url}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 flex items-end min-h-[70vh] px-6 pb-10">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {movie.title}
            </h1>
            <p className="text-gray-200 mb-6">
              {movie.description}
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("player")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-black px-5 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              ▶ Play
            </button>
          </div>
        </div>
      </section>

      {/* ========== VIDEO PLAYER ========== */}
      <section id="player" className="relative w-full h-screen">
        {/* NAV OVERLAY */}
        <nav className="fixed top-0 left-0 w-full p-4 z-20 flex items-center gap-6 bg-gradient-to-b from-black/80 to-transparent">
          <ArrowLeft
            onClick={() => router.back()}
            className="text-white cursor-pointer w-8 h-8 hover:text-gray-300"
          />
          <span className="text-white font-bold text-xl">
            Watching: {movie.title}
          </span>
        </nav>

        <iframe
          src={videoSrc}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      </section>

      {/* ========== MOVIE ROWS ========== */}
      <section className="px-6 md:px-16 py-16 space-y-10">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              {cat}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies
                .filter((m) => m.category === cat && m.id !== movie.id)
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => router.push(`/movies/${m.id}`)}
                    className="cursor-pointer group"
                  >
                    <img
                      src={m.poster_url}
                      className="rounded-md w-full aspect-[2/3] object-cover group-hover:scale-105 transition"
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
