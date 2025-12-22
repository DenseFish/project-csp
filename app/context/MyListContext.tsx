"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface FavoriteMovie {
  id: string;
  title: string;
  poster: string;
}

interface MyListContextType {
  favorites: FavoriteMovie[];
  toggleFavorite: (movie: FavoriteMovie) => void;
  isFavorite: (id: string) => boolean;
}

const MyListContext = createContext<MyListContextType | null>(null);

export function MyListProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // ambil user login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // reset saat user berubah
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites([]);
    setLoaded(false);
  }, [userId]);

  const storageKey = userId ? `favorites_${userId}` : "favorites_guest";

  // load sekali per user
  useEffect(() => {
    if (!userId || loaded) return;

    const stored = localStorage.getItem(storageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(stored ? JSON.parse(stored) : []);
    setLoaded(true);
  }, [userId, storageKey, loaded]);

  // simpan perubahan
  useEffect(() => {
    if (!userId || !loaded) return;
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, storageKey, userId, loaded]);

  const toggleFavorite = (movie: FavoriteMovie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      return exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((m) => m.id === id);
  };

  return (
    <MyListContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const ctx = useContext(MyListContext);
  if (!ctx) {
    throw new Error("useMyList must be used inside MyListProvider");
  }
  return ctx;
}
