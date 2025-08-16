"use client"

import type React from "react"
import { useState } from "react"
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Hotel,
  Car,
  CheckCircle2,
  AlertCircle,
  Plane,
  Star,
  Phone,
  Shield,
  Package,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [budget, setBudget] = useState("")
  const [travelers, setTravelers] = useState("")
  const [preferences, setPreferences] = useState("")
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination || !startDate || !endDate) {
      setError("Please fill in all required fields")
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
          startDate,
          endDate,
          budget: budget || "Moderate",
          travelers: Number.parseInt(travelers) || 1,
          preferences: preferences.trim(),
          currentLocation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Planning failed: ${response.status}`)
      }

      setTripPlan(data)
    } catch (error) {
      console.error("Trip planning error:", error)
      setError(error instanceof Error ? error.message : "Failed to create trip plan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleCheckItem = (category: string, index: number) => {
    const key = `${category}-${index}`
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const formatCurrency = (amount: string) => {
    return amount.replace(/\$/g, "₹")
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">AI Trip Planner ✈️</h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Let our AI create a personalized, detailed itinerary for your perfect trip
        </p>
      </div>

      {/* Trip Planning Form */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-slate-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
            Plan Your Dream Trip
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                <Input
                  placeholder="e.g., Goa, Kerala, Paris, Tokyo"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                <Select value={travelers} onValueChange={setTravelers} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select travelers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Person</SelectItem>
                    <SelectItem value="2">2 People</SelectItem>
                    <SelectItem value="3">3 People</SelectItem>
                    <SelectItem value="4">4 People</SelectItem>
                    <SelectItem value="5">5+ People</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <Select value={budget} onValueChange={setBudget} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Budget">Budget (₹3,000-5,000/day)</SelectItem>
                    <SelectItem value="Moderate">Moderate (₹6,000-10,000/day)</SelectItem>
                    <SelectItem value="Luxury">Luxury (₹14,000+/day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Preferences</label>
                <Textarea
                  placeholder="e.g., Adventure sports, cultural sites, beaches, food tours, photography"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="w-full"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 sm:mr-3" />
                  <p className="text-red-600 text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !destination || !startDate || !endDate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                  Creating Your Perfect Trip...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plane className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Generate AI Trip Plan
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4 sm:mb-6"></div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Creating Your Perfect Trip Plan...</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Our AI is analyzing destinations, finding the best activities, and creating a personalized itinerary just
              for you
            </p>
          </CardContent>
        </Card>
      )}

      {/* Trip Plan Results */}
      {tripPlan && !loading && (
        <div className="space-y-6 sm:space-y-8">
          {/* Trip Overview */}
          <Card className="shadow-lg border-0 bg-white overflow-hidden">
            <div className="bg-slate-800 text-white p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{tripPlan.tripOverview.destination}</h1>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-300 text-sm sm:text-base">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
                      {tripPlan.tripOverview.duration} Days
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 sm:mr-2" />
                      {formatCurrency(tripPlan.tripOverview.totalEstimatedCost)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 sm:mr-2" />
                      {tripPlan.tripOverview.bestTimeToVisit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4 sm:p-6">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                {tripPlan.tripOverview.summary}
              </p>
              <div>
                <h4 className="font-semibold mb-3 text-base sm:text-lg">Trip Highlights:</h4>
                <div className="flex flex-wrap gap-2">
                  {tripPlan.tripOverview.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-1">
              <TabsTrigger value="itinerary" className="text-xs sm:text-sm">
                Itinerary
              </TabsTrigger>
              <TabsTrigger value="accommodation" className="text-xs sm:text-sm">
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
              <TabsTrigger value="emergency" className="text-xs sm:text-sm">
                Emergency
              </TabsTrigger>
              <TabsTrigger value="checklist" className="text-xs sm:text-sm">
                Checklist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-4 sm:space-y-6">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
                    Daily Itinerary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-6 sm:space-y-8">
                    {tripPlan.dailyItinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                        <div className="mb-4">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            Day {day.day}: {day.title}
                          </h3>
                          <p className="text-sm text-gray-500">{day.date}</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-blue-700 text-base sm:text-lg">Activities</h4>
                            <div className="space-y-3 sm:space-y-4">
                              {day.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                                    <h5 className="font-semibold text-gray-900 text-sm sm:text-base">
                                      {activity.activity}
                                    </h5>
                                    <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                                      <Badge variant="outline" className="text-xs">
                                        {activity.time}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {formatCurrency(activity.cost)}
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    <MapPin className="h-3 w-3 inline mr-1" />
                                    {activity.location}
                                  </p>
                                  <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                                  <p className="text-xs text-blue-600 bg-blue-100 p-2 rounded">💡 {activity.tips}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 text-orange-700 text-base sm:text-lg">Meals</h4>
                            <div className="space-y-2 sm:space-y-3">
                              {day.meals.map((meal, mealIndex) => (
                                <div key={mealIndex} className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <h5 className="font-semibold text-gray-900 text-sm sm:text-base">
                                        {meal.type} at {meal.restaurant}
                                      </h5>
                                      <p className="text-sm text-gray-600">{meal.location}</p>
                                      <p className="text-sm text-orange-700">Try: {meal.speciality}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs mt-2 sm:mt-0">
                                      {formatCurrency(meal.cost)}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-purple-700 text-base sm:text-lg">Accommodation</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-900 text-sm sm:text-base">
                                  {day.accommodation.hotel}
                                </h5>
                                <p className="text-sm text-gray-600">{day.accommodation.location}</p>
                                <p className="text-sm text-purple-600">Check-in: {day.accommodation.checkIn}</p>
                              </div>
                              <Badge variant="outline" className="text-xs mt-2 sm:mt-0">
                                {formatCurrency(day.accommodation.cost)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accommodation">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Hotel className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-purple-600" />
                    Accommodation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {tripPlan.accommodationDetails.map((hotel, index) => (
                      <div key={index} className="bg-purple-50 p-4 sm:p-6 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                            <p className="text-gray-600 mb-2">{hotel.location}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">{hotel.type}</Badge>
                              <Badge variant="outline">{formatCurrency(hotel.pricePerNight)}</Badge>
                              <Badge variant="outline">{hotel.totalNights} nights</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg sm:text-xl font-bold text-purple-600">
                              {formatCurrency(hotel.totalCost)}
                            </p>
                            <p className="text-sm text-gray-500">Total Cost</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <h4 className="font-semibold mb-2 text-base sm:text-lg">Amenities</h4>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {hotel.amenities.map((amenity, amenityIndex) => (
                                <Badge key={amenityIndex} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-base sm:text-lg">Alternatives</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {hotel.alternatives.map((alt, altIndex) => (
                                <li key={altIndex}>• {alt}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-purple-100 rounded">
                          <p className="text-sm text-purple-800">
                            <Lightbulb className="h-4 w-4 inline mr-1" />
                            {hotel.bookingTips}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transport">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Car className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-green-600" />
                    Transportation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-3">To Destination</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Method: {tripPlan.transportation.toDestination.method}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{tripPlan.transportation.toDestination.details}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Cost: {formatCurrency(tripPlan.transportation.toDestination.cost)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {tripPlan.transportation.toDestination.duration}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-green-100 rounded">
                      <p className="text-sm text-green-800">💡 {tripPlan.transportation.toDestination.bookingTips}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-3">Local Transportation</h3>
                    <div className="space-y-3">
                      {tripPlan.transportation.localTransport.map((transport, index) => (
                        <div key={index} className="bg-white p-3 sm:p-4 rounded border">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{transport.method}</p>
                              <p className="text-sm text-blue-600">{transport.tips}</p>
                            </div>
                            <Badge variant="outline" className="text-xs mt-2 sm:mt-0">
                              {formatCurrency(transport.cost)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-3">Return Journey</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Method: {tripPlan.transportation.fromDestination.method}
                        </p>
                        <p className="text-sm text-orange-600 mt-1">
                          {tripPlan.transportation.fromDestination.bookingTips}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs mt-2 sm:mt-0">
                        {formatCurrency(tripPlan.transportation.fromDestination.cost)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budget">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-emerald-50">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-emerald-600" />
                    Budget Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    {Object.entries(tripPlan.budgetBreakdown)
                      .filter(([key]) => !["total", "dailyAverage", "budgetTips"].includes(key))
                      .map(([category, amount]) => (
                        <div key={category} className="bg-emerald-50 p-4 rounded-lg text-center">
                          <h4 className="font-semibold text-gray-900 capitalize mb-2 text-sm sm:text-base">
                            {category}
                          </h4>
                          <p className="text-lg sm:text-xl font-bold text-emerald-600">
                            {formatCurrency(amount as string)}
                          </p>
                        </div>
                      ))}
                  </div>

                  <div className="bg-slate-800 text-white p-4 sm:p-6 rounded-lg mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">Total Trip Cost</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                          {formatCurrency(tripPlan.budgetBreakdown.total)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">Daily Average</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                          {formatCurrency(tripPlan.budgetBreakdown.dailyAverage)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg sm:text-xl font-bold text-yellow-800 mb-3">Money-Saving Tips</h3>
                    <ul className="space-y-2">
                      {tripPlan.budgetBreakdown.budgetTips.map((tip, index) => (
                        <li key={index} className="flex items-start text-sm sm:text-base">
                          <DollarSign className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-yellow-800">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packing">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-indigo-50">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-indigo-600" />
                    Packing Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Object.entries(tripPlan.packingList).map(([category, items]) => (
                      <div key={category} className="bg-indigo-50 p-4 rounded-lg">
                        <h3 className="text-base sm:text-lg font-bold text-indigo-800 mb-3 capitalize">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </h3>
                        <div className="space-y-2">
                          {(items as string[]).map((item, index) => (
                            <label key={index} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checkedItems[`${category}-${index}`] || false}
                                onChange={() => toggleCheckItem(category, index)}
                                className="mr-2 sm:mr-3 h-4 w-4 text-indigo-600 rounded"
                              />
                              <span
                                className={`text-sm sm:text-base ${
                                  checkedItems[`${category}-${index}`] ? "line-through text-gray-500" : "text-gray-700"
                                }`}
                              >
                                {item}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-yellow-50">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-yellow-600" />
                    Important Travel Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {tripPlan.importantTips.map((tip, index) => (
                      <div key={index} className="flex items-start bg-yellow-50 p-3 sm:p-4 rounded-lg">
                        <div className="bg-yellow-200 rounded-full p-1 mt-1 mr-3 flex-shrink-0">
                          <span className="text-yellow-800 font-bold text-xs sm:text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 flex-1 text-sm sm:text-base">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-red-600" />
                    Emergency Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-bold text-red-800 mb-2 flex items-center text-base sm:text-lg">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Emergency Contacts
                      </h3>
                      <div className="space-y-2 text-sm sm:text-base">
                        <p className="text-red-700">
                          <strong>Emergency:</strong> {tripPlan.emergencyInfo.localEmergency}
                        </p>
                        <p className="text-red-700">
                          <strong>Hospital:</strong> {tripPlan.emergencyInfo.nearestHospital}
                        </p>
                        <p className="text-red-700">
                          <strong>Embassy:</strong> {tripPlan.emergencyInfo.embassy}
                        </p>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-bold text-orange-800 mb-2 text-base sm:text-lg">Important Contacts</h3>
                      <ul className="space-y-1 text-sm sm:text-base">
                        {tripPlan.emergencyInfo.importantContacts.map((contact, index) => (
                          <li key={index} className="text-orange-700">
                            • {contact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-3 text-base sm:text-lg">Safety Tips</h3>
                    <ul className="space-y-2">
                      {tripPlan.emergencyInfo.safetyTips.map((tip, index) => (
                        <li key={index} className="flex items-start text-sm sm:text-base">
                          <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-800">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checklist">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-green-600" />
                    Booking Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {tripPlan.bookingChecklist.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checkedItems[`checklist-${index}`] || false}
                            onChange={() => toggleCheckItem("checklist", index)}
                            className="mr-3 h-4 w-4 sm:h-5 sm:w-5 text-green-600 rounded"
                          />
                          <div>
                            <p
                              className={`font-semibold text-sm sm:text-base ${
                                checkedItems[`checklist-${index}`] ? "line-through text-gray-500" : "text-gray-900"
                              }`}
                            >
                              {item.item}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">Deadline: {item.deadline}</p>
                          </div>
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
