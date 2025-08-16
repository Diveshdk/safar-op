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
    const { title, content, city, lat, lng, userId, userName, userAvatar, imageUrl } = body

    console.log("Received post data:", { title, content, city, userId, userName })

    // Validate required fields
    if (!title || !content || !city || !userId || !userName) {
      console.error("Missing required fields:", {
        title: !!title,
        content: !!content,
        city: !!city,
        userId: !!userId,
        userName: !!userName,
      })
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Title, content, city, userId, and userName are required",
        },
        { status: 400 },
      )
    }

    // Prepare the post data
    const postData = {
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar || null,
      title: title.trim(),
      content: content.trim(),
      city: city.trim(),
      lat: lat || null,
      lng: lng || null,
      image_url: imageUrl?.trim() || null,
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
          hint: error.hint,
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
