import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ user: null, error: "Not authenticated" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    return NextResponse.json({
      user,
      role: profile?.role ?? "user",
    })
  } catch (error) {
    console.error("API /me error:", error)
    return NextResponse.json({ user: null, error: "Server error" }, { status: 500 })
  }
}
