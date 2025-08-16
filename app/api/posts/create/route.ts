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
    const { title, content, city, latitude, longitude, imageUrl, userId, userName, userAvatar } = await request.json()

    console.log("Creating post:", { title, content, city, userId, userName })

    if (!title || !content || !city || !userId || !userName) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["title", "content", "city", "userId", "userName"],
        },
        { status: 400 },
      )
    }

    const postData = {
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar || null,
      title: title.trim(),
      content: content.trim(),
      city: city.trim(),
      latitude: latitude || null,
      longitude: longitude || null,
      image_url: imageUrl || null,
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Inserting post data:", postData)

    const { data, error } = await supabase.from("user_posts").insert([postData]).select().single()

    if (error) {
      console.error("Error creating post:", error)
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

    return NextResponse.json({
      success: true,
      post: data,
      message: "Post created successfully!",
    })
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
