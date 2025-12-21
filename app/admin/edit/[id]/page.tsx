"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ConfirmModal from "../../../components/ConfirmModal";

type Movie = {
  id: number;
  title: string;
  description: string;
  video_url: string;
  poster_url: string;
};

export default function EditMoviePage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // 🔹 FETCH MOVIE DATA
  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`/api/admin/movies`);
      const data: Movie[] = await res.json();

      const found = data.find((m) => m.id === Number(movieId));
      if (!found) {
        alert("Movie not found");
        router.push("/admin");
        return;
      }

      setMovie(found);
      setTitle(found.title);
      setDescription(found.description);
      setVideoUrl(found.video_url);
      setPosterPreview(found.poster_url);
    };

    fetchMovie();
  }, [movieId, router]);

  // 🔹 HANDLE POSTER CHANGE
  const handlePosterChange = (file: File | null) => {
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  // 🔹 UPDATE MOVIE
  const handleUpdate = async () => {
    if (!movie) return;

    setLoading(true);

    let posterUrl = movie.poster_url;

    // 🔸 UPLOAD NEW POSTER IF EXISTS
    if (posterFile) {
      const ext = posterFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `movies/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("posters")
        .upload(filePath, posterFile, {
          contentType: posterFile.type,
        });

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      posterUrl = supabase.storage
        .from("posters")
        .getPublicUrl(filePath).data.publicUrl;
    }

    const res = await fetch(`/api/admin/movies?id=${movie.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        video_url: videoUrl,
        poster_url: posterUrl,
      }),
    });

    if (!res.ok) {
      alert("Failed to update movie");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccessOpen(true);
  };

  if (!movie) return null;

  return (
    <div className="p-10 mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT FORM */}
        <div className="md:col-span-2 space-y-4">
          <input
            className="border p-2 w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border p-2 w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="border p-2 w-full"
            placeholder="YouTube embed URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handlePosterChange(e.target.files?.[0] || null)
            }
          />

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* POSTER PREVIEW */}
        <div>
          <p className="mb-2 font-medium">Poster Preview</p>
          {posterPreview ? (
            <img
              src={posterPreview}
              className="border rounded w-full object-cover"
            />
          ) : (
            <div className="border h-80 flex items-center justify-center text-gray-500">
              No poster
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <ConfirmModal
        open={successOpen}
        title="Movie Updated Successfully"
        description="The movie information has been updated."
        confirmText="Close"
        onConfirm={() => router.push("/admin")}
      />
    </div>
  );
}
