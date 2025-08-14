import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { title, content, city, lat, lng, userId, userName, userAvatar, imageUrl } = await request.json()

    if (!title || !content || !city || !userId || !userName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert the post into the database
    const { data, error } = await supabase
      .from("user_posts")
      .insert([
        {
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          title: title.trim(),
          content: content.trim(),
          city: city,
          lat: lat,
          lng: lng,
          image_url: imageUrl,
          likes: 0,
          comments: 0,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating post:", error)
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    return NextResponse.json({ success: true, post: data?.[0] })
  } catch (error) {
    console.error("Error in create post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
