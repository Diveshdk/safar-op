export async function POST(request: Request) {
  try {
    const { destination, budget, days, people } = await request.json()

    if (!destination || !budget || !days || !people) {
      return Response.json({ error: "All fields are required" }, { status: 400 })
    }

    // Enhanced Gemini prompt for detailed trip planning
    const prompt = `You are an expert Indian travel planner. Create a detailed, accurate trip plan for the following requirements:

**Trip Details:**
- Destination: ${destination}
- Budget: ₹${budget} total for ${people} people
- Duration: ${days} days
- Number of travelers: ${people}

**Important Instructions:**
1. All costs must be in Indian Rupees (₹)
2. Provide REAL, SPECIFIC places, hotels, restaurants, and attractions in ${destination}
3. Include actual names of establishments, not generic descriptions
4. Budget breakdown should be realistic for Indian travelers
5. Consider local transportation costs, entry fees, and meal prices
6. Include both popular attractions and hidden gems
7. Suggest specific local dishes and where to find them
8. Provide practical tips for the destination

**Required JSON Format:**
{
  "destination": "${destination}",
  "totalBudget": ${budget},
  "budgetPerPerson": ${Math.floor(budget / people)},
  "duration": "${days} days",
  "travelers": ${people},
  "budgetBreakdown": {
    "accommodation": {
      "amount": "₹X,XXX",
      "percentage": "XX%",
      "details": "Specific hotel recommendations with actual names and rates"
    },
    "food": {
      "amount": "₹X,XXX", 
      "percentage": "XX%",
      "details": "Meal costs breakdown with specific restaurant names"
    },
    "transportation": {
      "amount": "₹X,XXX",
      "percentage": "XX%", 
      "details": "Local transport, flights/trains to destination"
    },
    "activities": {
      "amount": "₹X,XXX",
      "percentage": "XX%",
      "details": "Entry fees, tours, experiences"
    },
    "miscellaneous": {
      "amount": "₹X,XXX",
      "percentage": "XX%",
      "details": "Shopping, emergency fund, tips"
    }
  },
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Local Exploration",
      "activities": [
        {
          "time": "Morning",
          "activity": "Specific activity name",
          "location": "Exact location name with area",
          "cost": "₹XXX per person",
          "description": "Detailed description",
          "tips": "Practical tips"
        }
      ],
      "meals": [
        {
          "type": "Breakfast/Lunch/Dinner",
          "restaurant": "Actual restaurant name",
          "location": "Specific address/area",
          "cost": "₹XXX per person",
          "speciality": "Must-try dishes"
        }
      ],
      "accommodation": {
        "name": "Specific hotel/guesthouse name",
        "area": "Exact locality",
        "cost": "₹XXX per night",
        "amenities": ["WiFi", "AC", "etc"]
      }
    }
  ],
  "accommodationOptions": [
    {
      "name": "Actual hotel name",
      "type": "Budget/Mid-range/Luxury",
      "location": "Specific area",
      "pricePerNight": "₹XXX",
      "amenities": ["List of amenities"],
      "rating": "X.X/5",
      "bookingTip": "How to book, best rates"
    }
  ],
  "foodRecommendations": [
    {
      "name": "Actual restaurant/street food vendor name",
      "location": "Specific location",
      "cuisine": "Type of cuisine",
      "mustTry": ["Specific dish names"],
      "averageCost": "₹XXX per person",
      "timing": "Best time to visit"
    }
  ],
  "attractions": [
    {
      "name": "Actual attraction name",
      "location": "Specific address/area", 
      "entryFee": "₹XXX",
      "bestTime": "Best time to visit",
      "duration": "Time needed",
      "description": "What makes it special",
      "nearbyAttractions": ["Other places nearby"]
    }
  ],
  "transportation": {
    "toDestination": {
      "options": [
        {
          "mode": "Flight/Train/Bus",
          "from": "Major Indian cities",
          "cost": "₹XXX - ₹XXX",
          "duration": "X hours",
          "bookingTips": "Best booking platforms, advance booking discounts"
        }
      ]
    },
    "local": {
      "options": [
        {
          "mode": "Auto/Taxi/Bus/Metro",
          "cost": "₹XXX per day/trip",
          "coverage": "Areas covered",
          "tips": "Negotiation tips, apps to use"
        }
      ]
    }
  },
  "packingList": [
    "Season-appropriate clothing",
    "Specific items for the destination",
    "Documents needed"
  ],
  "localTips": [
    "Cultural etiquette",
    "Best time to visit attractions",
    "Local customs to respect",
    "Safety tips",
    "Money-saving hacks",
    "Language basics if needed"
  ],
  "emergencyInfo": {
    "localPolice": "100",
    "touristHelpline": "Specific numbers for the destination",
    "hospitals": ["Names of major hospitals in the area"],
    "embassies": "If applicable for international travelers"
  },
  "weatherInfo": {
    "currentSeason": "Weather during travel time",
    "whatToPack": "Clothing recommendations",
    "bestTimeToVisit": "Ideal months for the destination"
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
    let tripPlan

    try {
      // Extract JSON from Gemini response
      const responseText = geminiData.candidates[0].content.parts[0].text
      console.log("Gemini response:", responseText)

      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        tripPlan = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      // Enhanced fallback data with Indian context
      tripPlan = {
        destination: destination,
        totalBudget: budget,
        budgetPerPerson: Math.floor(budget / people),
        duration: `${days} days`,
        travelers: people,
        budgetBreakdown: {
          accommodation: {
            amount: `₹${Math.floor(budget * 0.35).toLocaleString()}`,
            percentage: "35%",
            details: "Budget hotels, guesthouses, or homestays",
          },
          food: {
            amount: `₹${Math.floor(budget * 0.25).toLocaleString()}`,
            percentage: "25%",
            details: "Local restaurants, street food, and cafes",
          },
          transportation: {
            amount: `₹${Math.floor(budget * 0.2).toLocaleString()}`,
            percentage: "20%",
            details: "Local transport and travel to destination",
          },
          activities: {
            amount: `₹${Math.floor(budget * 0.15).toLocaleString()}`,
            percentage: "15%",
            details: "Entry fees, tours, and experiences",
          },
          miscellaneous: {
            amount: `₹${Math.floor(budget * 0.05).toLocaleString()}`,
            percentage: "5%",
            details: "Shopping, tips, and emergency fund",
          },
        },
        itinerary: Array.from({ length: Number.parseInt(days) }, (_, i) => ({
          day: i + 1,
          title: i === 0 ? "Arrival & Local Exploration" : `Day ${i + 1} - Sightseeing`,
          activities: [
            {
              time: "Morning",
              activity: "Local sightseeing",
              location: destination,
              cost: `₹${Math.floor(500 / people)}`,
              description: "Explore the main attractions and local culture",
              tips: "Start early to avoid crowds",
            },
            {
              time: "Afternoon",
              activity: "Cultural experience",
              location: destination,
              cost: `₹${Math.floor(300 / people)}`,
              description: "Visit local markets and interact with locals",
              tips: "Try local street food",
            },
          ],
          meals: [
            {
              type: "Breakfast",
              restaurant: "Local cafe",
              location: destination,
              cost: `₹${Math.floor(150 / people)}`,
              speciality: "Traditional breakfast items",
            },
            {
              type: "Lunch",
              restaurant: "Popular local restaurant",
              location: destination,
              cost: `₹${Math.floor(300 / people)}`,
              speciality: "Regional specialties",
            },
            {
              type: "Dinner",
              restaurant: "Recommended dining spot",
              location: destination,
              cost: `₹${Math.floor(400 / people)}`,
              speciality: "Local cuisine",
            },
          ],
          accommodation: {
            name: "Recommended accommodation",
            area: destination,
            cost: `₹${Math.floor((budget * 0.35) / days)}`,
            amenities: ["WiFi", "Clean rooms", "Good location"],
          },
        })),
        accommodationOptions: [
          {
            name: "Budget Option",
            type: "Budget",
            location: destination,
            pricePerNight: `₹${Math.floor((budget * 0.25) / days)}`,
            amenities: ["Basic amenities", "Clean", "Safe"],
            rating: "3.5/5",
            bookingTip: "Book in advance for better rates",
          },
          {
            name: "Mid-range Option",
            type: "Mid-range",
            location: destination,
            pricePerNight: `₹${Math.floor((budget * 0.4) / days)}`,
            amenities: ["AC", "WiFi", "Room service", "Good location"],
            rating: "4.0/5",
            bookingTip: "Check for package deals",
          },
        ],
        foodRecommendations: [
          {
            name: "Local street food area",
            location: destination,
            cuisine: "Local",
            mustTry: ["Regional specialties", "Street snacks"],
            averageCost: "₹100-200 per person",
            timing: "Evening for best variety",
          },
        ],
        attractions: [
          {
            name: "Main attraction",
            location: destination,
            entryFee: "₹50-200",
            bestTime: "Morning or evening",
            duration: "2-3 hours",
            description: "Must-visit landmark",
            nearbyAttractions: ["Other local spots"],
          },
        ],
        transportation: {
          toDestination: {
            options: [
              {
                mode: "Train",
                from: "Major cities",
                cost: "₹500-2000",
                duration: "Varies",
                bookingTips: "Book through IRCTC, book early for better prices",
              },
            ],
          },
          local: {
            options: [
              {
                mode: "Auto/Taxi",
                cost: "₹200-500 per day",
                coverage: "City areas",
                tips: "Use Ola/Uber or negotiate with local drivers",
              },
            ],
          },
        },
        packingList: [
          "Comfortable walking shoes",
          "Weather-appropriate clothing",
          "Camera",
          "Power bank",
          "First aid kit",
          "Valid ID documents",
        ],
        localTips: [
          "Learn basic local phrases",
          "Respect local customs and traditions",
          "Bargain politely in markets",
          "Try local cuisine but choose clean places",
          "Keep emergency contacts handy",
          "Inform someone about your itinerary",
        ],
        emergencyInfo: {
          localPolice: "100",
          touristHelpline: "1363 (India Tourism Helpline)",
          hospitals: ["Contact local hospitals"],
          embassies: "Contact respective embassies if needed",
        },
        weatherInfo: {
          currentSeason: "Check current weather conditions",
          whatToPack: "Pack according to season",
          bestTimeToVisit: "Research best months for the destination",
        },
      }
    }

    return Response.json(tripPlan)
  } catch (error) {
    console.error("Trip planner error:", error)
    return Response.json(
      {
        error: "Failed to generate trip plan. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
