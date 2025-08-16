import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

    if (!city) {
      console.log("Hotels API: No city provided")
      return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
    }

    // Query hotels from database
    const { data: hotels, error } = await supabase
      .from("hotels")
      .select("*")
      .ilike("city", `%${city}%`)
      .order("rating", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Hotels API: Database error:", error)
      // Continue with fallback data instead of returning error
    }

    console.log("Hotels API: Database query result:", hotels?.length || 0, "hotels found")

    // If no hotels found in database or error occurred, return demo data
    if (!hotels || hotels.length === 0) {
      console.log("Hotels API: No hotels found in database, returning demo data")

      const demoHotels = [
        {
          id: 1,
          name: "Grand Palace Hotel",
          description: "Luxury hotel in the heart of the city with world-class amenities",
          city: city,
          address: `123 Main Street, ${city}`,
          price: 5000,
          image_url: "/placeholder.svg?height=240&width=400",
          amenities: ["WiFi", "Pool", "Gym", "Restaurant", "Spa"],
          rating: 4.5,
          total_rooms: 100,
          available_rooms: 25,
        },
        {
          id: 2,
          name: "Comfort Inn",
          description: "Affordable and comfortable stay with modern facilities",
          city: city,
          address: `456 Park Avenue, ${city}`,
          price: 2500,
          image_url: "/placeholder.svg?height=240&width=400",
          amenities: ["WiFi", "Breakfast", "Parking"],
          rating: 4.0,
          total_rooms: 50,
          available_rooms: 15,
        },
        {
          id: 3,
          name: "Business Hotel",
          description: "Perfect for business travelers with meeting rooms and conference facilities",
          city: city,
          address: `789 Business District, ${city}`,
          price: 3500,
          image_url: "/placeholder.svg?height=240&width=400",
          amenities: ["WiFi", "Business Center", "Meeting Rooms", "Restaurant"],
          rating: 4.2,
          total_rooms: 75,
          available_rooms: 20,
        },
      ]

      return NextResponse.json({
        success: true,
        hotels: demoHotels,
        message: "Demo hotels data (database empty or error)",
      })
    }

    console.log("Hotels API: Returning database hotels")
    return NextResponse.json({
      success: true,
      hotels,
      message: "Hotels loaded successfully",
    })
  } catch (error) {
    console.error("Hotels API: Unexpected error:", error)

    // Return demo data as fallback
    const demoHotels = [
      {
        id: 1,
        name: "Grand Palace Hotel",
        description: "Luxury hotel in the heart of the city",
        city: "Demo City",
        price: 5000,
        image_url: "/placeholder.svg?height=240&width=400",
        amenities: ["WiFi", "Pool", "Gym"],
        rating: 4.5,
        total_rooms: 100,
        available_rooms: 25,
      },
    ]

    return NextResponse.json({
      success: true,
      hotels: demoHotels,
      message: "Fallback demo data due to server error",
    })
  }
}
