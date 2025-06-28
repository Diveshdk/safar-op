import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { city, lat, lng } = await request.json()

    // Get messages for this city only
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select(`
        id,
        user_id,
        user_name,
        user_avatar,
        message,
        city,
        created_at
      `)
      .eq("city", city)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ messages: [] })
    }

    return Response.json({ messages: messages || [] })
  } catch (error) {
    console.error("Chat messages error:", error)
    return Response.json({ error: "Failed to load messages" }, { status: 500 })
  }
}
