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
  const destinationData = getDestinationData(destination.toLowerCase())

  return {
    destination,
    totalBudget: budget,
    budgetPerPerson,
    duration: `${days} days`,
    travelers: people,
    budgetBreakdown: generateBudgetBreakdown(budget),
    itinerary: generateDetailedItinerary(destinationData, days, budget, people),
    accommodationOptions: generateRealAccommodationOptions(destinationData, budget, days),
    foodRecommendations: generateRealFoodRecommendations(destinationData),
    attractions: generateRealAttractions(destinationData),
    transportation: generateRealTransportation(destinationData),
    packingList: generateDestinationPackingList(destinationData),
    localTips: generateRealTips(destinationData),
    emergencyInfo: generateRealEmergencyInfo(destinationData),
    weatherInfo: generateRealWeatherInfo(destinationData),
  }
}

function getDestinationData(destination: string) {
  const destinations: { [key: string]: any } = {
    goa: {
      name: "Goa",
      type: "beach",
      mainAreas: ["North Goa", "South Goa", "Panaji"],
      famousPlaces: [
        "Baga Beach",
        "Calangute Beach",
        "Anjuna Beach",
        "Basilica of Bom Jesus",
        "Fort Aguada",
        "Dudhsagar Falls",
      ],
      hotels: {
        budget: ["Zostel Goa", "Backpacker Panda", "Hotel Palacio de Goa"],
        midRange: ["The Park Calangute", "Lemon Tree Hotel", "Novotel Goa Resort"],
        luxury: ["Taj Exotica Resort", "The Leela Goa", "Grand Hyatt Goa"],
      },
      restaurants: ["Thalassa", "Curlies Beach Shack", "Fisherman's Wharf", "Vinayak Family Restaurant"],
      localFood: ["Fish Curry Rice", "Bebinca", "Feni", "Prawn Balchão"],
      bestTime: "November to February",
      climate: "tropical",
    },
    kerala: {
      name: "Kerala",
      type: "backwaters",
      mainAreas: ["Kochi", "Munnar", "Alleppey", "Thekkady"],
      famousPlaces: [
        "Alleppey Backwaters",
        "Munnar Tea Gardens",
        "Periyar Wildlife Sanctuary",
        "Fort Kochi",
        "Vembanad Lake",
      ],
      hotels: {
        budget: ["Backwater Ripples", "Tea Valley Resort", "Spice Village"],
        midRange: ["Fragrant Nature Backwater Resort", "Club Mahindra Munnar", "The Gateway Hotel"],
        luxury: ["Kumarakom Lake Resort", "Taj Malabar Resort", "Spice Village CGH Earth"],
      },
      restaurants: ["Dhe Puttu", "Kayees Biryani", "Paragon Restaurant", "Villa Maya"],
      localFood: ["Appam with Stew", "Kerala Fish Curry", "Puttu", "Payasam"],
      bestTime: "October to March",
      climate: "tropical",
    },
    rajasthan: {
      name: "Rajasthan",
      type: "heritage",
      mainAreas: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"],
      famousPlaces: [
        "Amber Fort",
        "City Palace Udaipur",
        "Mehrangarh Fort",
        "Thar Desert",
        "Hawa Mahal",
        "Lake Pichola",
      ],
      hotels: {
        budget: ["Zostel Jaipur", "Hotel Pearl Palace", "Shahi Palace"],
        midRange: ["Hotel Clarks Amer", "Hilltop Palace", "Hotel Udai Kothi"],
        luxury: ["Taj Lake Palace", "Umaid Bhawan Palace", "The Oberoi Udaivilas"],
      },
      restaurants: ["Chokhi Dhani", "1135 AD", "Ambrai Restaurant", "Laxmi Mishthan Bhandar"],
      localFood: ["Dal Baati Churma", "Laal Maas", "Gatte ki Sabzi", "Ghevar"],
      bestTime: "October to March",
      climate: "desert",
    },
    manali: {
      name: "Manali",
      type: "mountain",
      mainAreas: ["Old Manali", "Mall Road", "Solang Valley", "Rohtang Pass"],
      famousPlaces: ["Rohtang Pass", "Solang Valley", "Hadimba Temple", "Vashisht Hot Springs", "Beas River"],
      hotels: {
        budget: ["Zostel Manali", "Hotel Snow Peak", "Apple Country Resort"],
        midRange: ["The Himalayan", "Johnson Lodge", "Hotel Holiday Manali"],
        luxury: ["The Oberoi Cecil", "Span Resort & Spa", "Manuallaya Resort"],
      },
      restaurants: ["Johnson's Cafe", "Cafe 1947", "The Lazy Dog", "Dylan's Toasted & Roasted"],
      localFood: ["Siddu", "Thukpa", "Momos", "Trout Fish"],
      bestTime: "March to June, September to November",
      climate: "mountain",
    },
    agra: {
      name: "Agra",
      type: "heritage",
      mainAreas: ["Taj Ganj", "Sadar Bazaar", "Fatehabad Road"],
      famousPlaces: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh", "Itmad-ud-Daulah"],
      hotels: {
        budget: ["Hotel Kamal", "Hotel Sidhartha", "Zostel Agra"],
        midRange: ["Hotel Clarks Shiraz", "The Gateway Hotel", "Crystal Sarovar Premiere"],
        luxury: ["The Oberoi Amarvilas", "ITC Mughal", "Taj Hotel & Convention Centre"],
      },
      restaurants: ["Pinch of Spice", "Peshawri", "Joney's Place", "Dasaprakash"],
      localFood: ["Petha", "Mughlai Cuisine", "Bedai", "Jalebi"],
      bestTime: "October to March",
      climate: "continental",
    },
  }

  // Default data for destinations not in our database
  const defaultData = {
    name: destination,
    type: "general",
    mainAreas: [`Central ${destination}`, `Old ${destination}`, `New ${destination}`],
    famousPlaces: [`${destination} Fort`, `${destination} Palace`, `${destination} Market`, `${destination} Temple`],
    hotels: {
      budget: [`Budget Inn ${destination}`, `Backpacker Lodge ${destination}`, `Economy Hotel ${destination}`],
      midRange: [`Hotel ${destination} Grand`, `The Gateway ${destination}`, `Park Inn ${destination}`],
      luxury: [`Taj ${destination}`, `The Oberoi ${destination}`, `ITC ${destination}`],
    },
    restaurants: [`Local Restaurant ${destination}`, `Heritage Dining ${destination}`, `Rooftop Cafe ${destination}`],
    localFood: ["Local Specialties", "Regional Cuisine", "Traditional Dishes"],
    bestTime: "October to March",
    climate: "moderate",
  }

  return destinations[destination] || defaultData
}

function generateDetailedItinerary(destinationData: any, days: number, budget: number, people: number) {
  const itinerary = []
  const dailyBudget = Math.round(budget / days / people)

  for (let day = 1; day <= days; day++) {
    const dayPlan = generateDayPlan(destinationData, day, days, dailyBudget)
    itinerary.push(dayPlan)
  }

  return itinerary
}

function generateDayPlan(destinationData: any, day: number, totalDays: number, dailyBudget: number) {
  const places = destinationData.famousPlaces
  const restaurants = destinationData.restaurants
  const areas = destinationData.mainAreas

  let dayTitle = ""
  let activities = []

  if (day === 1) {
    dayTitle = `Arrival & ${areas[0]} Exploration`
    activities = [
      {
        time: "10:00 AM",
        activity: `Check-in and ${areas[0]} Walking Tour`,
        location: areas[0],
        cost: "₹200-500",
        description: `Settle into your accommodation and explore the vibrant ${areas[0]} area`,
        tips: "Keep your luggage at hotel reception if check-in isn't ready",
      },
      {
        time: "2:00 PM",
        activity: `Visit ${places[0]}`,
        location: places[0],
        cost: "₹300-800",
        description: `Explore the iconic ${places[0]} and learn about its history`,
        tips: "Hire a local guide for detailed historical insights",
      },
      {
        time: "6:00 PM",
        activity: "Local Market Shopping",
        location: `${destinationData.name} Main Market`,
        cost: "₹500-1500",
        description: "Shop for local handicrafts and souvenirs",
        tips: "Bargain politely - start at 50% of quoted price",
      },
    ]
  } else if (day === totalDays) {
    dayTitle = `Final Exploration & Departure`
    activities = [
      {
        time: "9:00 AM",
        activity: `Last visit to ${places[Math.min(places.length - 1, 2)]}`,
        location: places[Math.min(places.length - 1, 2)],
        cost: "₹200-600",
        description: "Final sightseeing before departure",
        tips: "Keep departure time in mind while planning",
      },
      {
        time: "12:00 PM",
        activity: "Souvenir Shopping",
        location: "Local markets",
        cost: "₹300-1000",
        description: "Last-minute shopping for gifts and memories",
        tips: "Pack fragile items carefully in your luggage",
      },
      {
        time: "4:00 PM",
        activity: "Departure Preparation",
        location: "Hotel/Transport hub",
        cost: "₹100-300",
        description: "Check-out and head to departure point",
        tips: "Keep buffer time for traffic and check-in procedures",
      },
    ]
  } else {
    const placeIndex = (day - 1) % places.length
    const areaIndex = (day - 1) % areas.length
    dayTitle = `${places[placeIndex]} & ${areas[areaIndex]} Discovery`
    activities = [
      {
        time: "9:00 AM",
        activity: `Explore ${places[placeIndex]}`,
        location: places[placeIndex],
        cost: "₹400-1000",
        description: `Detailed exploration of ${places[placeIndex]} with photography`,
        tips: "Visit early morning for better lighting and fewer crowds",
      },
      {
        time: "1:00 PM",
        activity: `${areas[areaIndex]} Cultural Walk`,
        location: areas[areaIndex],
        cost: "₹200-500",
        description: `Immerse in local culture and architecture of ${areas[areaIndex]}`,
        tips: "Interact with locals to learn about traditions",
      },
      {
        time: "5:00 PM",
        activity:
          destinationData.type === "beach"
            ? "Beach Activities"
            : destinationData.type === "mountain"
              ? "Nature Walk"
              : destinationData.type === "heritage"
                ? "Heritage Site Visit"
                : "Local Experience",
        location:
          destinationData.type === "beach"
            ? "Beach area"
            : destinationData.type === "mountain"
              ? "Nature trails"
              : destinationData.type === "heritage"
                ? "Historical sites"
                : "Local attractions",
        cost: "₹300-800",
        description:
          destinationData.type === "beach"
            ? "Water sports and beach relaxation"
            : destinationData.type === "mountain"
              ? "Scenic walks and mountain views"
              : destinationData.type === "heritage"
                ? "Historical exploration"
                : "Local cultural activities",
        tips:
          destinationData.type === "beach"
            ? "Apply sunscreen and stay hydrated"
            : destinationData.type === "mountain"
              ? "Wear comfortable shoes and carry water"
              : "Respect local customs and photography rules",
      },
    ]
  }

  return {
    day,
    title: dayTitle,
    activities,
    meals: [
      {
        type: "Breakfast",
        restaurant: day === 1 ? "Hotel Restaurant" : restaurants[Math.min(day - 2, restaurants.length - 1)],
        location: `Near ${areas[0]}`,
        cost: `₹${Math.round(dailyBudget * 0.15)}-${Math.round(dailyBudget * 0.25)}`,
        speciality: destinationData.localFood[0] || "Local breakfast items",
      },
      {
        type: "Lunch",
        restaurant: restaurants[Math.min(day - 1, restaurants.length - 1)],
        location: areas[(day - 1) % areas.length],
        cost: `₹${Math.round(dailyBudget * 0.25)}-${Math.round(dailyBudget * 0.35)}`,
        speciality: destinationData.localFood[1] || "Regional specialties",
      },
      {
        type: "Dinner",
        restaurant: restaurants[Math.min(day % restaurants.length, restaurants.length - 1)],
        location: "Popular dining area",
        cost: `₹${Math.round(dailyBudget * 0.3)}-${Math.round(dailyBudget * 0.45)}`,
        speciality: destinationData.localFood[2] || "Local dinner cuisine",
      },
    ],
    accommodation: {
      name: destinationData.hotels.midRange[0],
      area: areas[0],
      cost: `₹${Math.round(dailyBudget * 0.4)}-${Math.round(dailyBudget * 0.6)}`,
      amenities: ["WiFi", "AC", "Room Service", "Restaurant", "Parking"],
    },
  }
}

function generateRealAccommodationOptions(destinationData: any, budget: number, days: number) {
  const dailyAccommodationBudget = Math.round((budget * 0.35) / days)

  return [
    {
      name: destinationData.hotels.budget[0],
      type: "Budget",
      location: destinationData.mainAreas[0],
      pricePerNight: `₹${Math.round(dailyAccommodationBudget * 0.5)}-${Math.round(dailyAccommodationBudget * 0.7)}`,
      amenities: ["WiFi", "Basic AC", "Clean Rooms", "24/7 Reception"],
      rating: "3.5-4.0",
      bookingTip: "Book directly for better rates, check for group discounts",
    },
    {
      name: destinationData.hotels.midRange[0],
      type: "Mid-Range",
      location: destinationData.mainAreas[1] || destinationData.mainAreas[0],
      pricePerNight: `₹${Math.round(dailyAccommodationBudget * 0.8)}-${Math.round(dailyAccommodationBudget * 1.2)}`,
      amenities: ["WiFi", "AC", "Restaurant", "Room Service", "Parking", "Gym"],
      rating: "4.0-4.5",
      bookingTip: "Look for package deals including breakfast and airport transfers",
    },
    {
      name: destinationData.hotels.luxury[0],
      type: "Luxury",
      location: "Premium location",
      pricePerNight: `₹${Math.round(dailyAccommodationBudget * 1.5)}-${Math.round(dailyAccommodationBudget * 2.5)}`,
      amenities: ["WiFi", "AC", "Spa", "Pool", "Fine Dining", "Concierge", "Butler Service"],
      rating: "4.5-5.0",
      bookingTip: "Book well in advance, check for seasonal offers and loyalty programs",
    },
  ]
}

function generateRealFoodRecommendations(destinationData: any) {
  return destinationData.restaurants.slice(0, 3).map((restaurant: string, index: number) => ({
    name: restaurant,
    location: destinationData.mainAreas[index % destinationData.mainAreas.length],
    cuisine: index === 0 ? "Local Specialties" : index === 1 ? "Traditional" : "Multi-cuisine",
    mustTry: destinationData.localFood.slice(index, index + 2),
    averageCost: index === 0 ? "₹200-500" : index === 1 ? "₹400-800" : "₹600-1200",
    timing: index === 0 ? "All day" : index === 1 ? "Lunch & Dinner" : "Dinner only",
  }))
}

function generateRealAttractions(destinationData: any) {
  return destinationData.famousPlaces.slice(0, 4).map((place: string, index: number) => ({
    name: place,
    location: destinationData.mainAreas[index % destinationData.mainAreas.length],
    entryFee: index === 0 ? "₹50-200" : index === 1 ? "₹100-300" : index === 2 ? "₹150-400" : "₹200-500",
    bestTime: index % 2 === 0 ? "Morning 8-11 AM" : "Evening 4-7 PM",
    duration: "2-3 hours",
    description: `Experience the beauty and significance of ${place}, one of ${destinationData.name}'s most iconic attractions`,
    nearbyAttractions: destinationData.famousPlaces.filter((_: any, i: number) => i !== index).slice(0, 2),
  }))
}

function generateRealTransportation(destinationData: any) {
  const transportCosts = {
    flight: destinationData.type === "mountain" ? "₹4000-12000" : "₹3000-8000",
    train: destinationData.type === "mountain" ? "₹800-2500" : "₹500-2000",
    bus: destinationData.type === "mountain" ? "₹500-1500" : "₹300-1000",
  }

  return {
    toDestination: {
      options: [
        {
          mode: "Flight",
          from: "Major Indian cities",
          cost: transportCosts.flight,
          duration: "1-3 hours",
          bookingTips: `Book flights to ${destinationData.name} 2-3 weeks in advance for better prices`,
        },
        {
          mode: "Train",
          from: "Railway network",
          cost: transportCosts.train,
          duration: "4-15 hours",
          bookingTips: `Check IRCTC for direct trains to ${destinationData.name}, book 60 days in advance`,
        },
        {
          mode: "Bus",
          from: "State transport",
          cost: transportCosts.bus,
          duration: "6-20 hours",
          bookingTips: `Choose Volvo or semi-sleeper buses for comfort to ${destinationData.name}`,
        },
      ],
    },
    local: {
      options: [
        {
          mode: destinationData.type === "beach" ? "Scooter Rental" : "Auto Rickshaw",
          cost: destinationData.type === "beach" ? "₹300-500/day" : "₹10-15/km",
          coverage: destinationData.type === "beach" ? "Beach areas" : "Short distances",
          tips:
            destinationData.type === "beach"
              ? "Rent from licensed operators, wear helmet"
              : "Negotiate fare or use meter",
        },
        {
          mode: "Local Bus",
          cost: "₹5-25/ride",
          coverage: `${destinationData.name} city area`,
          tips: "Economical but can be crowded during peak hours",
        },
        {
          mode: "Taxi/Cab",
          cost: "₹12-25/km",
          coverage: "Door-to-door service",
          tips: "Use Ola/Uber for transparent pricing and safety",
        },
      ],
    },
  }
}

function generateBudgetBreakdown(budget: number) {
  return {
    accommodation: {
      amount: `₹${Math.round(budget * 0.35).toLocaleString()}`,
      percentage: "35%",
      details: "Hotels, guesthouses, and lodging expenses including taxes",
    },
    food: {
      amount: `₹${Math.round(budget * 0.25).toLocaleString()}`,
      percentage: "25%",
      details: "All meals, snacks, beverages, and local cuisine experiences",
    },
    transportation: {
      amount: `₹${Math.round(budget * 0.2).toLocaleString()}`,
      percentage: "20%",
      details: "Flights/trains to destination, local transport, and fuel costs",
    },
    activities: {
      amount: `₹${Math.round(budget * 0.15).toLocaleString()}`,
      percentage: "15%",
      details: "Entry fees, tours, activities, and entertainment expenses",
    },
    miscellaneous: {
      amount: `₹${Math.round(budget * 0.05).toLocaleString()}`,
      percentage: "5%",
      details: "Shopping, tips, emergency funds, and unexpected expenses",
    },
  }
}

function generateDestinationPackingList(destinationData: any) {
  const baseItems = [
    "Comfortable walking shoes",
    "Camera or smartphone with extra storage",
    "Portable charger and power bank",
    "First aid kit and personal medications",
    "Hand sanitizer and wet wipes",
    "Reusable water bottle",
    "Travel documents and photocopies",
    "Cash and multiple payment cards",
  ]

  const climateSpecific = {
    tropical: ["Light cotton clothes", "Sunscreen SPF 30+", "Umbrella/raincoat", "Mosquito repellent"],
    desert: ["Light layers for day", "Warm clothes for night", "Sunglasses", "Scarf for dust protection"],
    mountain: ["Warm jackets", "Layered clothing", "Gloves and cap", "Sturdy trekking shoes"],
    beach: ["Swimwear", "Beach towel", "Flip-flops", "Waterproof bag"],
    moderate: ["Light jacket", "Comfortable clothes", "Sunglasses", "Light scarf"],
  }

  return [
    ...baseItems,
    ...(climateSpecific[destinationData.climate as keyof typeof climateSpecific] || climateSpecific.moderate),
  ]
}

function generateRealTips(destinationData: any) {
  const baseTips = [
    `Best time to visit ${destinationData.name} is ${destinationData.bestTime}`,
    "Book accommodations and transport in advance during peak season",
    "Learn basic local phrases - locals appreciate the effort",
    "Always carry cash as some places don't accept cards",
    "Respect local customs, especially at religious sites",
  ]

  const destinationSpecific = {
    beach: ["Apply sunscreen regularly", "Stay hydrated", "Be cautious of water activities"],
    mountain: ["Acclimatize gradually to altitude", "Carry warm clothes", "Check weather conditions"],
    heritage: ["Hire certified guides for historical insights", "Photography may be restricted", "Dress modestly"],
    general: ["Try local street food from busy stalls", "Bargain politely in markets", "Keep emergency contacts handy"],
  }

  const typeSpecific =
    destinationSpecific[destinationData.type as keyof typeof destinationSpecific] || destinationSpecific.general

  return [...baseTips, ...typeSpecific]
}

function generateRealEmergencyInfo(destinationData: any) {
  return {
    localPolice: "100 (National Emergency)",
    touristHelpline: "1363 (Tourist Helpline)",
    hospitals: [
      `${destinationData.name} Government Hospital - 102`,
      `${destinationData.name} Medical College - Emergency Ward`,
      `Private Multi-specialty Hospital ${destinationData.name}`,
    ],
    embassies: "Contact your country's embassy through official government website",
  }
}

function generateRealWeatherInfo(destinationData: any) {
  const weatherInfo = {
    tropical: {
      currentSeason: "Warm and humid with occasional rains",
      whatToPack: "Light cotton clothes, umbrella, sunscreen, and mosquito repellent",
      bestTimeToVisit: "November to February for pleasant weather",
    },
    desert: {
      currentSeason: "Hot days and cool nights with minimal rainfall",
      whatToPack: "Light layers for day, warm clothes for night, sunglasses, and scarf",
      bestTimeToVisit: "October to March when temperatures are moderate",
    },
    mountain: {
      currentSeason: "Cool to cold with possible snowfall at higher altitudes",
      whatToPack: "Warm jackets, layered clothing, gloves, cap, and sturdy shoes",
      bestTimeToVisit: "March to June and September to November",
    },
    moderate: {
      currentSeason: "Pleasant weather with moderate temperatures",
      whatToPack: "Comfortable clothes, light jacket for evenings, and sunglasses",
      bestTimeToVisit: "October to March for ideal weather conditions",
    },
  }

  return weatherInfo[destinationData.climate as keyof typeof weatherInfo] || weatherInfo.moderate
}
