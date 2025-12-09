import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences } = await request.json()

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = "AIzaSyCsMrFx1eVnk-8gT_WvmwiuiRLO8_IKWZs"

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

    if (!response.ok) {
      throw new Error(`Gemini API failed: ${response.status}`)
    }

    const data = await response.json()
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textContent) {
      throw new Error("No response from Gemini")
    }

    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON in response")
    }

    const tripPlan = JSON.parse(jsonMatch[0])

    return NextResponse.json(tripPlan)
  } catch (error) {
    return NextResponse.json({
      tripOverview: {
        destination: "Destination",
        duration: 3,
        startDate: "2025-12-11",
        endDate: "2025-12-14",
        summary: "A wonderful trip awaits you!",
        highlights: ["Exploring local culture", "Adventure activities", "Local cuisine"],
        totalEstimatedCost: "₹15000",
        bestTimeToVisit: "Year round",
      },
      dailyItinerary: [
        {
          day: 1,
          date: "2025-12-11",
          title: "Arrival & Exploration",
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
            {
              time: "02:00 PM",
              activity: "Local exploration",
              location: "City center",
              duration: "3 hours",
              cost: "₹500",
              description: "Walk around and get familiar",
              tips: "Wear comfortable shoes",
            },
          ],
          meals: [
            {
              type: "Breakfast",
              restaurant: "Hotel Restaurant",
              location: "Hotel",
              cost: "₹300",
              speciality: "Continental",
            },
            {
              type: "Lunch",
              restaurant: "Local Eatery",
              location: "City Center",
              cost: "₹400",
              speciality: "Local cuisine",
            },
            {
              type: "Dinner",
              restaurant: "Specialty Restaurant",
              location: "Main Street",
              cost: "₹600",
              speciality: "Traditional dishes",
            },
          ],
          accommodation: {
            hotel: "Star Hotel",
            location: "City Center",
            checkIn: "3:00 PM",
            cost: "₹2000/night",
          },
        },
        {
          day: 2,
          date: "2025-12-12",
          title: "Adventure Day",
          activities: [
            {
              time: "08:00 AM",
              activity: "Adventure activity",
              location: "Adventure site",
              duration: "4 hours",
              cost: "₹1500",
              description: "Thrilling experience",
              tips: "Bring camera",
            },
          ],
          meals: [
            {
              type: "Breakfast",
              restaurant: "Hotel Restaurant",
              location: "Hotel",
              cost: "₹300",
              speciality: "Continental",
            },
            {
              type: "Lunch",
              restaurant: "Adventure site cafe",
              location: "Adventure site",
              cost: "₹500",
              speciality: "Quick bites",
            },
            {
              type: "Dinner",
              restaurant: "Local Restaurant",
              location: "Downtown",
              cost: "₹700",
              speciality: "Regional cuisine",
            },
          ],
          accommodation: {
            hotel: "Star Hotel",
            location: "City Center",
            checkIn: "7:00 PM",
            cost: "₹2000/night",
          },
        },
        {
          day: 3,
          date: "2025-12-13",
          title: "Cultural Experience",
          activities: [
            {
              time: "10:00 AM",
              activity: "Visit cultural site",
              location: "Museum/Temple",
              duration: "3 hours",
              cost: "₹200",
              description: "Learn local history",
              tips: "Respect local customs",
            },
          ],
          meals: [
            {
              type: "Breakfast",
              restaurant: "Hotel Restaurant",
              location: "Hotel",
              cost: "₹300",
              speciality: "Continental",
            },
            {
              type: "Lunch",
              restaurant: "Cultural area cafe",
              location: "Cultural site",
              cost: "₹400",
              speciality: "Local specialties",
            },
            {
              type: "Dinner",
              restaurant: "Fine dining",
              location: "City center",
              cost: "₹800",
              speciality: "Premium cuisine",
            },
          ],
          accommodation: {
            hotel: "Star Hotel",
            location: "City Center",
            checkIn: "7:00 PM",
            cost: "₹2000/night",
          },
        },
      ],
      accommodationDetails: [
        {
          name: "Star Hotel",
          type: "4-star Hotel",
          location: "City Center",
          pricePerNight: "₹2000",
          totalNights: 2,
          totalCost: "₹4000",
          amenities: ["WiFi", "Breakfast", "Gym", "Restaurant"],
          bookingTips: "Book 2 weeks in advance",
          alternatives: ["Budget hotel - ₹1000", "Luxury hotel - ₹5000"],
        },
      ],
      transportation: {
        toDestination: {
          method: "Flight",
          details: "Morning flight",
          cost: "₹3000",
          duration: "2 hours",
          bookingTips: "Book early",
        },
        localTransport: [
          {
            method: "Taxi",
            cost: "₹500/day",
            tips: "Use official taxis",
          },
          {
            method: "Bus",
            cost: "₹100/ride",
            tips: "Good for sightseeing",
          },
        ],
        fromDestination: {
          method: "Flight",
          cost: "₹3000",
          bookingTips: "Return booking",
        },
      },
      budgetBreakdown: {
        accommodation: "₹4000",
        transportation: "₹6000",
        food: "₹4500",
        activities: "₹3000",
        shopping: "₹1500",
        miscellaneous: "₹900",
        total: "₹19900",
        dailyAverage: "₹6633",
        budgetTips: ["Book in advance", "Look for discounts"],
      },
      packingList: {
        clothing: ["Comfortable shoes", "Light clothes", "Jacket"],
        electronics: ["Phone", "Charger", "Camera"],
        documents: ["ID", "Tickets", "Hotel booking"],
        healthAndSafety: ["First aid kit", "Sunscreen", "Medicines"],
        miscellaneous: ["Water bottle", "Backpack"],
        weatherSpecific: ["Umbrella", "Hat"],
      },
      importantTips: ["Stay hydrated", "Respect local customs", "Keep valuables safe"],
      emergencyInfo: {
        localEmergency: "100",
        nearestHospital: "City Hospital",
        embassy: "Check embassy website",
        importantContacts: ["Hotel: +91-XXX-XXX-XXXX"],
        safetyTips: ["Avoid late night travel", "Use official taxis"],
      },
      bookingChecklist: [
        {
          item: "Book flights",
          deadline: "4 weeks before",
          priority: "High",
        },
        {
          item: "Book hotel",
          deadline: "2 weeks before",
          priority: "High",
        },
        {
          item: "Book activities",
          deadline: "1 week before",
          priority: "Medium",
        },
      ],
    })
  }
}
