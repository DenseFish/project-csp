'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client'; 
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const Billboard = () => {
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      // Ambil semua film
      const { data: movies } = await supabase.from('movies').select('*');
      
      if (movies && movies.length > 0) {
        // Pilih 1 acak
        const randomIndex = Math.floor(Math.random() * movies.length);
        setMovie(movies[randomIndex]);
      }
    };

    fetchRandomMovie();
  }, []);

  // Jangan render apa-apa kalau data belum siap
  if (!movie) return null;

  return (
    <div className="relative h-[56.25vw]">
      {/* Background Poster */}
      <img 
        className="w-full h-[56.25vw] object-cover brightness-[60%]"
        src={movie.poster_url} 
        alt={movie.title}
      />

      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        {/* Judul Film */}
        <p className="text-white text-xl md:text-5xl h-full w-[50%] lg:text-6xl font-bold drop-shadow-xl">
          {movie.title}
        </p>
        
        {/* Deskripsi Singkat */}
        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {movie.description}
        </p>

        {/* Tombol Play & Info */}
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
          <Link 
            href={`/movies/${movie.id}`} // Link ke halaman player
            className="bg-white text-black rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition"
          >
            <PlayIcon className="w-4 md:w-7 text-black mr-1" />
            Play
          </Link>
          <button className="bg-white/30 text-white rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-white/20 transition">
            <InformationCircleIcon className="w-4 md:w-7 text-white mr-1" />
            More Info
          </button>
        </div>
      </div>
    </div>
  )
}

export default Billboard;