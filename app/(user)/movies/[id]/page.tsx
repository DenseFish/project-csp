'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Movie = {
  id: number
  title: string
  description: string
  poster_url: string
  backdrop_url: string
  category: string
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [hero, setHero] = useState<Movie | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await supabase.from('movies').select('*')
      if (data) {
        setMovies(data)
        setHero(data[0]) // ambil 1 movie buat hero
      }
    }
    fetchMovies()
  }, [])

  if (!hero) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const categories = ['Trending', 'Top Rated', 'Action']

  return (
    <main className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-[70vh] md:min-h-[80vh]">
        <img
          src={hero.backdrop_url}
          alt={hero.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 flex items-end md:items-center min-h-[70vh] px-4 md:px-16 pb-10 md:pb-0">
          <div className="max-w-xl">
            <h1 className="text-2xl md:text-5xl font-bold mb-4">
              {hero.title}
            </h1>

            <p className="hidden md:block text-gray-200 mb-6 line-clamp-3">
              {hero.description}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/watch/${hero.id}`)}
                className="bg-white text-black px-5 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
              >
                ▶ Play
              </button>

              <button className="bg-gray-700/80 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition">
                ℹ Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MOVIE ROWS ================= */}
      <section className="px-4 md:px-16 space-y-10 pb-20">

        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              {cat}
            </h2>

            <div
              className="
                grid gap-4
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-6
              "
            >
              {movies
                .filter((m) => m.category === cat)
                .map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => router.push(`/watch/${movie.id}`)}
                    className="cursor-pointer group"
                  >
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="rounded-md w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <p className="mt-2 text-sm text-center md:hidden">
                      {movie.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}

      </section>
    </main>
  )
}
