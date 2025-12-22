"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useMyList } from "@/app/context/MyListContext";

export default function MyListPage() {
  const { favorites, toggleFavorite } = useMyList();

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 bg-[#141414] text-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My List</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">
          You haven’t added any movies to your list yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <div key={movie.id} className="group relative">
              <Link href={`/movies/${movie.id}`}>
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="rounded-md aspect-[2/3] object-cover"
                />
              </Link>

              <button
                onClick={() => toggleFavorite(movie.id)}
                className="absolute top-2 right-2 bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              </button>

              <p className="mt-2 text-sm text-gray-400 truncate">
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
