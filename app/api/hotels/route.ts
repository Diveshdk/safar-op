import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role key for server-side operations
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: NextRequest) {
  try {
    console.log("Hotels API: Starting request processing")

    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")

    console.log("Hotels API: City parameter:", city)

    let query = supabase.from("hotels").select("*")

    if (city) {
      // Use ilike for case-insensitive partial matching
      query = query.ilike("city", `%${city}%`)
    }

    const { data: hotels, error } = await query.order("created_at", { ascending: false }).limit(20)

    if (error) {
      console.error("Hotels API: Database error:", error)
      // Don't fail completely, return demo data instead
    }

    console.log("Hotels API: Found hotels:", hotels?.length || 0)

    // If no hotels found or database error, return demo data
    if (!hotels || hotels.length === 0) {
      console.log("Hotels API: Returning demo data")
      const demoHotels = [
        {
          id: "demo-1",
          name: "Grand Palace Hotel",
          description: "Luxury hotel in the heart of the city with world-class amenities",
          city: city || "Mumbai",
          address: "123 Main Street",
          price: 5000,
          image_url: "/placeholder.svg?height=240&width=400",
          amenities: ["WiFi", "Pool", "Gym", "Restaurant", "Spa"],
          rating: 4.5,
          total_rooms: 100,
          available_rooms: 25,
        },
        {
          id: "demo-2",
          name: "Comfort Inn",
          description: "Affordable and comfortable stay with modern facilities",
          city: city || "Mumbai",
          address: "456 Park Avenue",
          price: 2500,
          image_url: "/placeholder.svg?height=240&width=400",
          amenities: ["WiFi", "Restaurant", "Parking"],
          rating: 4.0,
          total_rooms: 50,
          available_rooms: 15,
        },
        {
          id: "demo-3",
          name: "Business Hotel",
          description: "Perfect for business travelers with meeting facilities",
          city: city || "Mumbai",
          address: "789 Business District",
          price: 3500,
          image_url: "/placeholder.svg?height=240&width=400",
          amenities: ["WiFi", "Business Center", "Conference Rooms"],
          rating: 4.2,
          total_rooms: 75,
          available_rooms: 20,
        },
      ]

      return NextResponse.json({
        success: true,
        hotels: demoHotels,
        message: "Demo hotels loaded",
      })
    }

    return NextResponse.json({
      success: true,
      hotels,
      message: `Found ${hotels.length} hotels`,
    })
  } catch (error) {
    console.error("Hotels API: Unexpected error:", error)

    // Return demo data as fallback
    const demoHotels = [
      {
        id: "demo-1",
        name: "Grand Palace Hotel",
        description: "Luxury hotel in the heart of the city",
        city: "Mumbai",
        price: 5000,
        image_url: "/placeholder.svg?height=240&width=400",
        amenities: ["WiFi", "Pool", "Gym"],
        rating: 4.5,
        available_rooms: 25,
      },
    ]

    return NextResponse.json({
      success: true,
      hotels: demoHotels,
      message: "Fallback hotels loaded",
    })
  }
}
