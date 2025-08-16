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
    const body = await request.json()
    console.log("Received request body:", body)

    const { title, content, city, lat, lng, userId, userName, userAvatar, imageUrl } = body

    // Validate required fields
    if (!title || !content || !city || !userId || !userName) {
      console.error("Missing required fields:", { title, content, city, userId, userName })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Prepare data for insertion
    const postData = {
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar || null,
      title: title.trim(),
      content: content.trim(),
      city: city,
      lat: lat || null,
      lng: lng || null,
      image_url: imageUrl || null,
      likes: 0,
      comments: 0,
    }

    console.log("Inserting post data:", postData)

    // Insert the post into the database
    const { data, error } = await supabase.from("user_posts").insert([postData]).select().single()

    if (error) {
      console.error("Supabase error creating post:", error)
      return NextResponse.json(
        {
          error: "Failed to create post",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log("Post created successfully:", data)
    return NextResponse.json({ success: true, post: data })
  } catch (error) {
    console.error("Error in create post API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
