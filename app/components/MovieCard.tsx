"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import useInfoModal from "@/app/hooks/useInfoModal";

interface MovieCardProps {
  data: Record<string, any>;
}

export default function MovieCard({ data }: MovieCardProps) {
  const router = useRouter();
  const { openModal } = useInfoModal();

  const handlePlay = () => {
    router.push(`/movies/${data.id}`);
  };

  return (
    <div className="group bg-zinc-900 col-span-1 relative h-[10vw]">
      
      {/* GAMBAR UTAMA (Posisi Awal) */}
      <img
        onClick={() => openModal(data?.id)}
        src={data.poster_url}
        alt="Movie Poster"
        draggable={false}
        className="
          cursor-pointer
          object-cover
          transition
          duration
          shadow-xl
          rounded-md
          group-hover:opacity-90
          sm:group-hover:opacity-0 
          delay-300
          w-full
          h-[10vw]
        "
      />

      {/* POP-UP CARD (Muncul saat Hover) */}
      <div
        className="
          opacity-0
          absolute
          top-0
          transition
          duration-200
          z-10
          invisible
          sm:visible
          delay-300
          w-full
          scale-0
          
          group-hover:scale-110
          group-hover:-translate-y-[6vw]
          group-hover:opacity-100
        "
      >

        {/* Gambar di dalam Pop-up */}
        <img
          onClick={handlePlay}
          src={data.poster_url}
          alt="Movie Poster"
          draggable={false}
          className="
            cursor-pointer
            object-cover
            transition
            duration
            shadow-xl
            rounded-t-md
            w-full
            h-[12vw]
          "
        />

        {/* Info Area (Hitam) */}
        <div className="
          z-10
          bg-zinc-800
          p-2
          lg:p-4
          absolute
          w-full
          transition
          shadow-md
          rounded-b-md
        ">
          
          {/* Baris Tombol Icon */}
          <div className="flex flex-row items-center gap-3">
            <div 
              onClick={handlePlay}
              className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300"
            >
              <Play className="text-black w-3 h-3 lg:w-6 lg:h-6 fill-black" />
            </div>
            <div className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center transition hover:border-white hover:bg-zinc-700">
              <Plus className="text-white w-3 h-3 lg:w-6 lg:h-6" />
            </div>
            <div className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center transition hover:border-white hover:bg-zinc-700">
              <ThumbsUp className="text-white w-3 h-3 lg:w-6 lg:h-6" />
            </div>
            <div 
              onClick={() => openModal(data?.id)}
              className="cursor-pointer ml-auto group/item w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center transition hover:border-white hover:bg-zinc-700">
              <ChevronDown className="text-white w-3 h-3 lg:w-6 lg:h-6" />
            </div>
          </div>

          {/* Metadata Baris 1 */}
          <div className="flex flex-row mt-4 gap-2 items-center"> 
            <p className="text-green-400 font-semibold text-[10px] lg:text-sm">
              98% Match
            </p>
            <div className="border border-gray-400 px-1 rounded text-[10px] lg:text-xs text-white">
              13+
            </div>
            <p className="text-white text-[10px] lg:text-sm">
              {data.duration}
            </p>
            <div className="border border-white/40 px-1 rounded text-[8px] lg:text-[10px] text-white">
              HD
            </div>
          </div>

          {/* Metadata Baris 2 (Genre) */}
          <div className="flex flex-row mt-4 gap-2 items-center">
            <p className="text-white text-[10px] lg:text-sm">
              {data.genre}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}