import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { title, content, city, lat, lng, userId, userName, userAvatar, imageUrl } = await request.json()

    // Insert post into database
    const { data, error } = await supabase
      .from("user_posts")
      .insert([
        {
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          title: title,
          content: content,
          city: city,
          latitude: lat,
          longitude: lng,
          image_url: imageUrl,
          likes: 0,
          comments: 0,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ success: false, error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, post: data })
  } catch (error) {
    console.error("Create post error:", error)
    return Response.json({ error: "Failed to create post" }, { status: 500 })
  }
}
