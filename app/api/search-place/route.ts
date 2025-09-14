import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      console.error("Gemini API key not found in environment variables")
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    console.log("Starting place search for:", query)

    // Enhanced prompt for place search
    const prompt = `You are a travel expert. Provide detailed information about "${query}" as a travel destination.

Please respond with a JSON object containing comprehensive travel information:

{
  "name": "${query}",
  "description": "Detailed description of the place (2-3 sentences)",
  "highlights": ["Top attraction 1", "Top attraction 2", "Top attraction 3", "Top attraction 4"],
  "bestTimeToVisit": "Best months/season to visit",
  "averageCost": "₹X,XXX per day",
  "duration": "Recommended stay duration",
  "activities": [
    {
      "name": "Activity name",
      "description": "Activity description",
      "cost": "₹XXX",
      "duration": "X hours"
    }
  ],
  "cuisine": ["Local dish 1", "Local dish 2", "Local dish 3"],
  "transportation": {
    "howToReach": "How to reach this destination",
    "localTransport": "Local transportation options"
  },
  "accommodation": {
    "budget": "₹X,XXX/night",
    "midRange": "₹X,XXX/night", 
    "luxury": "₹X,XXX/night"
  },
  "tips": ["Travel tip 1", "Travel tip 2", "Travel tip 3"],
  "weather": "Current weather and what to expect",
  "safety": "Safety information and precautions"
}`

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
              maxOutputTokens: 4096,
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

        // Enhanced fallback place info
        placeInfo = {
          name: query,
          description: `${query} is a beautiful destination with rich culture, stunning landscapes, and memorable experiences waiting to be discovered.`,
          highlights: [
            "Historic landmarks and monuments",
            "Local markets and shopping areas",
            "Cultural sites and museums",
            "Natural attractions and scenic spots",
          ],
          bestTimeToVisit: "October to March (pleasant weather)",
          averageCost: "₹2,500 per day",
          duration: "3-4 days",
          activities: [
            {
              name: "Sightseeing tour",
              description: "Explore the main attractions and landmarks",
              cost: "₹1,500",
              duration: "4-6 hours",
            },
            {
              name: "Cultural experience",
              description: "Immerse in local culture and traditions",
              cost: "₹800",
              duration: "2-3 hours",
            },
            {
              name: "Local cuisine tour",
              description: "Taste authentic local dishes and specialties",
              cost: "₹1,200",
              duration: "3-4 hours",
            },
          ],
          cuisine: ["Local specialty dishes", "Traditional sweets", "Regional delicacies"],
          transportation: {
            howToReach: "Well connected by air, rail, and road networks",
            localTransport: "Taxis, buses, and auto-rickshaws available",
          },
          accommodation: {
            budget: "₹1,500/night",
            midRange: "₹3,500/night",
            luxury: "₹8,000/night",
          },
          tips: [
            "Book accommodations in advance during peak season",
            "Try local street food for authentic flavors",
            "Respect local customs and traditions",
            "Carry cash as some places may not accept cards",
          ],
          weather: "Pleasant weather with moderate temperatures",
          safety: "Generally safe for tourists. Follow standard travel precautions.",
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

      // Return fallback data on API error
      const fallbackInfo = {
        name: query,
        description: `${query} is a wonderful destination with many attractions and experiences to offer visitors.`,
        highlights: [
          "Popular tourist attractions",
          "Local cultural sites",
          "Shopping and dining areas",
          "Natural beauty spots",
        ],
        bestTimeToVisit: "October to March",
        averageCost: "₹2,500 per day",
        duration: "3-4 days",
        activities: [
          {
            name: "City tour",
            description: "Explore the main city attractions",
            cost: "₹1,500",
            duration: "4-6 hours",
          },
        ],
        cuisine: ["Local dishes", "Traditional food", "Street food"],
        transportation: {
          howToReach: "Accessible by various transport modes",
          localTransport: "Local transport options available",
        },
        accommodation: {
          budget: "₹1,500/night",
          midRange: "₹3,500/night",
          luxury: "₹8,000/night",
        },
        tips: ["Plan ahead", "Try local food", "Respect local culture"],
        weather: "Varies by season",
        safety: "Follow standard travel safety measures",
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
