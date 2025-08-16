import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role key for server-side operations
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    console.log("Hotels API: Starting request processing")

    const body = await request.json()
    console.log("Hotels API: Request body:", body)

    const { city } = body

    if (!city) {
      console.log("Hotels API: Missing city parameter")
      return NextResponse.json({ error: "City is required" }, { status: 400 })
    }

    console.log("Hotels API: Searching for hotels in city:", city)

    // Try to get hotels from database first
    const { data: hotels, error } = await supabase
      .from("hotels")
      .select("*")
      .ilike("city", `%${city}%`)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Hotels API: Database error:", error)
      // Continue to fallback data instead of returning error
    } else {
      console.log("Hotels API: Database query successful, found hotels:", hotels?.length || 0)
    }

    // If hotels found in database, return them
    if (hotels && hotels.length > 0) {
      console.log("Hotels API: Returning database hotels:", hotels.length)
      return NextResponse.json({ hotels })
    }

    // If no hotels found in database, return demo data
    console.log("Hotels API: No hotels found in database, returning demo data")

    const demoHotels = [
      {
        id: "demo1",
        name: "Sunset Paradise Resort",
        price: 5500,
        city: city,
        description: "Cozy rooms • Free breakfast • Near beach • Swimming pool",
        image_url: "/placeholder.svg?height=240&width=400",
        rating: 4.2,
        amenities: ["WiFi", "Pool", "Breakfast", "Beach Access"],
      },
      {
        id: "demo2",
        name: "City Center Hotel",
        price: 8500,
        city: city,
        description: "Modern amenities • Business center • Gym • Restaurant",
        image_url: "/placeholder.svg?height=240&width=400",
        rating: 4.5,
        amenities: ["WiFi", "Gym", "Restaurant", "Business Center"],
      },
      {
        id: "demo3",
        name: "Heritage Palace",
        price: 12000,
        city: city,
        description: "Luxury suites • Spa services • Fine dining • Heritage architecture",
        image_url: "/placeholder.svg?height=240&width=400",
        rating: 4.8,
        amenities: ["WiFi", "Spa", "Fine Dining", "Heritage"],
      },
    ]

    console.log("Hotels API: Returning demo hotels:", demoHotels.length)
    return NextResponse.json({ hotels: demoHotels })
  } catch (error) {
    console.error("Hotels API: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
