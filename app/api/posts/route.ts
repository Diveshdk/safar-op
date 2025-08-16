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

    let query = supabase
      .from("user_posts")
      .select(`
        id,
        user_id,
        user_name,
        user_avatar,
        title,
        content,
        city,
        image_url,
        likes,
        comments,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false })

    // Filter by city if not showing all posts
    if (!showAll && city) {
      query = query.eq("city", city)
    }

    const { data: posts, error } = await query.limit(50)

    if (error) {
      console.error("Supabase error fetching posts:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch posts",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Check if user has liked each post
    let postsWithLikes = posts || []

    if (userId && posts && posts.length > 0) {
      try {
        const postIds = posts.map((post) => post.id)
        const { data: likes } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", userId)
          .in("post_id", postIds)

        const likedPostIds = new Set(likes?.map((like) => like.post_id) || [])

        postsWithLikes = posts.map((post) => ({
          ...post,
          liked_by_user: likedPostIds.has(post.id),
        }))
      } catch (likeError) {
        console.error("Error checking likes:", likeError)
        // Continue without like status if there's an error
        postsWithLikes = posts.map((post) => ({
          ...post,
          liked_by_user: false,
        }))
      }
    } else {
      postsWithLikes = posts.map((post) => ({
        ...post,
        liked_by_user: false,
      }))
    }

    console.log(`Fetched ${postsWithLikes.length} posts`)

    return NextResponse.json({
      success: true,
      posts: postsWithLikes,
    })
  } catch (error) {
    console.error("Error in posts API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
