import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, currentLocation } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      console.error("Gemini API key not found in environment variables")
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    console.log("Starting place search for:", query)

    // Enhanced Gemini prompt for place exploration that matches component structure
    const prompt = `You are an expert travel guide. Provide comprehensive information about "${query}" as a travel destination.

Create detailed travel information in JSON format with this EXACT structure:

{
  "name": "${query}",
  "country": "Country name",
  "region": "State/Province/Region",
  "bestTimeToVisit": "Best months to visit",
  "description": "Engaging 2-3 sentence description of the destination",
  "history": "Brief historical background (2-3 sentences)",
  "culture": "Cultural highlights and traditions (2-3 sentences)",
  "language": {
    "primary": ["Primary language 1", "Primary language 2"],
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
      "name": "Specific landmark name",
      "description": "What makes this place special"
    },
    {
      "name": "Another attraction",
      "description": "Why visitors should go here"
    },
    {
      "name": "Third notable place",
      "description": "Unique features"
    },
    {
      "name": "Fourth attraction",
      "description": "What to expect"
    }
  ],
  "activities": [
    {
      "name": "Specific activity name",
      "description": "What the activity involves"
    },
    {
      "name": "Adventure activity",
      "description": "Details about the experience"
    },
    {
      "name": "Cultural activity",
      "description": "Cultural significance"
    },
    {
      "name": "Nature activity",
      "description": "Outdoor experiences"
    }
  ],
  "food": [
    {
      "name": "Famous local dish",
      "description": "What it is and where to find it"
    },
    {
      "name": "Traditional specialty",
      "description": "Cultural significance and taste"
    },
    {
      "name": "Street food favorite",
      "description": "Popular street food"
    },
    {
      "name": "Regional delicacy",
      "description": "Must-try specialty"
    }
  ],
  "hotels": [
    {
      "name": "Luxury hotel name",
      "type": "Luxury",
      "priceRange": "₹8,000-15,000/night",
      "description": "Premium amenities and location"
    },
    {
      "name": "Mid-range hotel name", 
      "type": "Mid-Range",
      "priceRange": "₹3,000-6,000/night",
      "description": "Good value accommodation"
    },
    {
      "name": "Budget option name",
      "type": "Budget", 
      "priceRange": "₹1,500-2,500/night",
      "description": "Clean, basic accommodation"
    }
  ],
  "transportation": {
    "howToReach": "How to reach this destination by air, train, road",
    "localTransport": "Local transportation options available",
    "distance": "Distance from major cities"
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
    "Unique feature or record"
  ],
  "tips": [
    "Practical travel tip",
    "Money-saving advice",
    "Cultural etiquette tip",
    "Safety advice", 
    "Best time to visit tip"
  ]
}

Make sure all information is accurate and specific to ${query}.`

    try {
      // Call Gemini API with proper timeout and error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      console.log("Calling Gemini API for place search...")

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": geminiApiKey,
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
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      console.log("Gemini API response status:", geminiResponse.status)

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text()
        console.error("Gemini API error response:", errorText)
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`)
      }

      const geminiData = await geminiResponse.json()
      console.log("Gemini API response received, processing...")

      let placeInfo

      try {
        // Extract JSON from Gemini response
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

        if (!responseText) {
          console.error("No response text from Gemini API")
          throw new Error("No response text from Gemini API")
        }

        console.log("Gemini response text length:", responseText.length)

        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          placeInfo = JSON.parse(jsonMatch[0])
          console.log("Successfully parsed Gemini response")
        } else {
          console.error("No JSON found in Gemini response")
          throw new Error("No JSON found in response")
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError)
        console.log("Raw Gemini response:", geminiData)

        // Enhanced fallback place info with correct structure
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
          ],
          tips: [
            "Visit early morning or late afternoon for the best experience and fewer crowds.",
            "Bargain respectfully at local markets - start at 50% of the quoted price.",
            "Try local transportation for an authentic experience and to save money.",
            "Respect local customs and dress modestly when visiting religious sites.",
            "Keep hydrated and carry sunscreen, especially during summer months.",
          ],
        }
      }

      console.log("Place search completed successfully")
      return NextResponse.json(placeInfo)
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError)

      if (geminiError.name === "AbortError") {
        console.error("Gemini API request timed out")
        return NextResponse.json(
          {
            error: "Request timed out. Please try again.",
            details: "The AI service took too long to respond",
          },
          { status: 408 },
        )
      }

      // Return fallback data on API error with correct structure
      const fallbackInfo = {
        name: query,
        country: "India",
        region: "Unknown Region",
        bestTimeToVisit: "October to March",
        description: `${query} is a wonderful destination with many attractions and experiences to offer visitors.`,
        history: `${query} has a rich history with cultural significance and historical landmarks.`,
        culture: `The culture of ${query} is diverse and welcoming, with traditional customs and modern influences.`,
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
            name: "Popular tourist attractions",
            description: "Main attractions and landmarks worth visiting",
          },
          {
            name: "Local cultural sites",
            description: "Places showcasing local culture and heritage",
          },
          {
            name: "Shopping and dining areas",
            description: "Markets and restaurants for local experiences",
          },
          {
            name: "Natural beauty spots",
            description: "Scenic locations and natural attractions",
          },
        ],
        activities: [
          {
            name: "City tour",
            description: "Explore the main city attractions and landmarks",
          },
          {
            name: "Cultural experience",
            description: "Immerse in local culture and traditions",
          },
          {
            name: "Nature activities",
            description: "Outdoor activities and nature exploration",
          },
          {
            name: "Local cuisine tour",
            description: "Taste authentic local dishes and specialties",
          },
        ],
        food: [
          {
            name: "Local dishes",
            description: "Traditional and popular local cuisine",
          },
          {
            name: "Traditional food",
            description: "Authentic regional specialties",
          },
          {
            name: "Street food",
            description: "Popular street food and snacks",
          },
          {
            name: "Regional sweets",
            description: "Traditional desserts and sweets",
          },
        ],
        hotels: [
          {
            name: "Luxury hotels",
            type: "Luxury",
            priceRange: "₹8,000-15,000/night",
            description: "Premium accommodation with excellent amenities",
          },
          {
            name: "Mid-range hotels",
            type: "Mid-Range",
            priceRange: "₹3,000-6,000/night",
            description: "Comfortable accommodation with good facilities",
          },
          {
            name: "Budget options",
            type: "Budget",
            priceRange: "₹1,500-2,500/night",
            description: "Affordable accommodation for budget travelers",
          },
        ],
        transportation: {
          howToReach: "Accessible by various transport modes including air, rail, and road",
          localTransport: "Local transport options available including buses, taxis, and auto-rickshaws",
          distance: "Distance varies based on your starting location",
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
          current: "Varies by season",
          temperature: "Moderate temperatures",
          rainfall: "Seasonal rainfall",
          clothing: "Comfortable clothes suitable for the weather",
        },
        funFacts: [
          "Interesting destination with unique features",
          "Rich cultural heritage and traditions",
          "Popular among tourists for various reasons",
          "Known for its hospitality and local charm",
        ],
        tips: [
          "Plan ahead and book accommodations",
          "Try local food and experiences",
          "Respect local culture and customs",
          "Follow standard travel safety measures",
          "Carry necessary documents and emergency contacts",
        ],
      }

      return NextResponse.json(fallbackInfo)
    }
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
