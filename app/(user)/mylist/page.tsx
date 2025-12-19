'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function MyListPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulasi ambil data my list (sementara ambil 5 movie pertama)
    const fetchMyList = async () => {
      const { data } = await supabase.from('movies').select('*').limit(10)
      if (data) setMovies(data)
      setLoading(false)
    }
    fetchMyList()
  }, [])

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 bg-[#141414] text-white font-['Netflix_Sans']">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My List</h1>
      
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-y-8">
            {movies.length > 0 ? movies.map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`} className="group block">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                        <img 
                        src={movie.poster_url} 
                        alt={movie.title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-400 group-hover:text-white truncate transition">
                        {movie.title}
                    </p>
                </Link>
            )) : (
                <p className="text-gray-500 col-span-full">You haven't added any movies to your list yet.</p>
            )}
        </div>
      )}
    </div>
  )
}