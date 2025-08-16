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
    console.log("Processing like request:", body)

    const { postId, userId } = body

    if (!postId || !userId) {
      return NextResponse.json({ error: "Post ID and User ID are required" }, { status: 400 })
    }

    // Check if user has already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing like:", checkError)
      return NextResponse.json(
        {
          error: "Failed to check like status",
          details: checkError.message,
        },
        { status: 500 },
      )
    }

    if (existingLike) {
      // Unlike: Remove the like and decrement counter
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId)

      if (deleteError) {
        console.error("Error removing like:", deleteError)
        return NextResponse.json(
          {
            error: "Failed to remove like",
            details: deleteError.message,
          },
          { status: 500 },
        )
      }

      // Get current post and decrement likes
      const { data: currentPost } = await supabase.from("user_posts").select("likes").eq("id", postId).single()

      if (currentPost) {
        const newLikes = Math.max(0, currentPost.likes - 1)
        await supabase.from("user_posts").update({ likes: newLikes }).eq("id", postId)
      }

      console.log("Post unliked successfully")
      return NextResponse.json({ success: true, liked: false })
    } else {
      // Like: Add the like and increment counter
      const { error: insertError } = await supabase.from("post_likes").insert([{ post_id: postId, user_id: userId }])

      if (insertError) {
        console.error("Error adding like:", insertError)
        return NextResponse.json(
          {
            error: "Failed to add like",
            details: insertError.message,
          },
          { status: 500 },
        )
      }

      // Get current post and increment likes
      const { data: currentPost } = await supabase.from("user_posts").select("likes").eq("id", postId).single()

      if (currentPost) {
        const newLikes = currentPost.likes + 1
        await supabase.from("user_posts").update({ likes: newLikes }).eq("id", postId)
      }

      console.log("Post liked successfully")
      return NextResponse.json({ success: true, liked: true })
    }
  } catch (error) {
    console.error("Error in like post API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
