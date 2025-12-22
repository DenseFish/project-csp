"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export type FavoriteMovie = {
  id: number;
  title: string;
  poster_url: string;
};

type MyListContextType = {
  favorites: FavoriteMovie[];
  toggleFavorite: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
};

const MyListContext = createContext<MyListContextType | null>(null);

export function MyListProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (!userId) {
      setFavorites([]);
      return;
    }

    const loadMyList = async () => {
      const { data, error } = await supabase
        .from("my_list")
        .select(
          `
          movie:movies (
            id,
            title,
            poster_url
          )
        `
        )
        .eq("user_id", userId);

      if (!error && data) {
        setFavorites(data.map((row: any) => row.movie));
      }
    };

    loadMyList();
  }, [userId, mounted]);

  const toggleFavorite = async (movieId: number) => {
    if (!userId) return;

    const exists = favorites.some((m) => m.id === movieId);

    if (exists) {
      const confirmRemove = window.confirm(
        "Yakin ingin menghapus film ini dari My List?"
      );

      if (!confirmRemove) return;

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

      if (data) {
        setFavorites((prev) => [...prev, data]);
      }
    }
  };

  const isFavorite = (movieId: number) =>
    favorites.some((m) => m.id === movieId);

  if (!mounted) return null;

  return (
    <MyListContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
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