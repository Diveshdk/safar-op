import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, location, description, priceRange, amenities, rating, imageUrl } = await request.json()

    if (!name || !location || !description || !priceRange) {
      return NextResponse.json({ error: "Name, location, description, and price range are required" }, { status: 400 })
    }

    console.log("Adding hotel:", { name, location, description, priceRange, amenities, rating, imageUrl })

    const { data, error } = await supabase
      .from("hotels")
      .insert([
        {
          name,
          location,
          description,
          price_range: priceRange,
          amenities: amenities || [],
          rating: rating || 0,
          image_url: imageUrl || null,
          added_by: userId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to add hotel", details: error.message }, { status: 500 })
    }

    console.log("Hotel added successfully:", data)
    return NextResponse.json({ success: true, hotel: data[0] })
  } catch (error) {
    console.error("Error adding hotel:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
