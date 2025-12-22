import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movieId = Number(id);

  if (Number.isNaN(movieId)) {
    return NextResponse.json(
      { error: "Invalid movie id" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("movies")
    .delete()
    .eq("id", movieId);

  if (error) {
    console.error("DELETE error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
