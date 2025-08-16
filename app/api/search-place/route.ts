import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, currentLocation } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Enhanced Gemini prompt for comprehensive place information
    const prompt = `You are an expert travel guide and researcher. Provide comprehensive, accurate information about "${query}" as a travel destination.

Create detailed travel information in JSON format with these sections:

{
  "name": "${query}",
  "country": "Country name",
  "region": "State/Province/Region",
  "bestTimeToVisit": "Best months to visit",
  "description": "Engaging 2-3 sentence description of the destination",
  "history": "Brief historical background (2-3 sentences)",
  "culture": "Cultural highlights and traditions (2-3 sentences)",
  "language": {
    "primary": ["Primary languages spoken"],
    "phrases": [
      "Hello - Local translation",
      "Thank you - Local translation", 
      "How much? - Local translation",
      "Where is? - Local translation",
      "Excuse me - Local translation"
    ]
  },
  "notablePlaces": [
    {
      "name": "Specific landmark/attraction name",
      "description": "What makes this place special and worth visiting"
    },
    {
      "name": "Another specific place",
      "description": "Detailed description"
    },
    {
      "name": "Third notable place",
      "description": "Why visitors should go here"
    },
    {
      "name": "Fourth attraction",
      "description": "What to expect and see"
    },
    {
      "name": "Fifth must-visit spot",
      "description": "Unique features and experiences"
    }
  ],
  "activities": [
    {
      "name": "Specific activity name",
      "description": "What the activity involves and why it's recommended"
    },
    {
      "name": "Adventure activity",
      "description": "Details about the experience"
    },
    {
      "name": "Cultural activity",
      "description": "Cultural significance and what to expect"
    },
    {
      "name": "Nature activity",
      "description": "Natural attractions and outdoor experiences"
    },
    {
      "name": "Local experience",
      "description": "Authentic local activities"
    }
  ],
  "food": [
    {
      "name": "Famous local dish",
      "description": "What it is, ingredients, and where to find the best version"
    },
    {
      "name": "Traditional specialty",
      "description": "Cultural significance and taste profile"
    },
    {
      "name": "Street food favorite",
      "description": "Popular street food and where to try it"
    },
    {
      "name": "Regional delicacy",
      "description": "Unique to this region and must-try"
    },
    {
      "name": "Sweet/dessert",
      "description": "Traditional sweet or dessert specialty"
    }
  ],
  "hotels": [
    {
      "name": "Luxury hotel name",
      "type": "Luxury",
      "priceRange": "₹8,000-15,000/night",
      "description": "Premium amenities and location details"
    },
    {
      "name": "Mid-range hotel name", 
      "type": "Mid-Range",
      "priceRange": "₹3,000-6,000/night",
      "description": "Good value accommodation with decent amenities"
    },
    {
      "name": "Budget option name",
      "type": "Budget", 
      "priceRange": "₹1,500-2,500/night",
      "description": "Clean, basic accommodation for budget travelers"
    },
    {
      "name": "Hostel/backpacker option",
      "type": "Budget",
      "priceRange": "₹800-1,500/night", 
      "description": "Backpacker-friendly with shared facilities"
    }
  ],
  "transportation": {
    "howToReach": "Detailed information about flights, trains, buses to reach the destination",
    "localTransport": "Local transportation options like buses, taxis, auto-rickshaws, metro",
    "distance": "Distance from major cities or current location if provided"
  },
  "dailyExpenses": {
    "budget": {
      "accommodation": "₹1,500-2,500",
      "food": "₹800-1,200", 
      "transport": "₹300-500",
      "activities": "₹500-800",
      "total": "₹3,100-5,000"
    },
    "midRange": {
      "accommodation": "₹3,000-6,000",
      "food": "₹1,500-2,500",
      "transport": "₹500-800", 
      "activities": "₹1,000-1,500",
      "total": "₹6,000-10,800"
    },
    "luxury": {
      "accommodation": "₹8,000-15,000",
      "food": "₹3,000-5,000",
      "transport": "₹1,000-2,000",
      "activities": "₹2,000-3,000", 
      "total": "₹14,000-25,000"
    }
  },
  "weather": {
    "current": "Current season description",
    "temperature": "Temperature range",
    "rainfall": "Rainfall information",
    "clothing": "What type of clothes to pack"
  },
  "funFacts": [
    "Interesting fact about the destination",
    "Another fascinating detail",
    "Historical or cultural trivia",
    "Unique feature or record",
    "Surprising information about the place"
  ],
  "tips": [
    "Practical travel tip specific to this destination",
    "Money-saving advice",
    "Cultural etiquette tip",
    "Safety or health advice", 
    "Best time to visit attractions tip",
    "Local customs to be aware of",
    "Photography or shopping advice"
  ]
}

Make sure all information is accurate, specific, and helpful for travelers. Use real place names, actual hotel chains where possible, and authentic local dishes. Provide practical, actionable advice.`

    try {
      // Call Gemini API
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
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
        // Fallback place information
        placeInfo = {
          name: query,
          country: "India",
          region: "Unknown Region",
          bestTimeToVisit: "October to March",
          description: `${query} is a fascinating destination with rich culture, beautiful landscapes, and memorable experiences waiting to be discovered.`,
          history: `${query} has a rich historical heritage that spans centuries, with influences from various dynasties and cultures that have shaped its unique character.`,
          culture: `The local culture of ${query} is vibrant and diverse, featuring traditional festivals, art forms, and customs that reflect the region's deep-rooted heritage.`,
          language: {
            primary: ["Hindi", "English"],
            phrases: [
              "Hello - Namaste",
              "Thank you - Dhanyawad",
              "How much? - Kitna paisa?",
              "Where is? - Kahan hai?",
              "Excuse me - Maaf kijiye",
            ],
          },
          notablePlaces: [
            {
              name: `${query} Main Attraction`,
              description:
                "The most famous landmark that draws visitors from around the world with its stunning architecture and historical significance.",
            },
            {
              name: `${query} Cultural Center`,
              description:
                "A hub of local culture showcasing traditional arts, crafts, and performances that represent the region's heritage.",
            },
            {
              name: `${query} Scenic Viewpoint`,
              description:
                "Breathtaking panoramic views of the surrounding landscape, perfect for photography and peaceful contemplation.",
            },
            {
              name: `${query} Heritage Site`,
              description:
                "Ancient structures and monuments that tell the story of the region's glorious past and architectural excellence.",
            },
            {
              name: `${query} Local Market`,
              description:
                "Bustling marketplace where you can experience local life, shop for souvenirs, and taste authentic street food.",
            },
          ],
          activities: [
            {
              name: "Heritage Walking Tour",
              description:
                "Explore the historical sites and learn about the rich cultural heritage through guided walks with local experts.",
            },
            {
              name: "Adventure Sports",
              description:
                "Thrilling outdoor activities like trekking, rock climbing, or water sports depending on the terrain and location.",
            },
            {
              name: "Cultural Performances",
              description:
                "Experience traditional dance, music, and theater performances that showcase the local artistic traditions.",
            },
            {
              name: "Nature Exploration",
              description:
                "Discover the natural beauty through wildlife spotting, nature walks, or visits to parks and gardens.",
            },
            {
              name: "Local Craft Workshops",
              description:
                "Hands-on experience learning traditional crafts and skills from local artisans and craftspeople.",
            },
          ],
          food: [
            {
              name: "Regional Thali",
              description:
                "A complete meal featuring various local dishes served on a traditional platter, offering a taste of authentic regional cuisine.",
            },
            {
              name: "Street Food Special",
              description:
                "Popular local street food that's beloved by locals and visitors alike, available at food stalls and markets.",
            },
            {
              name: "Traditional Curry",
              description:
                "Signature curry dish prepared with local spices and ingredients, representing the authentic flavors of the region.",
            },
            {
              name: "Local Bread",
              description:
                "Traditional bread variety that's a staple in the local diet, often served with curries and vegetables.",
            },
            {
              name: "Regional Sweet",
              description:
                "Traditional dessert or sweet preparation that's unique to the area and perfect for ending a meal.",
            },
          ],
          hotels: [
            {
              name: "Heritage Palace Hotel",
              type: "Luxury",
              priceRange: "₹8,000-15,000/night",
              description:
                "Luxurious accommodation in a restored heritage property with modern amenities and traditional charm.",
            },
            {
              name: "Comfort Inn & Suites",
              type: "Mid-Range",
              priceRange: "₹3,000-6,000/night",
              description:
                "Well-appointed rooms with good facilities, centrally located for easy access to major attractions.",
            },
            {
              name: "Budget Traveler Lodge",
              type: "Budget",
              priceRange: "₹1,500-2,500/night",
              description:
                "Clean and comfortable accommodation with basic amenities, perfect for budget-conscious travelers.",
            },
            {
              name: "Backpacker Hostel",
              type: "Budget",
              priceRange: "₹800-1,500/night",
              description:
                "Dormitory-style accommodation with shared facilities, ideal for young travelers and backpackers.",
            },
          ],
          transportation: {
            howToReach: `${query} is well-connected by road, rail, and air. The nearest airport and railway station provide convenient access from major cities.`,
            localTransport:
              "Local buses, auto-rickshaws, taxis, and rental vehicles are available for getting around the city and nearby attractions.",
            distance: currentLocation
              ? `Approximately 200-500 km from ${currentLocation.name}`
              : "Distance varies based on your starting location",
          },
          dailyExpenses: {
            budget: {
              accommodation: "₹1,500-2,500",
              food: "₹800-1,200",
              transport: "₹300-500",
              activities: "₹500-800",
              total: "₹3,100-5,000",
            },
            midRange: {
              accommodation: "₹3,000-6,000",
              food: "₹1,500-2,500",
              transport: "₹500-800",
              activities: "₹1,000-1,500",
              total: "₹6,000-10,800",
            },
            luxury: {
              accommodation: "₹8,000-15,000",
              food: "₹3,000-5,000",
              transport: "₹1,000-2,000",
              activities: "₹2,000-3,000",
              total: "₹14,000-25,000",
            },
          },
          weather: {
            current: "Pleasant weather suitable for travel",
            temperature: "20°C to 30°C",
            rainfall: "Moderate rainfall during monsoon season",
            clothing: "Light cotton clothes, comfortable walking shoes, and a light jacket for evenings",
          },
          funFacts: [
            `${query} is known for its unique cultural blend and historical significance.`,
            "The region has been featured in several films and documentaries.",
            "Local festivals here attract visitors from across the country.",
            "The area is famous for its traditional handicrafts and artisan work.",
            "Many famous personalities have visited and praised this destination.",
          ],
          tips: [
            "Visit early morning or late afternoon for the best experience and fewer crowds.",
            "Bargain respectfully at local markets - start at 50% of the quoted price.",
            "Try local transportation for an authentic experience and to save money.",
            "Respect local customs and dress modestly when visiting religious sites.",
            "Keep hydrated and carry sunscreen, especially during summer months.",
            "Learn a few basic local phrases to connect better with locals.",
            "Book accommodations in advance during peak tourist season.",
          ],
        }
      }

      return NextResponse.json(placeInfo)
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError)
      return NextResponse.json(
        {
          error: "Failed to get place information. Please try again.",
          details: geminiError instanceof Error ? geminiError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in search place API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
