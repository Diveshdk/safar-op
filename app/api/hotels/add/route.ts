import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    console.log("Add Hotel API: Starting request processing")

    const { userId } = await auth()
    if (!userId) {
      console.log("Add Hotel API: User not authenticated")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Add Hotel API: Request body:", body)

    const {
      name,
      description,
      city,
      address,
      latitude,
      longitude,
      price_per_night,
      image_url,
      amenities,
      total_rooms,
    } = body

    if (!name || !description || !city || !price_per_night) {
      console.log("Add Hotel API: Missing required fields")
      return NextResponse.json({ error: "Name, description, city, and price per night are required" }, { status: 400 })
    }

    const hotelData = {
      owner_id: userId,
      name: name.trim(),
      description: description.trim(),
      city: city.trim(),
      address: address?.trim() || null,
      latitude: latitude || null,
      longitude: longitude || null,
      price: Number.parseInt(price_per_night),
      image_url: image_url?.trim() || "/placeholder.svg?height=240&width=400",
      amenities: Array.isArray(amenities) ? amenities : [],
      rating: 4.0,
      total_rooms: Number.parseInt(total_rooms) || 1,
      available_rooms: Number.parseInt(total_rooms) || 1,
    }

    console.log("Add Hotel API: Prepared hotel data:", hotelData)

    const { data: hotel, error } = await supabase.from("hotels").insert([hotelData]).select().single()

    if (error) {
      console.error("Add Hotel API: Database error:", error)
      return NextResponse.json(
        {
          error: "Failed to add hotel",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("Add Hotel API: Hotel added successfully:", hotel.id)

    return NextResponse.json({
      success: true,
      message: "Hotel added successfully",
      hotel,
    })
  } catch (error) {
    console.error("Add Hotel API: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
