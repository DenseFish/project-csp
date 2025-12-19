"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ConfirmModal from "../../components/ConfirmModal";

export default function CreateMoviePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePosterChange = (file: File | null) => {
    if (!file) return;
    setPoster(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!poster || !title) {
      alert("Title dan poster wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const ext = poster.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `movies/${fileName}`;

      await supabase.storage.from("posters").upload(filePath, poster, {
        contentType: poster.type,
      });

      const posterUrl = supabase.storage
        .from("posters")
        .getPublicUrl(filePath).data.publicUrl;

      const res = await fetch("/api/admin/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          video_url: videoUrl,
          poster_url: posterUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to add movie");

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Add Movie</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <input
            className="border p-2 w-full bg-transparent"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border p-2 w-full bg-transparent"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="border p-2 w-full bg-transparent"
            placeholder="YouTube embed URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePosterChange(e.target.files?.[0] || null)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <div>
          <p className="mb-2 font-medium">Poster Preview</p>
          {posterPreview ? (
            <img src={posterPreview} className="border rounded w-full" />
          ) : (
            <div className="border h-80 flex items-center justify-center text-gray-500">
              No poster
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS MODAL (ONLY CLOSE) */}
      <ConfirmModal
        open={showSuccess}
        title="Movie Added Successfully"
        description="The movie has been added to the catalog."
        confirmText="Close"
        cancelText=""               // ⬅️ HILANGKAN CANCEL
        onConfirm={() => router.push("/admin")}
        onCancel={() => router.push("/admin")}
      />
    </div>
  );
}
