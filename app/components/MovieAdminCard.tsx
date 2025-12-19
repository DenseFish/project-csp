"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  id: number;
  title: string;
  poster: string;
  onDelete: (id: number) => void;
};

export default function MovieAdminCard({ id, title, poster, onDelete }: Props) {
  return (
    <div className="relative group bg-black rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition">
      {/* POSTER */}
      <img src={poster} alt={title} className="w-full h-[260px] object-cover" />

      {/* ACTION ICONS */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <Link
          href={`/admin/edit/${id}`}
          className="bg-black/80 hover:bg-blue-600 p-2 rounded"
          title="Edit"
        >
          <Pencil size={16} />
        </Link>

        <button
          onClick={() => onDelete(id)}
          className="bg-black/80 hover:bg-red-600 p-2 rounded"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* TITLE */}
      <div className="p-3">
        <p className="text-sm font-medium truncate">{title}</p>
      </div>
    </div>
  );
}
