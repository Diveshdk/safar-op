import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { message, city, lat, lng, userId, userName, userAvatar } = await request.json()

    // Insert message into database
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          message: message,
          city: city,
          latitude: lat,
          longitude: lng,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ success: false, error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, message: data })
  } catch (error) {
    console.error("Send message error:", error)
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}
