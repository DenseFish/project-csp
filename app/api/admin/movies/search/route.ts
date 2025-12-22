import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";

// Supabase ADMIN (CRUD)
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ROLE CHECK
async function verifyAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", status: 401 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Forbidden", status: 403 };

  return { user };
}

// 🔹 GET MOVIES SEARCH
export async function GET(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "";
  const sort = url.searchParams.get("sort") || "newest";

  let supabaseQuery = adminSupabase.from("movies").select("*");

  // SEARCH
  if (query.trim().length > 0) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
  }

  // SORT
  switch (sort) {
    case "newest":
      supabaseQuery = supabaseQuery.order("created_at", { ascending: false });
      break;
    case "oldest":
      supabaseQuery = supabaseQuery.order("created_at", { ascending: true });
      break;
    case "az":
      supabaseQuery = supabaseQuery.order("title", { ascending: true });
      break;
    case "za":
      supabaseQuery = supabaseQuery.order("title", { ascending: false });
      break;
  }

  const { data, error } = await supabaseQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
