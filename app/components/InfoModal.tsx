"use client";

import React, { useEffect, useState } from "react";
import { X, Play, Plus, ThumbsUp, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import useInfoModal from "@/app/hooks/useInfoModal";
import { useRouter } from "next/navigation";
import { useMyList } from "@/app/context/MyListContext";

export default function InfoModal() {
  const { isOpen, closeModal, movieId } = useInfoModal();
  const [movie, setMovie] = useState<any>(null);
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useMyList();

  useEffect(() => {
    const fetchMovie = async () => {
      if (movieId) {
        const { data } = await supabase
          .from("movies")
          .select("*")
          .eq("id", movieId)
          .single();
        setMovie(data);
      }
    };
    if (isOpen) fetchMovie();
  }, [movieId, isOpen]);

  const handleClose = (e: any) => {
    if (e.target.id === "backdrop") closeModal();
  };

  if (!isOpen || !movie) return null;

  return (
    <div
      id="backdrop"
      onClick={handleClose}
      className="z-50 transition duration-300 bg-black/80 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none"
    >
      <div className="relative w-auto mx-auto max-w-3xl rounded-md overflow-hidden">
        <div
          className={`transform duration-300 relative flex-auto bg-[#181818] drop-shadow-md`}
        >
          {/* HEADER BACKGROUND VIDEO/IMAGE */}
          <div className="relative h-96">
            <video
              className="w-full brightness-[60%] object-cover h-full"
              autoPlay
              muted
              loop
              poster={movie.poster_url}
              src={movie.video_url}
            />

            <div
              onClick={closeModal}
              className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black/70 flex items-center justify-center text-white"
            >
              <X className="w-6" />
            </div>

            <div className="absolute bottom-[10%] left-10">
              <p className="text-white text-3xl md:text-4xl h-full lg:text-5xl font-bold mb-8">
                {movie.title}
              </p>
              <div className="flex gap-4 items-center">
                {/* TOMBOL PLAY: Ini yang akan membawa ke Fullscreen Player */}
                <button
                  onClick={() => router.push(`/movies/${movie.id}`)}
                  className="bg-white text-black cursor-pointer w-auto px-6 py-2 rounded-md font-bold hover:bg-neutral-300 transition flex items-center gap-2"
                >
                  <Play className="fill-black w-4 md:w-5" />
                  Play
                </button>

                <div onClick={() => toggleFavorite(movie.id)}>
                  <Heart
                    className={
                      isFavorite(movie.id)
                        ? "text-pink-500 fill-pink-500"
                        : "text-white"
                    }
                  />
                </div>

                <button className="cursor-pointer border border-white/40 w-10 h-10 rounded-full flex justify-center items-center text-white hover:bg-neutral-800 transition">
                  <ThumbsUp className="w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* DETAIL DESCRIPTION */}
          <div className="px-12 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-green-400 font-semibold">98% Match</p>
                  <p className="text-white text-sm">
                    {new Date(movie.created_at).getFullYear()}
                  </p>
                  <p className="text-white text-[10px] border border-gray-400 px-1">
                    HD
                  </p>
                </div>
                <p className="text-white text-lg leading-7">
                  {movie.description}
                </p>
              </div>
              <div className="md:w-1/3 text-sm text-gray-400">
                <p className="mb-2">
                  <span className="text-gray-600">Cast:</span> Actor A, Actor B
                </p>
                <p className="mb-2">
                  <span className="text-gray-600">Genres:</span> Action, Sci-Fi
                </p>
                <p className="mb-2">
                  <span className="text-gray-600">Original language:</span>{" "}
                  English
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
