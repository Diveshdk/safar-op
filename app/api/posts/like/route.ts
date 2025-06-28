import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { postId, userId } = await request.json()

    // Check if user already liked this post
    const { data: existingLike } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (existingLike) {
      // Unlike the post
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId)

      // Decrease like count
      await supabase.rpc("decrement_post_likes", { post_id: postId })
    } else {
      // Like the post
      await supabase.from("post_likes").insert([{ post_id: postId, user_id: userId }])

      // Increase like count
      await supabase.rpc("increment_post_likes", { post_id: postId })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Like post error:", error)
    return Response.json({ error: "Failed to like post" }, { status: 500 })
  }
}
