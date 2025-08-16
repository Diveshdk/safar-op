import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client with service role key for server-side operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { city, lat, lng } = await request.json()

    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 })
    }

    console.log("Fetching messages for city:", city)

    // Get messages for the specific city
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("city", city)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Supabase error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages", details: error.message }, { status: 500 })
    }

    console.log("Messages fetched successfully:", messages?.length || 0)
    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error("Error in chat messages API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
