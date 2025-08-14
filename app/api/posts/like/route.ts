import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { postId, userId } = await request.json()

    if (!postId || !userId) {
      return NextResponse.json({ error: "Post ID and User ID are required" }, { status: 400 })
    }

    // Check if user has already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing like:", checkError)
      return NextResponse.json({ error: "Failed to check like status" }, { status: 500 })
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
        return NextResponse.json({ error: "Failed to remove like" }, { status: 500 })
      }

      // Decrement likes count
      const { error: updateError } = await supabase
        .from("user_posts")
        .update({ likes: supabase.sql`likes - 1` })
        .eq("id", postId)

      if (updateError) {
        console.error("Error updating likes count:", updateError)
      }

      return NextResponse.json({ success: true, liked: false })
    } else {
      // Like: Add the like and increment counter
      const { error: insertError } = await supabase.from("post_likes").insert([{ post_id: postId, user_id: userId }])

      if (insertError) {
        console.error("Error adding like:", insertError)
        return NextResponse.json({ error: "Failed to add like" }, { status: 500 })
      }

      // Increment likes count
      const { error: updateError } = await supabase
        .from("user_posts")
        .update({ likes: supabase.sql`likes + 1` })
        .eq("id", postId)

      if (updateError) {
        console.error("Error updating likes count:", updateError)
      }

      return NextResponse.json({ success: true, liked: true })
    }
  } catch (error) {
    console.error("Error in like post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
