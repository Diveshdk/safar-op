import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, location } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
    }

    // Use Google Places API to search for places
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`

    // Add location bias if provided
    if (location && location.lat && location.lng) {
      url += `&location=${location.lat},${location.lng}&radius=50000`
    }

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === "OK") {
      const places = data.results.slice(0, 10).map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        types: place.types,
        location: place.geometry.location,
        photos: place.photos
          ? place.photos.slice(0, 1).map((photo: any) => ({
              url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`,
            }))
          : [],
        price_level: place.price_level,
        opening_hours: place.opening_hours,
      }))

      return NextResponse.json({ success: true, places })
    } else {
      return NextResponse.json({ error: "No places found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error in search place API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
