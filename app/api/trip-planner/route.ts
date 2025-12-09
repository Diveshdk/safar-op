import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences } = await request.json()

    console.log("[v0] Trip planner request:", { destination, startDate, endDate, budget, travelers, preferences })

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = "AIzaSyCsMrFx1eVnk-8gT_WvmwiuiRLO8_IKWZs"

    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    console.log("[v0] Trip duration:", days, "days")

    if (days <= 0) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 })
    }

    const prompt = `You are an expert travel planner. Create a detailed, realistic ${days}-day trip itinerary for ${destination} from ${startDate} to ${endDate}.

Budget Category: ${budget}
Number of Travelers: ${travelers}
Travel Preferences: ${preferences}

IMPORTANT: Return ONLY valid JSON with NO markdown, NO code blocks, NO explanations - just raw JSON:

{
  "tripOverview": {
    "destination": "${destination}",
    "duration": ${days},
    "startDate": "${startDate}",
    "endDate": "${endDate}",
    "summary": "A brief compelling summary of the trip",
    "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
    "totalEstimatedCost": "Estimated total cost",
    "bestTimeToVisit": "Best season/months to visit"
  },
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Day title",
      "theme": "Daily theme",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "location": "Specific location",
          "duration": "2 hours",
          "cost": "Cost estimate",
          "description": "Detailed description",
          "tips": "Practical tips"
        }
      ],
      "meals": [
        {
          "type": "Breakfast/Lunch/Dinner",
          "restaurant": "Restaurant name",
          "location": "Location",
          "cost": "Cost",
          "speciality": "What makes it special",
          "must_try_dish": "Recommended dish"
        }
      ],
      "accommodation": {
        "hotel": "Hotel name",
        "location": "Location",
        "checkIn": "Time",
        "cost": "Cost per night"
      },
      "evening": "Evening activity/plan"
    }
  ],
  "accommodationDetails": [
    {
      "name": "Hotel name",
      "type": "Hotel type (5-star, 3-star, etc)",
      "location": "Area/neighborhood",
      "pricePerNight": "Price",
      "totalNights": ${days - 1},
      "totalCost": "Total",
      "amenities": ["WiFi", "Swimming pool", "Restaurant"],
      "bookingTips": "How to book",
      "why_recommended": "Why this hotel",
      "alternatives": ["Alternative 1", "Alternative 2"]
    }
  ],
  "transportation": {
    "toDestination": {
      "method": "Flight/Train/Bus/Car",
      "details": "Specific details",
      "cost": "Estimated cost",
      "duration": "Time taken",
      "bookingTips": "Booking advice"
    },
    "localTransport": [
      {
        "method": "Transport type",
        "costPerDay": "Daily cost",
        "bestFor": "When to use",
        "tips": "Tips"
      }
    ],
    "fromDestination": {
      "method": "Return method",
      "cost": "Cost",
      "bookingTips": "Return booking advice"
    }
  },
  "budgetBreakdown": {
    "accommodation": "Accommodation cost",
    "transportation": "Transport cost",
    "food": "Food cost",
    "activities": "Activities cost",
    "shopping": "Shopping budget",
    "miscellaneous": "Other costs",
    "total": "Grand total",
    "dailyAverage": "Average per day",
    "budgetTips": ["Tip 1", "Tip 2", "Tip 3"]
  },
  "packingList": {
    "clothing": ["Items"],
    "electronics": ["Items"],
    "documents": ["Items"],
    "healthAndSafety": ["Items"],
    "miscellaneous": ["Items"],
    "weatherSpecific": ["Items based on season"]
  },
  "localInfo": {
    "bestLocalDishes": ["Dish 1", "Dish 2"],
    "localShoppingMarkets": ["Market 1", "Market 2"],
    "bestPhotoSpots": ["Spot 1", "Spot 2"],
    "localTraditions": "Important traditions to know",
    "tippingCustoms": "Tipping etiquette"
  },
  "importantTips": ["Tip 1", "Tip 2", "Tip 3"],
  "emergencyInfo": {
    "localEmergency": "Emergency number",
    "nearestHospital": "Hospital location",
    "policeStation": "Police location",
    "embassy": "Embassy info",
    "importantContacts": ["Contact 1", "Contact 2"],
    "safetyTips": ["Safety tip 1", "Safety tip 2"]
  },
  "bookingChecklist": [
    {
      "item": "Task name",
      "deadline": "When to do",
      "priority": "High/Medium/Low"
    }
  ]
}`

    console.log("[v0] Sending request to Gemini API...")

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
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
            maxOutputTokens: 8000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_UNSPECIFIED",
              threshold: "BLOCK_NONE",
            },
          ],
        }),
      },
    )

    console.log("[v0] Gemini response status:", geminiResponse.status)

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text()
      console.error("[v0] Gemini API error:", errorData)
      throw new Error(`Gemini API failed with status ${geminiResponse.status}: ${errorData}`)
    }

    const geminiData = await geminiResponse.json()
    console.log("[v0] Gemini response received")

    const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textContent) {
      console.error("[v0] No text content in Gemini response:", geminiData)
      throw new Error("No response text from Gemini")
    }

    console.log("[v0] Extracting JSON from response...")

    // Extract JSON - try multiple strategies
    let tripPlan = null

    // Strategy 1: Look for JSON object
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        tripPlan = JSON.parse(jsonMatch[0])
        console.log("[v0] Successfully parsed JSON from Gemini response")
      } catch (e) {
        console.error("[v0] Failed to parse JSON:", e)
      }
    }

    if (!tripPlan) {
      console.error("[v0] Could not extract valid JSON from response")
      throw new Error("Invalid JSON in Gemini response")
    }

    // Ensure meals array exists in all daily itineraries
    if (tripPlan.dailyItinerary) {
      tripPlan.dailyItinerary = tripPlan.dailyItinerary.map((day: any) => ({
        ...day,
        meals: day.meals || [
          {
            type: "Breakfast",
            restaurant: "Local cafe",
            location: day.title || "Local area",
            cost: "₹300",
            speciality: "Local breakfast",
          },
          {
            type: "Lunch",
            restaurant: "Local restaurant",
            location: day.title || "Local area",
            cost: "₹500",
            speciality: "Local cuisine",
          },
          {
            type: "Dinner",
            restaurant: "Local restaurant",
            location: day.title || "Local area",
            cost: "₹600",
            speciality: "Local specialties",
          },
        ],
      }))
    }

    console.log("[v0] Trip plan generated successfully")
    return NextResponse.json(tripPlan)
  } catch (error) {
    console.error("[v0] Trip planner error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate trip plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
