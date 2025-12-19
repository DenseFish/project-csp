'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

export default function WatchPage() {
  const { id } = useParams()
  const router = useRouter()
  const [movie, setMovie] = useState<any>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      const { data } = await supabase.from('movies').select('*').eq('id', id).single()
      setMovie(data)
    }
    if (id) fetchMovie()
  }, [id])

  if (!movie) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>

  // Logika Video Source (Youtube vs Direct)
  const videoSrc = movie.video_url.includes('watch?v=') 
    ? movie.video_url.replace("watch?v=", "embed/") + "?autoplay=1&controls=0&rel=0" // Tambah autoplay
    : movie.video_url;

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      
      {/* Navigasi Balik (Overlay) */}
      <nav className="fixed w-full p-4 z-10 flex items-center gap-8 bg-gradient-to-b from-black/80 to-transparent">
        <ArrowLeft 
            onClick={() => router.back()} 
            className="text-white cursor-pointer hover:text-gray-300 w-8 h-8 transition" 
        />
        <span className="text-white font-bold text-xl md:text-2xl drop-shadow-md">
            Watching: {movie.title}
        </span>
      </nav>

      {/* FULLSCREEN PLAYER */}
      <iframe
        src={videoSrc}
        className="w-full h-full object-cover"
        allowFullScreen
        allow="autoplay; encrypted-media"
      ></iframe>
      
    </div>
  )
}