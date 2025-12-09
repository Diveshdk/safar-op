import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences } = await request.json()

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 0) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 })
    }

    const prompt = `Create a detailed ${days}-day trip plan for ${destination} from ${startDate} to ${endDate}. Budget: ${budget}. Travelers: ${travelers}. Preferences: ${preferences}. 

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON) with this exact structure:
{
  "tripOverview": {
    "destination": "${destination}",
    "duration": ${days},
    "startDate": "${startDate}",
    "endDate": "${endDate}",
    "summary": "Brief summary",
    "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
    "totalEstimatedCost": "₹50000",
    "bestTimeToVisit": "All year round"
  },
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Arrival",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "location": "Location",
          "duration": "2 hours",
          "cost": "₹500",
          "description": "Description",
          "tips": "Tips"
        }
      ],
      "meals": [
        {
          "type": "Lunch",
          "restaurant": "Restaurant",
          "location": "Location",
          "cost": "₹300",
          "speciality": "Specialty"
        }
      ],
      "accommodation": {
        "hotel": "Hotel name",
        "location": "Location",
        "checkIn": "3:00 PM",
        "cost": "₹2000/night"
      }
    }
  ],
  "accommodationDetails": [
    {
      "name": "Hotel",
      "type": "Hotel",
      "location": "Location",
      "pricePerNight": "₹2000",
      "totalNights": ${days - 1},
      "totalCost": "₹${(days - 1) * 2000}",
      "amenities": ["WiFi", "Breakfast"],
      "bookingTips": "Book in advance",
      "alternatives": ["Alt 1", "Alt 2"]
    }
  ],
  "transportation": {
    "toDestination": {
      "method": "Flight",
      "details": "Details",
      "cost": "₹5000",
      "duration": "3 hours",
      "bookingTips": "Book early"
    },
    "localTransport": [
      {
        "method": "Taxi",
        "cost": "₹500/day",
        "tips": "Tips"
      }
    ],
    "fromDestination": {
      "method": "Flight",
      "cost": "₹5000",
      "bookingTips": "Return booking"
    }
  },
  "budgetBreakdown": {
    "accommodation": "₹${(days - 1) * 2000}",
    "transportation": "₹10000",
    "food": "₹${days * 1500}",
    "activities": "₹${days * 1000}",
    "shopping": "₹${days * 500}",
    "miscellaneous": "₹${days * 300}",
    "total": "₹${(days - 1) * 2000 + 10000 + days * 1500 + days * 1000 + days * 500 + days * 300}",
    "dailyAverage": "₹3000",
    "budgetTips": ["Tip 1", "Tip 2"]
  },
  "packingList": {
    "clothing": ["Shoes", "Clothes"],
    "electronics": ["Phone", "Charger"],
    "documents": ["Passport", "Tickets"],
    "healthAndSafety": ["First aid", "Medicines"],
    "miscellaneous": ["Bottle", "Backpack"],
    "weatherSpecific": ["Sunscreen", "Umbrella"]
  },
  "importantTips": ["Tip 1", "Tip 2", "Tip 3"],
  "emergencyInfo": {
    "localEmergency": "100",
    "nearestHospital": "Hospital name",
    "embassy": "Embassy info",
    "importantContacts": ["Contact"],
    "safetyTips": ["Tip"]
  },
  "bookingChecklist": [
    {
      "item": "Book flights",
      "deadline": "6 weeks before",
      "priority": "High"
    }
  ]
}`

    console.log("[v0] Sending request to Gemini API for:", destination)

    const response = await fetch(
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
        }),
      },
    )

    console.log("[v0] API Status:", response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] API Error:", errorData)
      throw new Error(`Gemini API failed: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] API response received")

    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textContent) {
      throw new Error("No response from Gemini")
    }

    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON in response")
    }

    const tripPlan = JSON.parse(jsonMatch[0])
    console.log("[v0] Trip plan parsed successfully")

    return NextResponse.json(tripPlan)
  } catch (error) {
    console.error("[v0] Error:", error instanceof Error ? error.message : error)

    return NextResponse.json({
      tripOverview: {
        destination: "Destination",
        duration: 3,
        summary: "Trip plan loading...",
        highlights: ["Exploring", "Local culture", "Relaxation"],
        totalEstimatedCost: "₹15000",
        bestTimeToVisit: "Year round",
      },
      dailyItinerary: [
        {
          day: 1,
          title: "Arrival",
          activities: [
            {
              time: "09:00 AM",
              activity: "Arrive and settle in",
              location: "Hotel",
              duration: "2 hours",
              cost: "₹0",
              description: "Check in and relax",
              tips: "Rest after travel",
            },
          ],
        },
      ],
      accommodationDetails: [
        {
          name: "Hotel",
          type: "Hotel",
          pricePerNight: "₹2000",
          totalNights: 2,
          amenities: ["WiFi", "Breakfast"],
        },
      ],
      budgetBreakdown: {
        total: "₹15000",
        dailyAverage: "₹5000",
      },
    })
  }
}
