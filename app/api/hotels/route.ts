import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")

    console.log("Hotels API called for city:", city)

    if (!city) {
      console.log("No city provided, returning demo data")
      return NextResponse.json(getDemoHotels())
    }

    // Query hotels from database
    const { data: hotels, error } = await supabase
      .from("hotels")
      .select("*")
      .ilike("city", `%${city}%`)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Database error:", error)
      console.log("Falling back to demo data")
      return NextResponse.json(getDemoHotels(city))
    }

    console.log(`Found ${hotels?.length || 0} hotels in database`)

    // If no hotels found in database, return demo data
    if (!hotels || hotels.length === 0) {
      console.log("No hotels found in database, returning demo data")
      return NextResponse.json(getDemoHotels(city))
    }

    // Transform database data to match expected format
    const transformedHotels = hotels.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      description: hotel.description,
      city: hotel.city,
      address: hotel.address,
      price: hotel.price,
      rooms: hotel.rooms,
      imageUrl: hotel.image_url,
      amenities: hotel.amenities,
      ownerId: hotel.owner_id,
      createdAt: hotel.created_at,
    }))

    console.log("Returning transformed hotels:", transformedHotels.length)
    return NextResponse.json(transformedHotels)
  } catch (error) {
    console.error("Hotels API error:", error)
    console.log("Error occurred, falling back to demo data")
    return NextResponse.json(getDemoHotels())
  }
}

function getDemoHotels(city?: string) {
  const cityName = city || "Your City"

  return [
    {
      id: "demo-1",
      name: `Grand ${cityName} Hotel`,
      description: `Luxury hotel in the heart of ${cityName} with world-class amenities and exceptional service.`,
      city: cityName,
      address: `123 Main Street, ${cityName}`,
      price: 8500,
      rooms: 50,
      imageUrl: "/placeholder.jpg",
      amenities: "WiFi, Pool, Spa, Restaurant, Gym, Room Service",
      ownerId: "demo",
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-2",
      name: `${cityName} Business Inn`,
      description: `Modern business hotel perfect for corporate travelers visiting ${cityName}.`,
      city: cityName,
      address: `456 Business District, ${cityName}`,
      price: 4500,
      rooms: 30,
      imageUrl: "/placeholder.jpg",
      amenities: "WiFi, Business Center, Conference Rooms, Restaurant",
      ownerId: "demo",
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-3",
      name: `Budget Stay ${cityName}`,
      description: `Affordable and comfortable accommodation for budget-conscious travelers in ${cityName}.`,
      city: cityName,
      address: `789 Budget Lane, ${cityName}`,
      price: 2200,
      rooms: 25,
      imageUrl: "/placeholder.jpg",
      amenities: "WiFi, AC, TV, 24/7 Reception",
      ownerId: "demo",
      createdAt: new Date().toISOString(),
    },
  ]
}
