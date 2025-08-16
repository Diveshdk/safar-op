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
    const { message, city, lat, lng, userId, userName, userAvatar } = await request.json()

    if (!message || !city || !userId || !userName) {
      return NextResponse.json({ error: "Missing required fields: message, city, userId, userName" }, { status: 400 })
    }

    console.log("Sending message:", { message: message.substring(0, 50), city, userId, userName })

    // Insert the message into the database
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          message: message.trim(),
          city: city,
          latitude: lat,
          longitude: lng,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error inserting message:", error)
      return NextResponse.json({ error: "Failed to send message", details: error.message }, { status: 500 })
    }

    console.log("Message sent successfully:", data?.[0]?.id)
    return NextResponse.json({ success: true, message: data?.[0] })
  } catch (error) {
    console.error("Error in chat send API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
