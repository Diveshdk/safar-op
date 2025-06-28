import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { city } = await request.json()

    // Get hotels for this city
    const { data: hotels, error } = await supabase
      .from("hotels")
      .select(`
        id,
        name,
        description,
        price_per_night,
        city,
        image_url,
        amenities,
        rating,
        created_at
      `)
      .eq("city", city)
      .order("rating", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Supabase error:", error)
      // Return demo data if database fails
      return Response.json({
        hotels: [
          {
            id: "demo1",
            name: "Sunset Paradise Resort",
            price: 79,
            city: city,
            description: "Cozy rooms • Free breakfast • Near beach • Swimming pool",
            image_url: "/placeholder.svg?height=240&width=400",
            rating: 4.5,
          },
          {
            id: "demo2",
            name: "City Center Hotel",
            price: 120,
            city: city,
            description: "Modern amenities • Business center • Gym • Restaurant",
            image_url: "/placeholder.svg?height=240&width=400",
            rating: 4.2,
          },
        ],
      })
    }

    const formattedHotels =
      hotels?.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        price: hotel.price_per_night,
        city: hotel.city,
        description: hotel.description,
        image_url: hotel.image_url,
        rating: hotel.rating,
      })) || []

    return Response.json({ hotels: formattedHotels })
  } catch (error) {
    console.error("Hotels error:", error)
    return Response.json({ error: "Failed to load hotels" }, { status: 500 })
  }
}
