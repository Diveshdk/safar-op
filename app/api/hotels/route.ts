import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")

    console.log("Fetching hotels for location:", location)

    let query = supabase.from("hotels").select("*").order("created_at", { ascending: false })

    if (location) {
      query = query.ilike("location", `%${location}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch hotels", details: error.message }, { status: 500 })
    }

    console.log("Hotels fetched successfully:", data?.length || 0, "hotels")
    return NextResponse.json({ hotels: data || [] })
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
