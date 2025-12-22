"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import MovieCard from "@/app/components/MovieCard";

type Movie = {
  id: number;
  title: string;
  poster_url: string;
  duration?: string;
  genre?: string;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await supabase
        .from("movies")
        .select("*");

      if (data) setMovies(data);
      setLoading(false);
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading movies...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-12 pt-24">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Movies
      </h1>

      {movies.length === 0 ? (
        <p className="text-gray-400">
          No movies available.
        </p>
      ) : (
        <div
          className="
            grid gap-5
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
          "
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              data={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
}
