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
    const { postId, userId } = body

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
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing like:", checkError)
      return NextResponse.json({ error: "Failed to check like status", details: checkError.message }, { status: 500 })
    }

    let liked = false

    if (existingLike) {
      // Unlike the post - remove the like
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId)

      if (deleteError) {
        console.error("Error removing like:", deleteError)
        return NextResponse.json({ error: "Failed to remove like", details: deleteError.message }, { status: 500 })
      }

      // Get current likes count and decrease it
      const { data: currentPost, error: fetchError } = await supabase
        .from("user_posts")
        .select("likes")
        .eq("id", postId)
        .single()

      if (fetchError) {
        console.error("Error fetching current post:", fetchError)
      } else {
        const newLikesCount = Math.max(0, (currentPost.likes || 0) - 1)
        const { error: updateError } = await supabase
          .from("user_posts")
          .update({ likes: newLikesCount })
          .eq("id", postId)

        if (updateError) {
          console.error("Error updating like count:", updateError)
        }
      }

      liked = false
    } else {
      // Like the post - add the like
      const { error: insertError } = await supabase.from("post_likes").insert([
        {
          post_id: postId,
          user_id: userId,
        },
      ])

      if (insertError) {
        console.error("Error adding like:", insertError)
        return NextResponse.json({ error: "Failed to add like", details: insertError.message }, { status: 500 })
      }

      // Get current likes count and increase it
      const { data: currentPost, error: fetchError } = await supabase
        .from("user_posts")
        .select("likes")
        .eq("id", postId)
        .single()

      if (fetchError) {
        console.error("Error fetching current post:", fetchError)
      } else {
        const newLikesCount = (currentPost.likes || 0) + 1
        const { error: updateError } = await supabase
          .from("user_posts")
          .update({ likes: newLikesCount })
          .eq("id", postId)

        if (updateError) {
          console.error("Error updating like count:", updateError)
        }
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
