"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface FavoriteMovie {
  id: number;
  title: string;
  poster_url: string;
}

interface MyListContextType {
  favorites: FavoriteMovie[];
  toggleFavorite: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

const MyListContext = createContext<MyListContextType | null>(null);

export function MyListProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // ambil user login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // load my list dari database
  useEffect(() => {
    if (!userId) return;

    const loadMyList = async () => {
      const { data } = await supabase
        .from("my_list")
        .select(`
          movie:movies (
            id,
            title,
            poster_url
          )
        `)
        .eq("user_id", userId);

      if (data) {
        setFavorites(data.map((item: any) => item.movie));
      }
    };

    loadMyList();
  }, [userId]);

  // add / remove
  const toggleFavorite = async (movieId: number) => {
    if (!userId) return;

    const exists = favorites.some((m) => m.id === movieId);

    if (exists) {
      await supabase
        .from("my_list")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId);

      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
    } else {
      await supabase.from("my_list").insert({
        user_id: userId,
        movie_id: movieId,
      });

      const { data } = await supabase
        .from("movies")
        .select("id, title, poster_url")
        .eq("id", movieId)
        .single();

      if (data) setFavorites((prev) => [...prev, data]);
    }
  };

  const isFavorite = (movieId: number) =>
    favorites.some((m) => m.id === movieId);

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
