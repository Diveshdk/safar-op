import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    console.log("Add hotel API called")

    // Get user authentication
    const { userId } = await auth()

    if (!userId) {
      console.log("User not authenticated")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("User authenticated:", userId)

    const body = await request.json()
    console.log("Request body:", body)

    const { name, description, city, address, price, rooms, imageUrl, amenities } = body

    // Validate required fields
    if (!name || !description || !city || !address || !price) {
      console.log("Missing required fields")
      return NextResponse.json(
        { error: "Missing required fields: name, description, city, address, price" },
        { status: 400 },
      )
    }

    // Prepare hotel data
    const hotelData = {
      name: name.trim(),
      description: description.trim(),
      city: city.trim(),
      address: address.trim(),
      price: Number(price),
      rooms: Number(rooms) || 10,
      image_url: imageUrl?.trim() || "/placeholder.jpg",
      amenities: amenities?.trim() || "WiFi, AC, TV",
      owner_id: userId,
      created_at: new Date().toISOString(),
    }

    console.log("Prepared hotel data:", hotelData)

    // Insert hotel into database
    const { data, error } = await supabase.from("hotels").insert([hotelData]).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to add hotel", details: error.message }, { status: 500 })
    }

    console.log("Hotel added successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Hotel added successfully",
      hotel: data,
    })
  } catch (error) {
    console.error("Add hotel error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
