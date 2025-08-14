import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { destination, duration, interests, budget } = await request.json()

    if (!destination || !duration) {
      return NextResponse.json({ error: "Destination and duration are required" }, { status: 400 })
    }

    // This is a simplified trip planner
    // In a real implementation, you would use AI services like OpenAI or Google's AI
    const tripPlan = generateTripPlan(destination, duration, interests, budget)

    return NextResponse.json({ success: true, tripPlan })
  } catch (error) {
    console.error("Error in trip planner API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateTripPlan(destination: string, duration: number, interests: string[], budget: string) {
  // This is a mock implementation
  // In production, you would integrate with AI services

  const days = []

  for (let i = 1; i <= duration; i++) {
    const day = {
      day: i,
      title: `Day ${i} in ${destination}`,
      activities: generateActivities(destination, interests, i),
      meals: generateMeals(destination, budget),
      accommodation: i === 1 ? generateAccommodation(destination, budget) : null,
    }
    days.push(day)
  }

  return {
    destination,
    duration,
    totalBudget: calculateBudget(duration, budget),
    days,
    tips: generateTips(destination, interests),
  }
}

function generateActivities(destination: string, interests: string[], day: number) {
  const allActivities = [
    "Visit local museums and cultural sites",
    "Explore historic landmarks",
    "Take a walking tour of the city center",
    "Visit local markets and shopping areas",
    "Enjoy outdoor activities and parks",
    "Experience local nightlife",
    "Take day trips to nearby attractions",
    "Visit religious and spiritual sites",
    "Enjoy local cuisine and food tours",
    "Participate in adventure activities",
  ]

  // Filter based on interests if provided
  let relevantActivities = allActivities
  if (interests && interests.length > 0) {
    relevantActivities = allActivities.filter((activity) =>
      interests.some((interest) => activity.toLowerCase().includes(interest.toLowerCase())),
    )
  }

  // Return 3-4 activities per day
  return relevantActivities.slice((day - 1) * 2, (day - 1) * 2 + 3)
}

function generateMeals(destination: string, budget: string) {
  const budgetMultiplier = budget === "luxury" ? 3 : budget === "mid-range" ? 2 : 1

  return {
    breakfast: `Local breakfast spot (₹${300 * budgetMultiplier})`,
    lunch: `Traditional ${destination} cuisine (₹${600 * budgetMultiplier})`,
    dinner: `Recommended restaurant (₹${900 * budgetMultiplier})`,
  }
}

function generateAccommodation(destination: string, budget: string) {
  const accommodations = {
    budget: `Budget hotel or hostel in ${destination} (₹2000-3000/night)`,
    "mid-range": `Mid-range hotel in ${destination} (₹4000-6000/night)`,
    luxury: `Luxury hotel or resort in ${destination} (₹8000-15000/night)`,
  }

  return accommodations[budget as keyof typeof accommodations] || accommodations.budget
}

function calculateBudget(duration: number, budget: string) {
  const dailyBudgets = {
    budget: 3000,
    "mid-range": 6000,
    luxury: 12000,
  }

  const dailyBudget = dailyBudgets[budget as keyof typeof dailyBudgets] || dailyBudgets.budget
  return dailyBudget * duration
}

function generateTips(destination: string, interests: string[]) {
  return [
    `Best time to visit ${destination} is during the cooler months`,
    "Book accommodations in advance for better rates",
    "Try local street food for authentic flavors",
    "Learn a few basic phrases in the local language",
    "Carry cash as some places may not accept cards",
    "Respect local customs and dress codes",
  ]
}
