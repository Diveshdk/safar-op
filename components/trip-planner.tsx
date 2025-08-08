"use client"

import { useState } from "react"
import { MapPin, Users, Calendar, IndianRupee, Plane, Clock, Utensils, Hotel, Camera, Lightbulb, AlertTriangle, Cloud } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface TripPlannerProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
}

interface TripPlan {
  destination: string
  totalBudget: number
  budgetPerPerson: number
  duration: string
  travelers: number
  budgetBreakdown: {
    accommodation: { amount: string; percentage: string; details: string }
    food: { amount: string; percentage: string; details: string }
    transportation: { amount: string; percentage: string; details: string }
    activities: { amount: string; percentage: string; details: string }
    miscellaneous: { amount: string; percentage: string; details: string }
  }
  itinerary: Array<{
    day: number
    title: string
    activities: Array<{
      time: string
      activity: string
      location: string
      cost: string
      description: string
      tips: string
    }>
    meals: Array<{
      type: string
      restaurant: string
      location: string
      cost: string
      speciality: string
    }>
    accommodation: {
      name: string
      area: string
      cost: string
      amenities: string[]
    }
  }>
  accommodationOptions: Array<{
    name: string
    type: string
    location: string
    pricePerNight: string
    amenities: string[]
    rating: string
    bookingTip: string
  }>
  foodRecommendations: Array<{
    name: string
    location: string
    cuisine: string
    mustTry: string[]
    averageCost: string
    timing: string
  }>
  attractions: Array<{
    name: string
    location: string
    entryFee: string
    bestTime: string
    duration: string
    description: string
    nearbyAttractions: string[]
  }>
  transportation: {
    toDestination: {
      options: Array<{
        mode: string
        from: string
        cost: string
        duration: string
        bookingTips: string
      }>
    }
    local: {
      options: Array<{
        mode: string
        cost: string
        coverage: string
        tips: string
      }>
    }
  }
  packingList: string[]
  localTips: string[]
  emergencyInfo: {
    localPolice: string
    touristHelpline: string
    hospitals: string[]
    embassies: string
  }
  weatherInfo: {
    currentSeason: string
    whatToPack: string
    bestTimeToVisit: string
  }
}

export default function TripPlanner({ currentLocation }: TripPlannerProps) {
  const [destination, setDestination] = useState("")
  const [budget, setBudget] = useState("")
  const [days, setDays] = useState("")
  const [people, setPeople] = useState("")
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlanTrip = async () => {
    if (!destination.trim() || !budget || !days || !people) {
      setError("Please fill in all fields")
      return
    }

    if (Number.parseInt(budget) < 1000) {
      setError("Budget should be at least ₹1,000")
      return
    }

    if (Number.parseInt(days) < 1 || Number.parseInt(days) > 30) {
      setError("Trip duration should be between 1-30 days")
      return
    }

    if (Number.parseInt(people) < 1 || Number.parseInt(people) > 20) {
      setError("Number of people should be between 1-20")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/trip-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: destination.trim(),
          budget: Number.parseInt(budget),
          days: Number.parseInt(days),
          people: Number.parseInt(people),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Planning failed: ${response.status}`)
      }

      setTripPlan(data)
    } catch (error) {
      console.error("Trip planning error:", error)
      setError(error instanceof Error ? error.message : "Failed to plan trip. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Professional Trip Planner</h2>
        <p className="text-slate-600">AI-powered travel planning with accurate cost analysis in Indian Rupees</p>
      </div>

      {/* Trip Planning Form */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-800 text-white">
          <CardTitle className="flex items-center">
            <Plane className="h-5 w-5 mr-2" />
            Plan Your Business Trip
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                <MapPin className="h-4 w-4 inline mr-1" />
                Destination
              </label>
              <Input
                placeholder="e.g., Goa, Manali, Kerala, Rajasthan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="text-lg border-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                <IndianRupee className="h-4 w-4 inline mr-1" />
                Total Budget (₹)
              </label>
              <Input
                type="number"
                placeholder="e.g., 25000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="1000"
                className="text-lg border-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                <Calendar className="h-4 w-4 inline mr-1" />
                Number of Days
              </label>
              <Input
                type="number"
                placeholder="e.g., 5"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                min="1"
                max="30"
                className="text-lg border-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                <Users className="h-4 w-4 inline mr-1" />
                Number of People
              </label>
              <Input
                type="number"
                placeholder="e.g., 2"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                min="1"
                max="20"
                className="text-lg border-slate-200"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handlePlanTrip}
            disabled={loading}
            className="w-full btn-primary text-lg py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Professional Trip Plan...
              </>
            ) : (
              <>
                <Plane className="h-5 w-5 mr-2" />
                Generate Trip Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Planning Your Professional Trip...</h3>
            <p className="text-slate-600">Creating a comprehensive itinerary for {destination}</p>
          </CardContent>
        </Card>
      )}

      {/* Trip Plan Results */}
      {tripPlan && !loading && (
        <div className="space-y-6">
          {/* Trip Overview */}
          <Card className="overflow-hidden border-slate-200">
            <div className="bg-slate-800 text-white p-6">
              <h1 className="text-3xl font-bold mb-2">Your Trip to {tripPlan.destination}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-200">Total Budget</p>
                  <p className="text-xl font-bold">₹{tripPlan.totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-200">Per Person</p>
                  <p className="text-xl font-bold">₹{tripPlan.budgetPerPerson.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-200">Duration</p>
                  <p className="text-xl font-bold">{tripPlan.duration}</p>
                </div>
                <div>
                  <p className="text-slate-200">Travelers</p>
                  <p className="text-xl font-bold">{tripPlan.travelers} people</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="budget" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-slate-100">
              <TabsTrigger value="budget" className="data-[state=active]:bg-white">Budget</TabsTrigger>
              <TabsTrigger value="itinerary" className="data-[state=active]:bg-white">Itinerary</TabsTrigger>
              <TabsTrigger value="hotels" className="data-[state=active]:bg-white">Hotels</TabsTrigger>
              <TabsTrigger value="food" className="data-[state=active]:bg-white">Food</TabsTrigger>
              <TabsTrigger value="attractions" className="data-[state=active]:bg-white">Places</TabsTrigger>
              <TabsTrigger value="transport" className="data-[state=active]:bg-white">Transport</TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-white">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="budget">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <IndianRupee className="h-5 w-5 mr-2 text-slate-600" />
                    Budget Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(tripPlan.budgetBreakdown).map(([category, details]) => (
                      <div key={category} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold capitalize text-slate-800">{category}</h4>
                          <div className="text-right">
                            <span className="text-lg font-bold text-slate-700">{details.amount}</span>
                            <span className="text-sm text-slate-500 ml-2">({details.percentage})</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{details.details}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itinerary">
              <div className="space-y-4">
                {tripPlan.itinerary.map((day) => (
                  <Card key={day.day} className="border-slate-200">
                    <CardHeader className="bg-slate-50">
                      <CardTitle className="flex items-center text-slate-800">
                        <Calendar className="h-5 w-5 mr-2 text-slate-600" />
                        Day {day.day}: {day.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Activities */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center text-slate-800">
                            <Clock className="h-4 w-4 mr-1" />
                            Activities
                          </h4>
                          <div className="space-y-3">
                            {day.activities.map((activity, idx) => (
                              <div key={idx} className="border-l-4 border-slate-500 pl-4">
                                <div className="flex justify-between items-start mb-1">
                                  <h5 className="font-medium text-slate-800">
                                    {activity.time}: {activity.activity}
                                  </h5>
                                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">{activity.cost}</Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-1">{activity.location}</p>
                                <p className="text-sm text-slate-700">{activity.description}</p>
                                <p className="text-xs text-slate-600 mt-1">💡 {activity.tips}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator className="bg-slate-200" />

                        {/* Meals */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center text-slate-800">
                            <Utensils className="h-4 w-4 mr-1" />
                            Meals
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {day.meals.map((meal, idx) => (
                              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-center mb-1">
                                  <h5 className="font-medium text-slate-800">{meal.type}</h5>
                                  <span className="text-sm font-semibold text-slate-600">{meal.cost}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">{meal.restaurant}</p>
                                <p className="text-xs text-slate-600">{meal.location}</p>
                                <p className="text-xs text-slate-700 mt-1">🍽️ {meal.speciality}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator className="bg-slate-200" />

                        {/* Accommodation */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center text-slate-800">
                            <Hotel className="h-4 w-4 mr-1" />
                            Accommodation
                          </h4>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-slate-800">{day.accommodation.name}</h5>
                              <span className="font-semibold text-slate-600">{day.accommodation.cost}/night</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{day.accommodation.area}</p>
                            <div className="flex flex-wrap gap-1">
                              {day.accommodation.amenities.map((amenity, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-slate-300 text-slate-600">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hotels">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Hotel className="h-5 w-5 mr-2 text-slate-600" />
                    Accommodation Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tripPlan.accommodationOptions.map((hotel, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-800">{hotel.name}</h4>
                            <p className="text-sm text-slate-600">{hotel.location}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                hotel.type === "Budget" ? "secondary" : hotel.type === "Luxury" ? "default" : "outline"
                              }
                              className="bg-slate-100 text-slate-700"
                            >
                              {hotel.type}
                            </Badge>
                            <p className="text-lg font-bold text-slate-600 mt-1">{hotel.pricePerNight}/night</p>
                            <p className="text-sm text-slate-500">⭐ {hotel.rating}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {hotel.amenities.map((amenity, amenityIdx) => (
                            <Badge key={amenityIdx} variant="outline" className="text-xs border-slate-300 text-slate-600">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-slate-700">💡 {hotel.bookingTip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="food">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Utensils className="h-5 w-5 mr-2 text-slate-600" />
                    Food Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tripPlan.foodRecommendations.map((food, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-800">{food.name}</h4>
                            <p className="text-sm text-slate-600">{food.location}</p>
                            <Badge variant="outline" className="text-xs mt-1 border-slate-300 text-slate-600">
                              {food.cuisine}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-600">{food.averageCost}</p>
                            <p className="text-xs text-slate-500">{food.timing}</p>
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1 text-slate-800">Must Try:</p>
                          <div className="flex flex-wrap gap-1">
                            {food.mustTry.map((dish, dishIdx) => (
                              <Badge key={dishIdx} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                {dish}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attractions">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Camera className="h-5 w-5 mr-2 text-slate-600" />
                    Attractions & Places to Visit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tripPlan.attractions.map((attraction, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-800">{attraction.name}</h4>
                            <p className="text-sm text-slate-600">{attraction.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-600">{attraction.entryFee}</p>
                            <p className="text-xs text-slate-500">{attraction.duration}</p>
                          </div>
                        </div>
                        <p className="text-sm mb-2 text-slate-700">{attraction.description}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-700">🕒 Best time: {attraction.bestTime}</span>
                        </div>
                        {attraction.nearbyAttractions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-1 text-slate-800">Nearby:</p>
                            <div className="flex flex-wrap gap-1">
                              {attraction.nearbyAttractions.map((nearby, nearbyIdx) => (
                                <Badge key={nearbyIdx} variant="outline" className="text-xs border-slate-300 text-slate-600">
                                  {nearby}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transport">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Plane className="h-5 w-5 mr-2 text-slate-600" />
                    Transportation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* To Destination */}
                  <div>
                    <h4 className="font-semibold mb-3 text-slate-800">Getting to {tripPlan.destination}</h4>
                    <div className="space-y-3">
                      {tripPlan.transportation.toDestination.options.map((option, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-slate-800">{option.mode}</h5>
                              <p className="text-sm text-slate-600">From: {option.from}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-600">{option.cost}</p>
                              <p className="text-xs text-slate-500">{option.duration}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-700">💡 {option.bookingTips}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />

                  {/* Local Transportation */}
                  <div>
                    <h4 className="font-semibold mb-3 text-slate-800">Local Transportation</h4>
                    <div className="space-y-3">
                      {tripPlan.transportation.local.options.map((option, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-slate-800">{option.mode}</h5>
                              <p className="text-sm text-slate-600">Coverage: {option.coverage}</p>
                            </div>
                            <p className="font-semibold text-slate-600">{option.cost}</p>
                          </div>
                          <p className="text-xs text-slate-700">💡 {option.tips}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips">
              <div className="space-y-6">
                {/* Packing List */}
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Camera className="h-5 w-5 mr-2 text-slate-600" />
                      Packing Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tripPlan.packingList.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-slate-300" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Local Tips */}
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Lightbulb className="h-5 w-5 mr-2 text-slate-600" />
                      Professional Tips & Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tripPlan.localTips.map((tip, idx) => (
                        <div key={idx} className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-600 font-bold text-sm">{idx + 1}</span>
                          <p className="text-sm text-slate-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Info */}
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Cloud className="h-5 w-5 mr-2 text-slate-600" />
                      Weather Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <h5 className="font-medium mb-1 text-slate-800">Current Season</h5>
                        <p className="text-sm text-slate-700">{tripPlan.weatherInfo.currentSeason}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <h5 className="font-medium mb-1 text-slate-800">What to Pack</h5>
                        <p className="text-sm text-slate-700">{tripPlan.weatherInfo.whatToPack}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <h5 className="font-medium mb-1 text-slate-800">Best Time to Visit</h5>
                        <p className="text-sm text-slate-700">{tripPlan.weatherInfo.bestTimeToVisit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Information */}
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <AlertTriangle className="h-5 w-5 mr-2 text-slate-600" />
                      Emergency Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <h5 className="font-medium mb-1 text-slate-800">Police</h5>
                        <p className="text-sm font-mono text-slate-700">{tripPlan.emergencyInfo.localPolice}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <h5 className="font-medium mb-1 text-slate-800">Tourist Helpline</h5>
                        <p className="text-sm font-mono text-slate-700">{tripPlan.emergencyInfo.touristHelpline}</p>
                      </div>
                    </div>
                    <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <h5 className="font-medium mb-1 text-slate-800">Hospitals</h5>
                      <div className="text-sm">
                        {tripPlan.emergencyInfo.hospitals.map((hospital, idx) => (
                          <p key={idx} className="text-slate-700">{hospital}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
