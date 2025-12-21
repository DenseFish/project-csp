"use client";

import { useEffect, useState } from "react";

type Movie = {
  id: string;
  title: string;
  poster: string;
};

export function useMyList() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites(JSON.parse(saved));
    }

  }, []);

  const toggleFavorite = (movie: Movie) => {
  const stored = localStorage.getItem("favorites");
  const current: Movie[] = stored ? JSON.parse(stored) : [];

  const exists = current.find(m => m.id === movie.id);
  const updated = exists
    ? current.filter(m => m.id !== movie.id)
    : [...current, movie];

  localStorage.setItem("favorites", JSON.stringify(updated));
  setFavorites(updated);
};

  const isFavorite = (id: string) =>
    favorites.some(m => m.id === id);

  return { favorites, toggleFavorite, isFavorite };
}
