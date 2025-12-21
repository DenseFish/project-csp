'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Search as SearchIcon } from 'lucide-react'

interface Movie {
  id: string
  title: string
  poster_url: string
  tmdb_id?: string | null
  created_at: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  // 🔥 FILTER STATE
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest')
  const [onlyTmdb, setOnlyTmdb] = useState(false)

  useEffect(() => {
    const searchMovies = async () => {
  setLoading(true)

  let supabaseQuery = supabase
    .from('movies')
    .select('*')

  // 🔎 SEARCH
  if (query.trim().length > 0) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
  }

  // 🎬 FILTER TMDB
  if (onlyTmdb) {
    supabaseQuery = supabaseQuery.not('tmdb_id', 'is', null)
  }

  // 🔃 SORT
  switch (sort) {
    case 'newest':
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
      break
    case 'oldest':
      supabaseQuery = supabaseQuery.order('created_at', { ascending: true })
      break
    case 'az':
      supabaseQuery = supabaseQuery.order('title', { ascending: true })
      break
    case 'za':
      supabaseQuery = supabaseQuery.order('title', { ascending: false })
      break
  }

  const { data } = await supabaseQuery

  setMovies(data ?? [])
  setLoading(false)
}


    const timeoutId = setTimeout(searchMovies, 500)
    return () => clearTimeout(timeoutId)
  }, [query, sort, onlyTmdb])

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 bg-[#141414]">
      
      {/* 🔎 SEARCH */}
      <div className="w-full max-w-3xl mx-auto mb-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-white" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-[#222] text-white placeholder-gray-500 focus:outline-none focus:bg-[#333] focus:ring-1 focus:ring-white text-xl"
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* 🎛 FILTER BAR (Netflix-style simple) */}
      <div className="flex flex-wrap items-center gap-4 max-w-3xl mx-auto mb-10">
        <select
          value={sort}
          onChange={(e) =>
  setSort(e.target.value as 'newest' | 'oldest' | 'az' | 'za')
}

          className="bg-[#222] text-white px-4 py-2 rounded-md focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A – Z</option>
          <option value="za">Z – A</option>
        </select>

        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyTmdb}
            onChange={() => setOnlyTmdb(!onlyTmdb)}
            className="accent-red-600"
          />
          Official (TMDB)
        </label>
      </div>

      {/* RESULT INFO */}
      {query && !loading && (
        <h2 className="text-gray-400 mb-6 text-lg">
          {movies.length > 0
            ? `Results for "${query}"`
            : `No results found for "${query}"`}
        </h2>
      )}

      {loading && (
        <p className="text-gray-400 text-center mb-6">
          Searching movies...
        </p>
      )}

      {/* 🎬 MOVIE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="group relative transition-transform hover:scale-105 hover:z-10"
          >
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
