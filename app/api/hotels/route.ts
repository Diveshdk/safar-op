import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json()

    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 })
    }

    // Try to get hotels from database first
    const { data: hotels, error } = await supabase.from("hotels").select("*").eq("city", city).limit(10)

    if (error) {
      console.error("Error fetching hotels:", error)
    }

    // If no hotels found in database, return demo data
    if (!hotels || hotels.length === 0) {
      const demoHotels = [
        {
          id: "demo1",
          name: "Sunset Paradise Resort",
          price: 5500,
          city: city,
          description: "Cozy rooms • Free breakfast • Near beach • Swimming pool",
          image_url: "/placeholder.svg?height=240&width=400",
        },
        {
          id: "demo2",
          name: "City Center Hotel",
          price: 8500,
          city: city,
          description: "Modern amenities • Business center • Gym • Restaurant",
          image_url: "/placeholder.svg?height=240&width=400",
        },
        {
          id: "demo3",
          name: "Heritage Palace",
          price: 12000,
          city: city,
          description: "Luxury suites • Spa services • Fine dining • Heritage architecture",
          image_url: "/placeholder.svg?height=240&width=400",
        },
      ]

      return NextResponse.json({ hotels: demoHotels })
    }

    return NextResponse.json({ hotels })
  } catch (error) {
    console.error("Error in hotels API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
