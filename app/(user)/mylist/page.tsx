"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useMyList } from "@/app/context/MyListContext";


export default function MyListPage() {
  const { favorites, toggleFavorite, isFavorite } = useMyList();

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 bg-[#141414] text-white font-['Netflix_Sans']">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My List</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">
          You haven’t added any movies to your list yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-y-8">
          {favorites.map((movie) => (
            <div key={movie.id} className="group relative">
              {/* Poster */}
              <Link href={`/movies/${movie.id}`}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                  />
                </div>
              </Link>

              {/* ICON HEART (UNLIST) */}
              <div
                onClick={() => {
                  const ok = confirm("Remove this movie from My List?");
                  if (ok) {
                    toggleFavorite({
                      id: String(movie.id),
                      title: movie.title,
                      poster: movie.poster,
                    });
                  }
                }}
                className="absolute top-2 right-2 cursor-pointer w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              </div>

              {/* Judul */}
              <p className="mt-2 text-sm text-gray-400 group-hover:text-white truncate transition">
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
