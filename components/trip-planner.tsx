"use client"

import { useState } from "react"
import {
  MapPin,
  Users,
  Calendar,
  IndianRupee,
  Plane,
  Clock,
  Utensils,
  Hotel,
  Camera,
  Lightbulb,
  AlertTriangle,
  Cloud,
} from "lucide-react"
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Trip Planner ✈️</h2>
        <p className="text-gray-600">Get personalized travel plans with accurate costs in Indian Rupees</p>
      </div>

      {/* Trip Planning Form */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white">
          <CardTitle className="flex items-center">
            <Plane className="h-5 w-5 mr-2" />
            Plan Your Perfect Trip
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Destination
              </label>
              <Input
                placeholder="e.g., Goa, Manali, Kerala, Rajasthan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <IndianRupee className="h-4 w-4 inline mr-1" />
                Total Budget (₹)
              </label>
              <Input
                type="number"
                placeholder="e.g., 25000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="1000"
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
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
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
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
                className="text-lg"
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Your Perfect Trip Plan...
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
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Planning Your Amazing Trip...</h3>
            <p className="text-gray-600">Our AI is creating a personalized itinerary for {destination}</p>
          </CardContent>
        </Card>
      )}

      {/* Trip Plan Results */}
      {tripPlan && !loading && (
        <div className="space-y-6">
          {/* Trip Overview */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
              <h1 className="text-3xl font-bold mb-2">🎉 Your Trip to {tripPlan.destination}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-green-100">Total Budget</p>
                  <p className="text-xl font-bold">₹{tripPlan.totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-green-100">Per Person</p>
                  <p className="text-xl font-bold">₹{tripPlan.budgetPerPerson.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-green-100">Duration</p>
                  <p className="text-xl font-bold">{tripPlan.duration}</p>
                </div>
                <div>
                  <p className="text-green-100">Travelers</p>
                  <p className="text-xl font-bold">{tripPlan.travelers} people</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="budget" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="attractions">Places</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="budget">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <IndianRupee className="h-5 w-5 mr-2 text-green-600" />
                    Budget Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(tripPlan.budgetBreakdown).map(([category, details]) => (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold capitalize">{category}</h4>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600">{details.amount}</span>
                            <span className="text-sm text-gray-500 ml-2">({details.percentage})</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{details.details}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itinerary">
              <div className="space-y-4">
                {tripPlan.itinerary.map((day) => (
                  <Card key={day.day}>
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Day {day.day}: {day.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Activities */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Activities
                          </h4>
                          <div className="space-y-3">
                            {day.activities.map((activity, idx) => (
                              <div key={idx} className="border-l-4 border-blue-500 pl-4">
                                <div className="flex justify-between items-start mb-1">
                                  <h5 className="font-medium">
                                    {activity.time}: {activity.activity}
                                  </h5>
                                  <Badge variant="secondary">{activity.cost}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{activity.location}</p>
                                <p className="text-sm">{activity.description}</p>
                                <p className="text-xs text-blue-600 mt-1">💡 {activity.tips}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Meals */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Utensils className="h-4 w-4 mr-1" />
                            Meals
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {day.meals.map((meal, idx) => (
                              <div key={idx} className="bg-orange-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <h5 className="font-medium">{meal.type}</h5>
                                  <span className="text-sm font-semibold text-orange-600">{meal.cost}</span>
                                </div>
                                <p className="text-sm font-medium">{meal.restaurant}</p>
                                <p className="text-xs text-gray-600">{meal.location}</p>
                                <p className="text-xs text-orange-700 mt-1">🍽️ {meal.speciality}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Accommodation */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Hotel className="h-4 w-4 mr-1" />
                            Accommodation
                          </h4>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium">{day.accommodation.name}</h5>
                              <span className="font-semibold text-purple-600">{day.accommodation.cost}/night</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{day.accommodation.area}</p>
                            <div className="flex flex-wrap gap-1">
                              {day.accommodation.amenities.map((amenity, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hotel className="h-5 w-5 mr-2 text-purple-600" />
                    Accommodation Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tripPlan.accommodationOptions.map((hotel, idx) => (
                      <div key={idx} className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{hotel.name}</h4>
                            <p className="text-sm text-gray-600">{hotel.location}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                hotel.type === "Budget" ? "secondary" : hotel.type === "Luxury" ? "default" : "outline"
                              }
                            >
                              {hotel.type}
                            </Badge>
                            <p className="text-lg font-bold text-purple-600 mt-1">{hotel.pricePerNight}/night</p>
                            <p className="text-sm text-yellow-600">⭐ {hotel.rating}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {hotel.amenities.map((amenity, amenityIdx) => (
                            <Badge key={amenityIdx} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-purple-700">💡 {hotel.bookingTip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="food">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="h-5 w-5 mr-2 text-orange-600" />
                    Food Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tripPlan.foodRecommendations.map((food, idx) => (
                      <div key={idx} className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{food.name}</h4>
                            <p className="text-sm text-gray-600">{food.location}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {food.cuisine}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-orange-600">{food.averageCost}</p>
                            <p className="text-xs text-gray-500">{food.timing}</p>
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1">Must Try:</p>
                          <div className="flex flex-wrap gap-1">
                            {food.mustTry.map((dish, dishIdx) => (
                              <Badge key={dishIdx} variant="secondary" className="text-xs">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-red-600" />
                    Attractions & Places to Visit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tripPlan.attractions.map((attraction, idx) => (
                      <div key={idx} className="bg-red-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{attraction.name}</h4>
                            <p className="text-sm text-gray-600">{attraction.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-600">{attraction.entryFee}</p>
                            <p className="text-xs text-gray-500">{attraction.duration}</p>
                          </div>
                        </div>
                        <p className="text-sm mb-2">{attraction.description}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-red-700">🕒 Best time: {attraction.bestTime}</span>
                        </div>
                        {attraction.nearbyAttractions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-1">Nearby:</p>
                            <div className="flex flex-wrap gap-1">
                              {attraction.nearbyAttractions.map((nearby, nearbyIdx) => (
                                <Badge key={nearbyIdx} variant="outline" className="text-xs">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plane className="h-5 w-5 mr-2 text-blue-600" />
                    Transportation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* To Destination */}
                  <div>
                    <h4 className="font-semibold mb-3">Getting to {tripPlan.destination}</h4>
                    <div className="space-y-3">
                      {tripPlan.transportation.toDestination.options.map((option, idx) => (
                        <div key={idx} className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium">{option.mode}</h5>
                              <p className="text-sm text-gray-600">From: {option.from}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">{option.cost}</p>
                              <p className="text-xs text-gray-500">{option.duration}</p>
                            </div>
                          </div>
                          <p className="text-xs text-blue-700">💡 {option.bookingTips}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Local Transportation */}
                  <div>
                    <h4 className="font-semibold mb-3">Local Transportation</h4>
                    <div className="space-y-3">
                      {tripPlan.transportation.local.options.map((option, idx) => (
                        <div key={idx} className="bg-green-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium">{option.mode}</h5>
                              <p className="text-sm text-gray-600">Coverage: {option.coverage}</p>
                            </div>
                            <p className="font-semibold text-green-600">{option.cost}</p>
                          </div>
                          <p className="text-xs text-green-700">💡 {option.tips}</p>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-purple-600" />
                      Packing Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tripPlan.packingList.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Local Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                      Local Tips & Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tripPlan.localTips.map((tip, idx) => (
                        <div key={idx} className="flex items-start space-x-3 bg-yellow-50 p-3 rounded-lg">
                          <span className="text-yellow-600 font-bold text-sm">{idx + 1}</span>
                          <p className="text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                      Weather Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-medium mb-1">Current Season</h5>
                        <p className="text-sm">{tripPlan.weatherInfo.currentSeason}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-medium mb-1">What to Pack</h5>
                        <p className="text-sm">{tripPlan.weatherInfo.whatToPack}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-medium mb-1">Best Time to Visit</h5>
                        <p className="text-sm">{tripPlan.weatherInfo.bestTimeToVisit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                      Emergency Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h5 className="font-medium mb-1">Police</h5>
                        <p className="text-sm font-mono">{tripPlan.emergencyInfo.localPolice}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h5 className="font-medium mb-1">Tourist Helpline</h5>
                        <p className="text-sm font-mono">{tripPlan.emergencyInfo.touristHelpline}</p>
                      </div>
                    </div>
                    <div className="mt-3 bg-red-50 p-3 rounded-lg">
                      <h5 className="font-medium mb-1">Hospitals</h5>
                      <div className="text-sm">
                        {tripPlan.emergencyInfo.hospitals.map((hospital, idx) => (
                          <p key={idx}>{hospital}</p>
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
