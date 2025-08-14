import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, city, lat, lng, userId, userName, userAvatar } = await request.json()

    if (!message || !city || !userId || !userName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

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
          lat: lat,
          lng: lng,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting message:", error)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: data?.[0] })
  } catch (error) {
    console.error("Error in chat send API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
