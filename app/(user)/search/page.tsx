'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Search as SearchIcon } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchMovies = async () => {
      if (query.length === 0) {
          setMovies([])
          return
      }
      setLoading(true)
      const { data } = await supabase
        .from('movies')
        .select('*')
        .ilike('title', `%${query}%`) // Pencarian case-insensitive

      if (data) setMovies(data)
      setLoading(false)
    }

    const timeoutId = setTimeout(searchMovies, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 bg-[#141414]">
      {/* Search Input */}
      <div className="w-full max-w-3xl mx-auto mb-10">
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-white" />
            </div>
            <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-[#222] border-none text-white placeholder-gray-500 focus:outline-none focus:bg-[#333] focus:ring-1 focus:ring-white text-xl"
                placeholder="Search movies, TV shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
            />
        </div>
      </div>

      {/* Results */}
      {query && (
          <h2 className="text-gray-400 mb-6 text-lg">
            {movies.length > 0 ? `Results for "${query}"` : `No results found for "${query}"`}
          </h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
                    <img 
                    src={movie.poster_url} 
                    alt={movie.title}
                    className="w-full h-auto object-cover rounded-md"
                    />
                    <div className="mt-2 text-center text-sm font-medium text-gray-300 group-hover:text-white truncate">
                        {movie.title}
                    </div>
            </Link>
        ))}
      </div>
    </div>
  )
}