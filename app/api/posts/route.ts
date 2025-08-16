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
    const { city, showAll, userId } = body

    console.log("Fetching posts with params:", { city, showAll, userId })

    // Build the query
    let query = supabase.from("user_posts").select("*").order("created_at", { ascending: false })

    // Filter by city if not showing all posts
    if (!showAll && city) {
      query = query.eq("city", city)
    }

    // Execute the query
    const { data: posts, error } = await query.limit(50)

    if (error) {
      console.error("Supabase error fetching posts:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch posts",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log(`Found ${posts?.length || 0} posts`)

    // If no posts found, return empty array
    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: true,
        posts: [],
      })
    }

    // Check which posts the user has liked
    let postsWithLikes = posts

    if (userId) {
      try {
        const postIds = posts.map((post) => post.id)
        const { data: likes, error: likesError } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", userId)
          .in("post_id", postIds)

        if (likesError) {
          console.error("Error fetching likes:", likesError)
          // Continue without like status if there's an error
          postsWithLikes = posts.map((post) => ({
            ...post,
            liked_by_user: false,
          }))
        } else {
          const likedPostIds = new Set(likes?.map((like) => like.post_id) || [])
          postsWithLikes = posts.map((post) => ({
            ...post,
            liked_by_user: likedPostIds.has(post.id),
          }))
        }
      } catch (likeError) {
        console.error("Error checking likes:", likeError)
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
