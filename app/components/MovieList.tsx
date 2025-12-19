"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import MovieCard from "@/app/components/MovieCard";
interface MovieListProps {
  title: string;
}

const MovieList: React.FC<MovieListProps> = ({ title }) => {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await supabase.from("movies").select("*");

      if (data) {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setMovies(shuffled.slice(0, 10));
      }
    };

    fetchMovies();
  }, []);

  if (movies.length === 0) return null;

  return (
    <div className="w-full mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
          {title}
        </p>

        {/* Container Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 ">
          {movies.map((movie) => (
            <MovieCard key={movie.id} data={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
