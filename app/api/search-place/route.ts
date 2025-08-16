import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, currentLocation } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Enhanced Gemini prompt for place exploration
    const prompt = `You are an expert travel guide. Provide comprehensive information about "${query}" as a travel destination.

Create detailed travel information in JSON format with these sections:

{
  "destination": {
    "name": "${query}",
    "description": "Detailed description of the place",
    "highlights": ["Top attraction 1", "Top attraction 2", "Top attraction 3"],
    "bestTimeToVisit": "Best months to visit with weather info",
    "duration": "Recommended stay duration",
    "difficulty": "Easy/Moderate/Challenging",
    "category": "Beach/Mountain/City/Heritage/Adventure"
  },
  "attractions": [
    {
      "name": "Specific attraction name",
      "description": "Detailed description",
      "location": "Exact location/address",
      "entryFee": "₹XXX or Free",
      "timings": "Opening hours",
      "bestTimeToVisit": "Best time of day",
      "tips": "Practical tips for visiting"
    }
  ],
  "accommodation": [
    {
      "name": "Specific hotel/resort name",
      "type": "Hotel/Resort/Hostel/Homestay",
      "location": "Area/address",
      "priceRange": "₹XXX - ₹XXX per night",
      "amenities": ["WiFi", "Pool", "Restaurant"],
      "rating": "4.5/5",
      "bookingTips": "When and how to book"
    }
  ],
  "food": [
    {
      "dish": "Local specialty dish name",
      "description": "What it is and taste",
      "restaurant": "Specific restaurant name",
      "location": "Restaurant location",
      "price": "₹XXX",
      "tips": "When to eat, how to order"
    }
  ],
  "transportation": {
    "howToReach": {
      "byAir": "Nearest airport and flight info",
      "byTrain": "Nearest railway station and train info",
      "byRoad": "Bus/car routes and distances",
      "cost": "₹XXX - ₹XXX"
    },
    "localTransport": [
      {
        "method": "Auto/Bus/Taxi/Walking",
        "cost": "₹XXX per day",
        "tips": "How to use, where to find"
      }
    ]
  },
  "activities": [
    {
      "name": "Specific activity name",
      "description": "What you'll do",
      "duration": "X hours",
      "cost": "₹XXX",
      "difficulty": "Easy/Moderate/Hard",
      "bestTime": "Morning/Afternoon/Evening",
      "tips": "What to bring, how to prepare"
    }
  ],
  "budget": {
    "budget": "₹XXX - ₹XXX per day",
    "midRange": "₹XXX - ₹XXX per day",
    "luxury": "₹XXX - ₹XXX per day",
    "breakdown": {
      "accommodation": "₹XXX",
      "food": "₹XXX",
      "transport": "₹XXX",
      "activities": "₹XXX"
    }
  },
  "packingList": {
    "essentials": ["Item 1", "Item 2"],
    "clothing": ["Weather appropriate items"],
    "gear": ["Activity specific gear"],
    "documents": ["Required documents"]
  },
  "tips": [
    "Local custom tip",
    "Money/bargaining tip",
    "Safety tip",
    "Cultural etiquette tip",
    "Photography tip"
  ],
  "weather": {
    "current": "Current season weather",
    "yearRound": "Weather throughout the year",
    "whatToPack": "Weather-specific packing advice"
  },
  "safety": {
    "general": ["General safety tip 1", "General safety tip 2"],
    "emergency": "Emergency contact numbers",
    "health": "Health precautions if any"
  }
}`

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      },
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    let placeInfo

    try {
      // Extract JSON from Gemini response
      const responseText = geminiData.candidates[0].content.parts[0].text
      console.log("Gemini place search response:", responseText)

      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        placeInfo = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      // Fallback place info
      placeInfo = {
        destination: {
          name: query,
          description: `${query} is a beautiful destination with rich culture and stunning attractions.`,
          highlights: ["Local attractions", "Cultural experiences", "Natural beauty"],
          bestTimeToVisit: "October to March",
          duration: "2-3 days",
          difficulty: "Easy",
          category: "General",
        },
        attractions: [
          {
            name: `Main attraction in ${query}`,
            description: "A must-visit landmark with historical significance",
            location: `${query} city center`,
            entryFee: "₹50",
            timings: "9:00 AM - 6:00 PM",
            bestTimeToVisit: "Morning hours",
            tips: "Visit early to avoid crowds",
          },
        ],
        accommodation: [
          {
            name: `Hotel in ${query}`,
            type: "Hotel",
            location: `${query} main area`,
            priceRange: "₹2,000 - ₹5,000 per night",
            amenities: ["WiFi", "Restaurant", "AC"],
            rating: "4.0/5",
            bookingTips: "Book in advance during peak season",
          },
        ],
        food: [
          {
            dish: "Local specialty",
            description: "Traditional dish with authentic flavors",
            restaurant: `Popular restaurant in ${query}`,
            location: `${query} market area`,
            price: "₹200",
            tips: "Try during lunch hours",
          },
        ],
        transportation: {
          howToReach: {
            byAir: `Nearest airport to ${query}`,
            byTrain: `Railway connectivity to ${query}`,
            byRoad: `Bus and car routes to ${query}`,
            cost: "₹500 - ₹2,000",
          },
          localTransport: [
            {
              method: "Auto rickshaw",
              cost: "₹100 per day",
              tips: "Negotiate fare beforehand",
            },
          ],
        },
        activities: [
          {
            name: "Sightseeing",
            description: "Explore the main attractions",
            duration: "4 hours",
            cost: "₹300",
            difficulty: "Easy",
            bestTime: "Morning",
            tips: "Carry water and comfortable shoes",
          },
        ],
        budget: {
          budget: "₹1,500 - ₹2,500 per day",
          midRange: "₹3,000 - ₹5,000 per day",
          luxury: "₹8,000 - ₹15,000 per day",
          breakdown: {
            accommodation: "₹2,000",
            food: "₹800",
            transport: "₹500",
            activities: "₹700",
          },
        },
        packingList: {
          essentials: ["Comfortable shoes", "Water bottle", "Sunscreen"],
          clothing: ["Light cotton clothes", "Hat", "Sunglasses"],
          gear: ["Camera", "Power bank"],
          documents: ["ID proof", "Travel tickets"],
        },
        tips: [
          "Learn basic local phrases",
          "Carry cash for small vendors",
          "Respect local customs",
          "Stay hydrated",
          "Keep emergency contacts handy",
        ],
        weather: {
          current: "Pleasant weather for travel",
          yearRound: "Varies by season",
          whatToPack: "Light clothes and rain protection",
        },
        safety: {
          general: ["Stay in groups", "Keep valuables safe"],
          emergency: "Local emergency: 100, 101, 102",
          health: "Carry basic first aid",
        },
      }
    }

    return NextResponse.json(placeInfo)
  } catch (error) {
    console.error("Place search error:", error)
    return NextResponse.json(
      {
        error: "Failed to search place. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
