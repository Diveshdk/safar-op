import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { destination, budget, days, people } = await request.json()

    if (!destination || !days || !budget || !people) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 })
    }

    // Generate comprehensive trip plan
    const tripPlan = generateTripPlan(destination, days, people, budget)

    return NextResponse.json(tripPlan)
  } catch (error) {
    console.error("Error in trip planner API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateTripPlan(destination: string, days: number, people: number, budget: number) {
  const budgetPerPerson = Math.round(budget / people)

  return {
    destination,
    totalBudget: budget,
    budgetPerPerson,
    duration: `${days} days`,
    travelers: people,
    budgetBreakdown: generateBudgetBreakdown(budget),
    itinerary: generateItinerary(destination, days, budget),
    accommodationOptions: generateAccommodationOptions(destination, budget),
    foodRecommendations: generateFoodRecommendations(destination),
    attractions: generateAttractions(destination),
    transportation: generateTransportation(destination),
    packingList: generatePackingList(destination),
    localTips: generateTips(destination),
    emergencyInfo: generateEmergencyInfo(destination),
    weatherInfo: generateWeatherInfo(destination),
  }
}

function generateBudgetBreakdown(budget: number) {
  return {
    accommodation: {
      amount: `₹${Math.round(budget * 0.35).toLocaleString()}`,
      percentage: "35%",
      details: "Hotels, guesthouses, and lodging expenses",
    },
    food: {
      amount: `₹${Math.round(budget * 0.25).toLocaleString()}`,
      percentage: "25%",
      details: "Meals, snacks, and local cuisine experiences",
    },
    transportation: {
      amount: `₹${Math.round(budget * 0.2).toLocaleString()}`,
      percentage: "20%",
      details: "Flights, trains, local transport, and fuel",
    },
    activities: {
      amount: `₹${Math.round(budget * 0.15).toLocaleString()}`,
      percentage: "15%",
      details: "Sightseeing, tours, and entertainment",
    },
    miscellaneous: {
      amount: `₹${Math.round(budget * 0.05).toLocaleString()}`,
      percentage: "5%",
      details: "Shopping, tips, and unexpected expenses",
    },
  }
}

function generateItinerary(destination: string, days: number, budget: number) {
  const itinerary = []

  for (let day = 1; day <= days; day++) {
    itinerary.push({
      day,
      title: `Exploring ${destination}`,
      activities: [
        {
          time: "9:00 AM",
          activity: "Morning sightseeing",
          location: `Popular attractions in ${destination}`,
          cost: "₹500-1000",
          description: "Visit the most famous landmarks and take photos",
          tips: "Start early to avoid crowds and heat",
        },
        {
          time: "2:00 PM",
          activity: "Local cultural experience",
          location: "Cultural sites and museums",
          cost: "₹300-800",
          description: "Immerse yourself in local history and culture",
          tips: "Hire a local guide for better insights",
        },
        {
          time: "6:00 PM",
          activity: "Evening leisure",
          location: "Local markets or scenic spots",
          cost: "₹200-500",
          description: "Relax and enjoy the local atmosphere",
          tips: "Perfect time for shopping and street food",
        },
      ],
      meals: [
        {
          type: "Breakfast",
          restaurant: "Local breakfast spot",
          location: `Near your hotel in ${destination}`,
          cost: "₹200-400",
          speciality: "Traditional breakfast items",
        },
        {
          type: "Lunch",
          restaurant: "Popular local restaurant",
          location: "City center",
          cost: "₹400-800",
          speciality: "Regional specialties",
        },
        {
          type: "Dinner",
          restaurant: "Recommended dining",
          location: "Tourist area",
          cost: "₹600-1200",
          speciality: "Local cuisine highlights",
        },
      ],
      accommodation: {
        name: `${destination} Hotel`,
        area: "Central location",
        cost: `₹${Math.round((budget * 0.35) / days).toLocaleString()}`,
        amenities: ["WiFi", "AC", "Room Service", "Parking"],
      },
    })
  }

  return itinerary
}

function generateAccommodationOptions(destination: string, budget: number) {
  const dailyBudget = Math.round((budget * 0.35) / 7) // Assuming average 7 days

  return [
    {
      name: `Budget Stay ${destination}`,
      type: "Budget",
      location: "City outskirts",
      pricePerNight: `₹${Math.round(dailyBudget * 0.6).toLocaleString()}`,
      amenities: ["WiFi", "Basic AC", "Clean rooms"],
      rating: "3.5",
      bookingTip: "Book in advance for better rates",
    },
    {
      name: `Mid-Range Hotel ${destination}`,
      type: "Mid-Range",
      location: "City center",
      pricePerNight: `₹${dailyBudget.toLocaleString()}`,
      amenities: ["WiFi", "AC", "Restaurant", "Room Service"],
      rating: "4.0",
      bookingTip: "Check for package deals including meals",
    },
    {
      name: `Luxury Resort ${destination}`,
      type: "Luxury",
      location: "Premium area",
      pricePerNight: `₹${Math.round(dailyBudget * 1.8).toLocaleString()}`,
      amenities: ["WiFi", "AC", "Spa", "Pool", "Fine Dining"],
      rating: "4.5",
      bookingTip: "Look for off-season discounts",
    },
  ]
}

function generateFoodRecommendations(destination: string) {
  return [
    {
      name: `${destination} Street Food Hub`,
      location: "Main market area",
      cuisine: "Local Street Food",
      mustTry: ["Local snacks", "Traditional sweets", "Regional drinks"],
      averageCost: "₹100-300",
      timing: "Evening 5-10 PM",
    },
    {
      name: `Traditional ${destination} Restaurant`,
      location: "Heritage area",
      cuisine: "Regional Cuisine",
      mustTry: ["Signature dishes", "Local thali", "Traditional desserts"],
      averageCost: "₹400-800",
      timing: "Lunch & Dinner",
    },
    {
      name: "Rooftop Dining Experience",
      location: "City center",
      cuisine: "Multi-cuisine",
      mustTry: ["Continental", "Indian", "Local fusion"],
      averageCost: "₹800-1500",
      timing: "Dinner with city views",
    },
  ]
}

function generateAttractions(destination: string) {
  return [
    {
      name: `${destination} Heritage Site`,
      location: "Historic district",
      entryFee: "₹50-200",
      bestTime: "Morning 8-11 AM",
      duration: "2-3 hours",
      description: "Explore the rich history and architecture",
      nearbyAttractions: ["Museum", "Local market", "Photo spots"],
    },
    {
      name: `${destination} Natural Wonder`,
      location: "Scenic area",
      entryFee: "₹100-300",
      bestTime: "Sunrise or Sunset",
      duration: "3-4 hours",
      description: "Experience natural beauty and tranquility",
      nearbyAttractions: ["Viewpoints", "Nature trails", "Local cafes"],
    },
    {
      name: "Cultural Experience Center",
      location: "Cultural district",
      entryFee: "₹150-400",
      bestTime: "Afternoon 2-5 PM",
      duration: "2-3 hours",
      description: "Learn about local traditions and crafts",
      nearbyAttractions: ["Craft shops", "Art galleries", "Performance venues"],
    },
  ]
}

function generateTransportation(destination: string) {
  return {
    toDestination: {
      options: [
        {
          mode: "Flight",
          from: "Major cities",
          cost: "₹3000-8000",
          duration: "1-3 hours",
          bookingTips: "Book 2-3 weeks in advance for better prices",
        },
        {
          mode: "Train",
          from: "Railway network",
          cost: "₹500-2000",
          duration: "4-12 hours",
          bookingTips: "Book tickets 60 days in advance",
        },
        {
          mode: "Bus",
          from: "State transport",
          cost: "₹300-1000",
          duration: "6-15 hours",
          bookingTips: "Choose reputable operators for comfort",
        },
      ],
    },
    local: {
      options: [
        {
          mode: "Auto Rickshaw",
          cost: "₹10-15 per km",
          coverage: "Short distances",
          tips: "Negotiate fare beforehand or use meter",
        },
        {
          mode: "Local Bus",
          cost: "₹5-20 per ride",
          coverage: "City-wide",
          tips: "Economical but can be crowded",
        },
        {
          mode: "Taxi/Cab",
          cost: "₹12-20 per km",
          coverage: "Door-to-door",
          tips: "Use app-based services for transparency",
        },
      ],
    },
  }
}

function generatePackingList(destination: string) {
  return [
    "Comfortable walking shoes",
    "Light cotton clothes",
    "Sunscreen and sunglasses",
    "Hat or cap",
    "Camera or smartphone",
    "Portable charger",
    "First aid kit",
    "Personal medications",
    "Hand sanitizer",
    "Reusable water bottle",
    "Local guidebook or maps",
    "Cash and cards",
    "Travel documents",
    "Light jacket for evenings",
    "Umbrella or raincoat",
  ]
}

function generateTips(destination: string) {
  return [
    `Research ${destination}'s local customs and traditions before visiting`,
    "Learn basic phrases in the local language for better interaction",
    "Always carry cash as some places may not accept cards",
    "Dress modestly when visiting religious sites",
    "Try local street food but choose busy stalls for freshness",
    "Bargain politely in local markets - it's often expected",
    "Keep copies of important documents in separate bags",
    "Stay hydrated and take breaks during sightseeing",
    "Respect photography rules at monuments and religious places",
    "Book popular attractions in advance to avoid disappointment",
  ]
}

function generateEmergencyInfo(destination: string) {
  return {
    localPolice: "100",
    touristHelpline: "1363",
    hospitals: [
      `${destination} General Hospital - Emergency: 102`,
      `${destination} Medical Center - 24/7 Service`,
      "Private Hospital - Multi-specialty care",
    ],
    embassies: "Contact your embassy through official website",
  }
}

function generateWeatherInfo(destination: string) {
  return {
    currentSeason: "Check current weather conditions before travel",
    whatToPack: "Light cotton clothes, sunscreen, and light jacket for evenings",
    bestTimeToVisit: "October to March for pleasant weather in most Indian destinations",
  }
}
