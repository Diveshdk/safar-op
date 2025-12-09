"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, MapPin, Users, DollarSign, Plane, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TripPlannerProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
}

interface TripPlan {
  tripOverview: {
    destination: string
    duration: number
    startDate: string
    endDate: string
    summary: string
    highlights: string[]
    totalEstimatedCost: string
    bestTimeToVisit: string
  }
  dailyItinerary: Array<{
    day: number
    date: string
    title: string
    activities: Array<{
      time: string
      activity: string
      location: string
      duration: string
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
      hotel: string
      location: string
      checkIn: string
      cost: string
    }
  }>
  accommodationDetails: Array<{
    name: string
    type: string
    location: string
    pricePerNight: string
    totalNights: number
    totalCost: string
    amenities: string[]
    bookingTips: string
    alternatives: string[]
  }>
  transportation: {
    toDestination: {
      method: string
      details: string
      cost: string
      duration: string
      bookingTips: string
    }
    localTransport: Array<{
      method: string
      cost: string
      tips: string
    }>
    fromDestination: {
      method: string
      cost: string
      bookingTips: string
    }
  }
  budgetBreakdown: {
    accommodation: string
    transportation: string
    food: string
    activities: string
    shopping: string
    miscellaneous: string
    total: string
    dailyAverage: string
    budgetTips: string[]
  }
  packingList: {
    clothing: string[]
    electronics: string[]
    documents: string[]
    healthAndSafety: string[]
    miscellaneous: string[]
    weatherSpecific: string[]
  }
  importantTips: string[]
  emergencyInfo: {
    localEmergency: string
    nearestHospital: string
    embassy: string
    importantContacts: string[]
    safetyTips: string[]
  }
  bookingChecklist: Array<{
    item: string
    deadline: string
    priority: string
  }>
}

export default function TripPlanner({ currentLocation }: TripPlannerProps) {
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState("Moderate")
  const [travelers, setTravelers] = useState("1")
  const [preferences, setPreferences] = useState("")
  const [loading, setLoading] = useState(false)
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [error, setError] = useState("")
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!destination || !startDate || !endDate) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/trip-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          budget,
          travelers: Number.parseInt(travelers),
          preferences,
          currentLocation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate trip plan")
      }

      setTripPlan(data)
    } catch (error) {
      console.error("Error generating trip plan:", error)
      setError(error instanceof Error ? error.message : "Failed to generate trip plan")
    } finally {
      setLoading(false)
    }
  }

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">AI Trip Planner ✈️</h2>
        <p className="text-gray-600 text-lg">Let AI create your perfect travel itinerary</p>
      </div>

      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl font-bold">Plan Your Trip</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Destination *
                </label>
                <Input
                  placeholder="Where do you want to go?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Number of Travelers
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="How many people?"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  End Date *
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Budget Category
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="Budget">Budget (₹1,000-3,000/day)</option>
                  <option value="Moderate">Moderate (₹3,000-8,000/day)</option>
                  <option value="Luxury">Luxury (₹8,000+/day)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Travel Preferences</label>
                <Input
                  placeholder="Adventure, culture, food, relaxation..."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Generating Your Perfect Trip...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Generate Trip Plan
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {tripPlan && (
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-slate-800 text-white">
            <CardTitle className="text-2xl font-bold">Your Trip Plan</CardTitle>
            <p className="text-slate-200">
              {tripPlan.tripOverview.destination} • {tripPlan.tripOverview.duration} days
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-gray-100">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="itinerary" className="text-xs sm:text-sm">
                  Itinerary
                </TabsTrigger>
                <TabsTrigger value="hotels" className="text-xs sm:text-sm">
                  Hotels
                </TabsTrigger>
                <TabsTrigger value="transport" className="text-xs sm:text-sm">
                  Transport
                </TabsTrigger>
                <TabsTrigger value="budget" className="text-xs sm:text-sm">
                  Budget
                </TabsTrigger>
                <TabsTrigger value="packing" className="text-xs sm:text-sm">
                  Packing
                </TabsTrigger>
                <TabsTrigger value="tips" className="text-xs sm:text-sm">
                  Tips
                </TabsTrigger>
                <TabsTrigger value="checklist" className="text-xs sm:text-sm">
                  Checklist
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="font-semibold text-blue-900">{tripPlan.tripOverview.duration} Days</p>
                        <p className="text-sm text-blue-700">Duration</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-green-900">{tripPlan.tripOverview.totalEstimatedCost}</p>
                        <p className="text-sm text-green-700">Total Cost</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="font-semibold text-purple-900">{tripPlan.tripOverview.destination}</p>
                        <p className="text-sm text-purple-700">Destination</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Trip Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{tripPlan.tripOverview.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Trip Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tripPlan.tripOverview.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="p-3 text-sm bg-slate-100 text-slate-800">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">Best Time to Visit</h4>
                    <p className="text-amber-800">{tripPlan.tripOverview.bestTimeToVisit}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="p-6">
                <div className="space-y-6">
                  {tripPlan.dailyItinerary.map((day) => (
                    <Card key={day.day} className="border-l-4 border-l-blue-500">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-lg text-gray-900">
                          Day {day.day}: {day.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{day.date}</p>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        {day.activities.map((activity, index) => (
                          <div key={index} className="border-l-2 border-l-gray-200 pl-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{activity.time}</span>
                                <span>•</span>
                                <span>{activity.cost}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{activity.description}</p>
                            <p className="text-xs text-gray-600">📍 {activity.location}</p>
                            <p className="text-xs text-blue-600 mt-1">💡 {activity.tips}</p>
                          </div>
                        ))}

                        {day.meals && Array.isArray(day.meals) && day.meals.length > 0 ? (
                          day.meals.map((meal, index) => (
                            <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                              <h4 className="font-semibold text-orange-900">
                                {meal.type} - {meal.restaurant}
                              </h4>
                              <p className="text-sm text-orange-800">
                                🍽️ {meal.speciality} • {meal.cost}
                              </p>
                              <p className="text-xs text-orange-700">📍 {meal.location}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No meals planned</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hotels" className="p-6">
                <div className="space-y-6">
                  {tripPlan.accommodationDetails.map((hotel, index) => (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardHeader className="bg-emerald-50">
                        <CardTitle className="text-lg text-emerald-900">{hotel.name}</CardTitle>
                        <p className="text-emerald-700">
                          {hotel.type} • {hotel.location}
                        </p>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Price per Night</p>
                            <p className="text-lg font-bold text-emerald-600">{hotel.pricePerNight}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Total Nights</p>
                            <p className="text-lg font-bold text-gray-900">{hotel.totalNights}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Total Cost</p>
                            <p className="text-lg font-bold text-emerald-600">{hotel.totalCost}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="font-semibold text-blue-900 mb-1">Booking Tips</h4>
                          <p className="text-sm text-blue-800">{hotel.bookingTips}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Alternatives</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {hotel.alternatives.map((alt, i) => (
                              <li key={i}>• {alt}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="transport" className="p-6">
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-lg text-blue-900">To Destination</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Method</p>
                          <p className="text-lg font-bold text-blue-600">
                            {tripPlan.transportation.toDestination.method}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Cost</p>
                          <p className="text-lg font-bold text-blue-600">
                            {tripPlan.transportation.toDestination.cost}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{tripPlan.transportation.toDestination.details}</p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          💡 {tripPlan.transportation.toDestination.bookingTips}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-lg text-green-900">Local Transportation</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {tripPlan.transportation.localTransport.map((transport, index) => (
                          <div key={index} className="border-l-4 border-l-green-500 pl-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-semibold text-gray-900">{transport.method}</h4>
                              <span className="font-bold text-green-600">{transport.cost}</span>
                            </div>
                            <p className="text-sm text-gray-700">{transport.tips}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="bg-slate-50">
                        <CardTitle className="text-lg text-slate-900">Budget Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        {Object.entries(tripPlan.budgetBreakdown).map(([key, value]) => {
                          if (key === "budgetTips" || key === "total" || key === "dailyAverage") return null
                          return (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                              <span className="font-semibold text-slate-800">{value}</span>
                            </div>
                          )
                        })}
                        <Separator />
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-slate-800">{tripPlan.budgetBreakdown.total}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Daily Average</span>
                          <span className="text-slate-600">{tripPlan.budgetBreakdown.dailyAverage}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader className="bg-green-50">
                        <CardTitle className="text-lg text-green-900">Money-Saving Tips</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <ul className="space-y-2">
                          {tripPlan.budgetBreakdown.budgetTips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-green-600 font-bold">💰</span>
                              <span className="text-sm text-green-800">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="packing" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(tripPlan.packingList).map(([category, items]) => (
                    <Card key={category} className="border-0 shadow-lg">
                      <CardHeader className="bg-purple-50">
                        <CardTitle className="text-lg text-purple-900 capitalize">
                          {category.replace(/([A-Z])/g, " $1")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <ul className="space-y-2">
                          {items.map((item, index) => {
                            const checkKey = `${category}-${index}`
                            return (
                              <li key={index} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={checkKey}
                                  checked={checkedItems[checkKey] || false}
                                  onChange={() => toggleCheck(checkKey)}
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <label
                                  htmlFor={checkKey}
                                  className={`text-sm cursor-pointer ${
                                    checkedItems[checkKey] ? "line-through text-gray-500" : "text-gray-700"
                                  }`}
                                >
                                  {item}
                                </label>
                              </li>
                            )
                          })}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tips" className="p-6">
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-orange-50">
                      <CardTitle className="text-lg text-orange-900">Important Travel Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ul className="space-y-3">
                        {tripPlan.importantTips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="text-orange-600 font-bold text-lg">💡</span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-lg text-red-900">Emergency Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Emergency Contacts</h4>
                        <p className="text-sm text-red-800">{tripPlan.emergencyInfo.localEmergency}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Nearest Hospital</h4>
                        <p className="text-sm text-red-800">{tripPlan.emergencyInfo.nearestHospital}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Safety Tips</h4>
                        <ul className="text-sm text-red-800 space-y-1">
                          {tripPlan.emergencyInfo.safetyTips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="checklist" className="p-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-lg text-slate-900">Booking Checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {tripPlan.bookingChecklist.map((item, index) => {
                        const checkKey = `booking-${index}`
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                          >
                            <input
                              type="checkbox"
                              id={checkKey}
                              checked={checkedItems[checkKey] || false}
                              onChange={() => toggleCheck(checkKey)}
                              className="rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={checkKey}
                                className={`font-medium cursor-pointer ${
                                  checkedItems[checkKey] ? "line-through text-gray-500" : "text-gray-900"
                                }`}
                              >
                                {item.item}
                              </label>
                              <p className="text-sm text-gray-600">Deadline: {item.deadline}</p>
                            </div>
                            <Badge
                              variant={
                                item.priority === "High"
                                  ? "destructive"
                                  : item.priority === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {item.priority}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
