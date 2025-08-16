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
    const { city, showAll, userId } = await request.json()

    console.log("Fetching posts with params:", { city, showAll, userId })

    let query = supabase.from("user_posts").select("*").order("created_at", { ascending: false }).limit(20)

    // Filter by city if not showing all posts
    if (!showAll && city) {
      query = query.eq("city", city)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error("Error fetching posts:", error)
      return NextResponse.json({ error: "Failed to fetch posts", details: error.message }, { status: 500 })
    }

    console.log(`Found ${posts?.length || 0} posts`)

    // Check which posts the user has liked
    if (userId && posts && posts.length > 0) {
      const postIds = posts.map((post) => post.id)
      const { data: likes, error: likesError } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds)

      if (!likesError && likes) {
        const likedPostIds = new Set(likes.map((like) => like.post_id))

        // Add liked_by_user field to each post
        const postsWithLikeStatus = posts.map((post) => ({
          ...post,
          liked_by_user: likedPostIds.has(post.id),
        }))

        return NextResponse.json({ posts: postsWithLikeStatus })
      } else if (likesError) {
        console.error("Error fetching likes:", likesError)
      }
    }

    // If no user ID or error checking likes, return posts without like status
    const postsWithLikeStatus =
      posts?.map((post) => ({
        ...post,
        liked_by_user: false,
      })) || []

    return NextResponse.json({ posts: postsWithLikeStatus })
  } catch (error) {
    console.error("Error in posts API:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
