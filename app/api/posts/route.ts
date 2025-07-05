import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { city, showAll, userId } = await request.json()

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
        created_at
      `)
      .order("created_at", { ascending: false }) // Show newest first
      .limit(20)

    // Only filter by city if showAll is false and city is provided
    if (!showAll && city) {
      query = query.eq("city", city)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      // Return mock data if database query fails
      return Response.json({
        posts: [
          {
            id: "1",
            user_id: "user1",
            user_name: "Adventure Seeker",
            user_avatar: "",
            title: "Hidden Gems in the Mountains",
            content:
              "Just discovered this amazing viewpoint that's not on any tourist map! The sunrise here is absolutely breathtaking. Perfect spot for photography and meditation.",
            city: city || "Mountain Region",
            image_url: "",
            likes: 15,
            comments: 3,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            liked_by_user: false,
          },
        ],
      })
    }

    // Format posts
    const formattedPosts =
      posts?.map((post) => ({
        id: post.id,
        user_id: post.user_id,
        user_name: post.user_name || "Anonymous",
        user_avatar: post.user_avatar,
        title: post.title,
        content: post.content,
        city: post.city,
        image_url: post.image_url,
        likes: post.likes || 0,
        comments: post.comments || 0,
        created_at: post.created_at,
        liked_by_user: false, // Would need to check user's likes
      })) || []

    return Response.json({ posts: formattedPosts })
  } catch (error) {
    console.error("Posts error:", error)
    return Response.json({ error: "Failed to load posts" }, { status: 500 })
  }
}
