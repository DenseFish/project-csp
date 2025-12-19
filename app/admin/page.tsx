"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MovieAdminCard from "../components/MovieAdminCard";
import ConfirmModal from "../components/ConfirmModal";

type Movie = {
  id: number;
  title: string;
  poster_url: string;
};

export default function AdminPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  // FETCH MOVIES
  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/admin/movies");
      const data = await res.json();
      setMovies(data);
    } catch {
      console.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // DELETE MOVIE
  const confirmDelete = async () => {
    if (!deleteId) return;

    const res = await fetch(`/api/admin/movies?id=${deleteId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete movie");
      return;
    }

    setDeleteId(null);
    fetchMovies();
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <Link
          href="/admin/create"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
        >
          Add Movie
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieAdminCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster_url}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        open={deleteId !== null}
        title="Delete Movie"
        description="Are you sure you want to delete this movie? This action cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
