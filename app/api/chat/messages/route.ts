import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json()

    console.log("Fetching messages for city:", city)

    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 })
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("city", city)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch messages",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log(`Found ${messages?.length || 0} messages for ${city}`)

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error("Error in messages API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
