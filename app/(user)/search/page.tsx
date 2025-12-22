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
  const [role, setRole] = useState<'admin' | 'user' | null>(null)
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest')

  // Ambil role user
  useEffect(() => {
    const getUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const userRole = user.user_metadata?.role as 'admin' | 'user' | null
        setRole(userRole || 'user')
      }
    }
    getUserRole()
  }, [])

  // Fetch movies
  useEffect(() => {
    if (!role) return
    const fetchMovies = async () => {
      setLoading(true)
      try {
        let data: Movie[] = []

        if (role === 'admin') {
          const res = await fetch(`/api/admin/movies/search?query=${query}&sort=${sort}`)
          const json = await res.json()
          if (!res.ok) throw new Error(json.error || 'Failed to fetch')
          data = json
        } else {
          // User fetch biasa
          let supabaseQuery = supabase.from('movies').select('*')
          if (query.trim()) supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
          switch (sort) {
            case 'newest': supabaseQuery = supabaseQuery.order('created_at',{ascending:false}); break
            case 'oldest': supabaseQuery = supabaseQuery.order('created_at',{ascending:true}); break
            case 'az': supabaseQuery = supabaseQuery.order('title',{ascending:true}); break
            case 'za': supabaseQuery = supabaseQuery.order('title',{ascending:false}); break
          }
          const { data: supaData } = await supabaseQuery
          data = supaData ?? []
        }

        setMovies(data)
      } catch(err){
        console.error(err)
        setMovies([])
      }
      setLoading(false)
    }

    const timeoutId = setTimeout(fetchMovies, 500)
    return () => clearTimeout(timeoutId)
  }, [query, sort, role])

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 bg-[#141414]">
      {/* SEARCH */}
      <div className="w-full max-w-3xl mx-auto mb-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-white" />
          </div>
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-[#222] text-white placeholder-gray-500 focus:outline-none focus:bg-[#333] focus:ring-1 focus:ring-white text-xl"
            autoFocus
          />
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap items-center gap-4 max-w-3xl mx-auto mb-10">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'oldest' | 'az' | 'za')}
          className="bg-[#222] text-white px-4 py-2 rounded-md focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A – Z</option>
          <option value="za">Z – A</option>
        </select>
      </div>

      {/* MOVIE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={role === 'admin' ? `/admin/edit/${movie.id}` : `/movies/${movie.id}`}
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
