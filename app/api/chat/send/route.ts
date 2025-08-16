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
    const { message, city, latitude, longitude, userId, userName, userAvatar } = await request.json()

    console.log("Sending message:", { message, city, userId, userName })

    if (!message || !city || !userId || !userName) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["message", "city", "userId", "userName"],
        },
        { status: 400 },
      )
    }

    const messageData = {
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar || null,
      message: message.trim(),
      city: city.trim(),
      latitude: latitude || null,
      longitude: longitude || null,
      created_at: new Date().toISOString(),
    }

    console.log("Inserting message data:", messageData)

    const { data, error } = await supabase.from("chat_messages").insert([messageData]).select().single()

    if (error) {
      console.error("Error sending message:", error)
      return NextResponse.json(
        {
          error: "Failed to send message",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log("Message sent successfully:", data)

    return NextResponse.json({
      success: true,
      message: data,
      response: "Message sent successfully!",
    })
  } catch (error) {
    console.error("Error in send message API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
