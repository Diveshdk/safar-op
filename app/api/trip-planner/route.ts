import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences, currentLocation } = await request.json()

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: "Destination, start date, and end date are required" }, { status: 400 })
    }

    // Calculate trip duration
    const start = new Date(startDate)
    const end = new Date(endDate)
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (duration <= 0) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
    }

    // Enhanced Gemini prompt for detailed trip planning
    const prompt = `You are an expert travel planner. Create a detailed, day-by-day trip plan for "${destination}" from ${startDate} to ${endDate} (${duration} days).

Trip Details:
- Destination: ${destination}
- Duration: ${duration} days
- Budget: ${budget || "Moderate"}
- Number of travelers: ${travelers || 1}
- Preferences: ${preferences || "General sightseeing"}
${currentLocation ? `- Starting from: ${currentLocation.name}` : ""}

Create a comprehensive trip plan in JSON format with these sections:

1. **Trip Overview**: Summary, best highlights, total estimated cost
2. **Day-by-Day Itinerary**: Detailed daily plans with specific activities, timings, and locations
3. **Accommodation**: Specific hotel recommendations with booking details
4. **Transportation**: Detailed transport options and bookings needed
5. **Budget Breakdown**: Detailed cost analysis
6. **Packing List**: Weather-appropriate items to pack
7. **Important Tips**: Location-specific travel advice
8. **Emergency Info**: Important contacts and safety information

Format as valid JSON:
{
  "tripOverview": {
    "destination": "${destination}",
    "duration": ${duration},
    "startDate": "${startDate}",
    "endDate": "${endDate}",
    "summary": "Brief trip summary",
    "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
    "totalEstimatedCost": "₹X,XXX",
    "bestTimeToVisit": "Current season assessment"
  },
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Arrival & First Impressions",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "location": "Specific location with address",
          "duration": "2 hours",
          "cost": "₹XXX",
          "description": "Detailed description",
          "tips": "Specific tips for this activity"
        }
      ],
      "meals": [
        {
          "type": "Lunch",
          "restaurant": "Restaurant name",
          "location": "Address",
          "cost": "₹XXX",
          "speciality": "What to order"
        }
      ],
      "accommodation": {
        "hotel": "Hotel name",
        "location": "Address",
        "checkIn": "3:00 PM",
        "cost": "₹XXX/night"
      }
    }
  ],
  "accommodationDetails": [
    {
      "name": "Hotel name",
      "type": "Hotel/Hostel/Airbnb",
      "location": "Full address",
      "pricePerNight": "₹XXX",
      "totalNights": ${duration - 1},
      "totalCost": "₹XXX",
      "amenities": ["WiFi", "Breakfast", "Pool"],
      "bookingTips": "How and when to book",
      "alternatives": ["Alternative 1", "Alternative 2"]
    }
  ],
  "transportation": {
    "toDestination": {
      "method": "Flight/Train/Bus",
      "details": "Specific routes and booking info",
      "cost": "₹XXX",
      "duration": "X hours",
      "bookingTips": "When and how to book"
    },
    "localTransport": [
      {
        "method": "Metro/Bus/Taxi",
        "cost": "₹XXX/day",
        "tips": "How to use, where to buy tickets"
      }
    ],
    "fromDestination": {
      "method": "Return transport",
      "cost": "₹XXX",
      "bookingTips": "Return booking advice"
    }
  },
  "budgetBreakdown": {
    "accommodation": "₹XXX",
    "transportation": "₹XXX",
    "food": "₹XXX",
    "activities": "₹XXX",
    "shopping": "₹XXX",
    "miscellaneous": "₹XXX",
    "total": "₹X,XXX",
    "dailyAverage": "₹XXX",
    "budgetTips": ["Tip 1", "Tip 2", "Tip 3"]
  },
  "packingList": {
    "clothing": ["Item 1", "Item 2"],
    "electronics": ["Item 1", "Item 2"],
    "documents": ["Passport", "Tickets", "Insurance"],
    "healthAndSafety": ["First aid", "Medications"],
    "miscellaneous": ["Item 1", "Item 2"],
    "weatherSpecific": ["Weather-appropriate items"]
  },
  "importantTips": [
    "Local custom tip",
    "Money/payment tip",
    "Safety tip",
    "Cultural etiquette tip",
    "Best time for activities tip"
  ],
  "emergencyInfo": {
    "localEmergency": "Emergency number",
    "nearestHospital": "Hospital name and address",
    "embassy": "Embassy contact (if international)",
    "importantContacts": ["Contact 1", "Contact 2"],
    "safetyTips": ["Safety tip 1", "Safety tip 2"]
  },
  "bookingChecklist": [
    {
      "item": "Book flights",
      "deadline": "X weeks before",
      "priority": "High"
    },
    {
      "item": "Book accommodation",
      "deadline": "X weeks before",
      "priority": "High"
    }
  ]
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
    let tripPlan

    try {
      // Extract JSON from Gemini response
      const responseText = geminiData.candidates[0].content.parts[0].text
      console.log("Gemini trip plan response:", responseText)

      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        tripPlan = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      // Fallback trip plan
      tripPlan = {
        tripOverview: {
          destination: destination,
          duration: duration,
          startDate: startDate,
          endDate: endDate,
          summary: `A ${duration}-day adventure in ${destination} with carefully planned activities and experiences.`,
          highlights: ["Local cultural experiences", "Must-see attractions", "Authentic cuisine"],
          totalEstimatedCost:
            budget === "Budget"
              ? `₹${duration * 3000}`
              : budget === "Luxury"
                ? `₹${duration * 15000}`
                : `₹${duration * 7500}`,
          bestTimeToVisit: "Great time to visit with pleasant weather",
        },
        dailyItinerary: Array.from({ length: duration }, (_, i) => ({
          day: i + 1,
          date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          title:
            i === 0
              ? "Arrival & Exploration"
              : i === duration - 1
                ? "Final Day & Departure"
                : `Day ${i + 1} Adventures`,
          activities: [
            {
              time: "09:00 AM",
              activity: "Morning exploration",
              location: `${destination} city center`,
              duration: "3 hours",
              cost: "₹1500",
              description: "Explore the main attractions and get oriented with the city",
              tips: "Start early to avoid crowds",
            },
            {
              time: "02:00 PM",
              activity: "Afternoon cultural experience",
              location: `Local cultural site in ${destination}`,
              duration: "2 hours",
              cost: "₹900",
              description: "Immerse in local culture and traditions",
              tips: "Respect local customs and dress appropriately",
            },
          ],
          meals: [
            {
              type: "Lunch",
              restaurant: "Local favorite restaurant",
              location: `${destination} downtown`,
              cost: "₹750",
              speciality: "Local specialty dishes",
            },
          ],
          accommodation: {
            hotel: "Recommended hotel",
            location: `${destination} city center`,
            checkIn: "3:00 PM",
            cost: budget === "Budget" ? "₹1500/night" : budget === "Luxury" ? "₹6000/night" : "₹3000/night",
          },
        })),
        accommodationDetails: [
          {
            name: "Recommended Hotel",
            type: "Hotel",
            location: `${destination} city center`,
            pricePerNight: budget === "Budget" ? "₹1500" : budget === "Luxury" ? "₹6000" : "₹3000",
            totalNights: duration - 1,
            totalCost:
              budget === "Budget"
                ? `₹${(duration - 1) * 1500}`
                : budget === "Luxury"
                  ? `₹${(duration - 1) * 6000}`
                  : `₹${(duration - 1) * 3000}`,
            amenities: ["WiFi", "Breakfast", "24/7 Reception"],
            bookingTips: "Book 2-3 weeks in advance for better rates",
            alternatives: ["Budget hostel option", "Luxury resort alternative"],
          },
        ],
        transportation: {
          toDestination: {
            method: "Flight",
            details: `Direct flights available to ${destination}`,
            cost: "₹12000",
            duration: "3-5 hours",
            bookingTips: "Book 6-8 weeks in advance for best prices",
          },
          localTransport: [
            {
              method: "Public transport",
              cost: "₹300/day",
              tips: "Buy daily passes for convenience",
            },
          ],
          fromDestination: {
            method: "Return flight",
            cost: "₹12000",
            bookingTips: "Book return ticket with arrival for better rates",
          },
        },
        budgetBreakdown: {
          accommodation:
            budget === "Budget"
              ? `₹${(duration - 1) * 1500}`
              : budget === "Luxury"
                ? `₹${(duration - 1) * 6000}`
                : `₹${(duration - 1) * 3000}`,
          transportation: "₹24000",
          food: `₹${duration * 1800}`,
          activities: `₹${duration * 2400}`,
          shopping: `₹${duration * 900}`,
          miscellaneous: `₹${duration * 600}`,
          total:
            budget === "Budget"
              ? `₹${duration * 3000}`
              : budget === "Luxury"
                ? `₹${duration * 15000}`
                : `₹${duration * 7500}`,
          dailyAverage: budget === "Budget" ? "₹3000" : budget === "Luxury" ? "₹15000" : "₹7500",
          budgetTips: ["Use public transport", "Eat at local places", "Book activities in advance"],
        },
        packingList: {
          clothing: ["Comfortable walking shoes", "Weather-appropriate clothes", "Light jacket"],
          electronics: ["Phone charger", "Camera", "Power bank"],
          documents: ["Passport", "Travel insurance", "Hotel confirmations"],
          healthAndSafety: ["First aid kit", "Personal medications", "Hand sanitizer"],
          miscellaneous: ["Reusable water bottle", "Day backpack", "Travel adapter"],
          weatherSpecific: ["Sunscreen", "Umbrella", "Comfortable clothes"],
        },
        importantTips: [
          "Learn basic local phrases",
          "Keep copies of important documents",
          "Inform bank about travel plans",
          "Research local customs and etiquette",
          "Download offline maps",
        ],
        emergencyInfo: {
          localEmergency: "Local emergency services: 100, 101, 102",
          nearestHospital: `${destination} General Hospital`,
          embassy: "Contact your embassy if traveling internationally",
          importantContacts: ["Hotel reception", "Local tour guide"],
          safetyTips: ["Stay aware of surroundings", "Keep valuables secure"],
        },
        bookingChecklist: [
          {
            item: "Book flights",
            deadline: "6-8 weeks before",
            priority: "High",
          },
          {
            item: "Book accommodation",
            deadline: "4-6 weeks before",
            priority: "High",
          },
          {
            item: "Get travel insurance",
            deadline: "2 weeks before",
            priority: "Medium",
          },
        ],
      }
    }

    return NextResponse.json(tripPlan)
  } catch (error) {
    console.error("Trip planner error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate trip plan. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
