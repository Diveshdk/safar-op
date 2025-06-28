export async function POST(request: Request) {
  try {
    const { query, currentLocation } = await request.json()

    if (!query || !query.trim()) {
      return Response.json({ error: "Query is required" }, { status: 400 })
    }

    // Enhanced Gemini prompt for comprehensive travel information
    const prompt = `You are a comprehensive travel guide AI. Provide detailed information about "${query}" in JSON format.

Include these sections with rich, detailed content:

1. **Basic Info**: Name, country, region, best time to visit
2. **Description**: 3-4 sentences about what makes this place special
3. **History**: 3-4 sentences about historical significance
4. **Culture**: 3-4 sentences about local culture, traditions, customs
5. **Language**: Primary languages spoken and useful phrases
6. **Notable Places**: 8-10 must-visit attractions with brief descriptions
7. **Activities**: 8-10 things to do and experiences
8. **Food**: 8-10 local dishes and specialties with descriptions
9. **Hotels**: 6-8 accommodation options from budget to luxury
10. **Transportation**: How to reach and local transport options
11. **Daily Expenses**: Detailed breakdown for budget, mid-range, and luxury travelers
12. **Weather**: Current season info and what to expect
13. **Fun Facts**: 3-5 interesting facts about the place
14. **Tips**: 5-6 practical travel tips

${currentLocation ? `Consider the user is traveling from ${currentLocation.name}.` : ""}

Format as valid JSON with these exact keys:
{
  "name": "Place Name",
  "country": "Country",
  "region": "Region/State",
  "bestTimeToVisit": "Season/months",
  "description": "Detailed description...",
  "history": "Historical background...",
  "culture": "Cultural information...",
  "language": {
    "primary": ["Language 1", "Language 2"],
    "phrases": ["Hello - Local word", "Thank you - Local word", "How much? - Local word"]
  },
  "notablePlaces": [
    {"name": "Place 1", "description": "What makes it special"},
    {"name": "Place 2", "description": "What makes it special"}
  ],
  "activities": [
    {"name": "Activity 1", "description": "What you'll experience"},
    {"name": "Activity 2", "description": "What you'll experience"}
  ],
  "food": [
    {"name": "Dish 1", "description": "Taste and ingredients"},
    {"name": "Dish 2", "description": "Taste and ingredients"}
  ],
  "hotels": [
    {"name": "Hotel 1", "type": "Luxury", "priceRange": "$200-300", "description": "What to expect"},
    {"name": "Hotel 2", "type": "Budget", "priceRange": "$20-50", "description": "What to expect"}
  ],
  "transportation": {
    "howToReach": "Flight/train/bus options from major cities",
    "localTransport": "Local buses, taxis, metro, etc.",
    "distance": "${currentLocation ? `Distance from ${currentLocation.name}` : "Distance from major cities"}"
  },
  "dailyExpenses": {
    "budget": {
      "accommodation": "$10-25",
      "food": "$5-15",
      "transport": "$2-8",
      "activities": "$5-20",
      "total": "$22-68"
    },
    "midRange": {
      "accommodation": "$25-80",
      "food": "$15-40",
      "transport": "$8-25",
      "activities": "$20-50",
      "total": "$68-195"
    },
    "luxury": {
      "accommodation": "$80-300",
      "food": "$40-100",
      "transport": "$25-100",
      "activities": "$50-200",
      "total": "$195-700"
    }
  },
  "weather": {
    "current": "Current season description",
    "temperature": "Temperature range",
    "rainfall": "Rainfall info",
    "clothing": "What to pack"
  },
  "funFacts": [
    "Interesting fact 1",
    "Interesting fact 2",
    "Interesting fact 3"
  ],
  "tips": [
    "Practical tip 1",
    "Practical tip 2",
    "Practical tip 3"
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
    let placeInfo

    try {
      // Extract JSON from Gemini response
      const responseText = geminiData.candidates[0].content.parts[0].text
      console.log("Gemini response:", responseText)

      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        placeInfo = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      // Enhanced fallback data
      placeInfo = {
        name: query,
        country: "Unknown",
        region: "Unknown",
        bestTimeToVisit: "Year-round",
        description: `${query} is a fascinating destination with rich culture and history. This place offers unique experiences for travelers seeking adventure and cultural immersion.`,
        history: `${query} has a rich historical background spanning many centuries, with influences from various civilizations and cultures.`,
        culture: `The local culture of ${query} is vibrant and diverse, with unique traditions, festivals, and customs that reflect the area's heritage.`,
        language: {
          primary: ["Local Language", "English"],
          phrases: ["Hello - Namaste", "Thank you - Dhanyawad", "How much? - Kitna paisa?"],
        },
        notablePlaces: [
          { name: "Historic Center", description: "The heart of the city with colonial architecture" },
          { name: "Local Museum", description: "Showcases regional history and artifacts" },
          { name: "Cultural District", description: "Traditional markets and local crafts" },
          { name: "Scenic Viewpoint", description: "Panoramic views of the surrounding area" },
          { name: "Religious Site", description: "Important spiritual and cultural landmark" },
          { name: "Natural Park", description: "Beautiful landscapes and wildlife" },
        ],
        activities: [
          { name: "City Walking Tour", description: "Explore historic neighborhoods" },
          { name: "Local Market Visit", description: "Experience authentic local life" },
          { name: "Cultural Show", description: "Traditional music and dance performances" },
          { name: "Food Tour", description: "Taste authentic local cuisine" },
          { name: "Photography Walk", description: "Capture stunning architecture and landscapes" },
        ],
        food: [
          { name: "Local Specialty", description: "Traditional dish with unique flavors" },
          { name: "Street Food", description: "Popular snacks sold by local vendors" },
          { name: "Regional Curry", description: "Spicy and aromatic local curry" },
          { name: "Traditional Sweets", description: "Local desserts and confections" },
          { name: "Fresh Seafood", description: "Locally caught and prepared fish" },
        ],
        hotels: [
          {
            name: "Heritage Hotel",
            type: "Luxury",
            priceRange: "$150-250",
            description: "Historic property with modern amenities",
          },
          {
            name: "Boutique Inn",
            type: "Mid-range",
            priceRange: "$50-100",
            description: "Charming local accommodation",
          },
          { name: "Budget Hostel", type: "Budget", priceRange: "$15-30", description: "Clean and affordable lodging" },
        ],
        transportation: {
          howToReach: "Accessible by flight, train, or bus from major cities",
          localTransport: "Local buses, taxis, auto-rickshaws, and walking",
          distance: currentLocation
            ? `Distance varies from ${currentLocation.name}`
            : "Distance varies based on origin",
        },
        dailyExpenses: {
          budget: {
            accommodation: "$15-25",
            food: "$5-12",
            transport: "$3-8",
            activities: "$5-15",
            total: "$28-60",
          },
          midRange: {
            accommodation: "$25-60",
            food: "$12-25",
            transport: "$8-20",
            activities: "$15-35",
            total: "$60-140",
          },
          luxury: {
            accommodation: "$60-200",
            food: "$25-60",
            transport: "$20-50",
            activities: "$35-100",
            total: "$140-410",
          },
        },
        weather: {
          current: "Pleasant weather with moderate temperatures",
          temperature: "20-30°C (68-86°F)",
          rainfall: "Moderate rainfall during monsoon season",
          clothing: "Light cotton clothes, comfortable walking shoes",
        },
        funFacts: [
          `${query} has a unique cultural heritage`,
          "The local cuisine is influenced by various regional traditions",
          "This destination is known for its hospitality and warmth",
        ],
        tips: [
          "Learn a few local phrases to connect with locals",
          "Try the street food but choose busy stalls",
          "Carry cash as many places don't accept cards",
          "Respect local customs and dress modestly",
          "Bargain politely in local markets",
        ],
      }
    }

    return Response.json(placeInfo)
  } catch (error) {
    console.error("Search place error:", error)
    return Response.json(
      {
        error: "Failed to search place. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
