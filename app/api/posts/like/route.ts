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
    const { postId, userId } = await request.json()

    console.log("Processing like for:", { postId, userId })

    if (!postId || !userId) {
      return NextResponse.json({ error: "Missing postId or userId" }, { status: 400 })
    }

    // Check if user has already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error
      console.error("Error checking existing like:", checkError)
      return NextResponse.json({ error: "Failed to check like status" }, { status: 500 })
    }

    let liked = false

    if (existingLike) {
      // Unlike the post
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId)

      if (deleteError) {
        console.error("Error removing like:", deleteError)
        return NextResponse.json({ error: "Failed to remove like" }, { status: 500 })
      }

      // Decrease like count
      const { error: updateError } = await supabase
        .from("user_posts")
        .update({ likes: supabase.raw("likes - 1") })
        .eq("id", postId)

      if (updateError) {
        console.error("Error updating like count:", updateError)
      }

      liked = false
    } else {
      // Like the post
      const { error: insertError } = await supabase.from("post_likes").insert([
        {
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString(),
        },
      ])

      if (insertError) {
        console.error("Error adding like:", insertError)
        return NextResponse.json({ error: "Failed to add like" }, { status: 500 })
      }

      // Increase like count
      const { error: updateError } = await supabase
        .from("user_posts")
        .update({ likes: supabase.raw("likes + 1") })
        .eq("id", postId)

      if (updateError) {
        console.error("Error updating like count:", updateError)
      }

      liked = true
    }

    console.log(`Post ${liked ? "liked" : "unliked"} successfully`)

    return NextResponse.json({
      success: true,
      liked: liked,
      message: liked ? "Post liked!" : "Like removed",
    })
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
