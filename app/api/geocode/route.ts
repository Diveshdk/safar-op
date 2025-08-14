import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { lat, lng } = await request.json()

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0]

      // Extract city from address components
      let city = ""
      for (const component of result.address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name
          break
        }
        if (component.types.includes("administrative_area_level_2")) {
          city = component.long_name
          break
        }
      }

      return NextResponse.json({
        success: true,
        location: {
          lat: Number.parseFloat(lat),
          lng: Number.parseFloat(lng),
          name: result.formatted_address,
          city: city || "Unknown City",
        },
      })
    } else {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error in geocode API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
