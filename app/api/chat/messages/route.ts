import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { city, lat, lng } = await request.json()

    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 })
    }

    // Get messages for the specific city
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("city", city)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error("Error in chat messages API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
