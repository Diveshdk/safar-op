"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CalendarDays,
  MapPin,
  DollarSign,
  Clock,
  Plane,
  Hotel,
  Utensils,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react"

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

export default function TripPlanner() {
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState("")
  const [travelers, setTravelers] = useState("")
  const [preferences, setPreferences] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setTripPlan(null)

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
          travelers: Number.parseInt(travelers) || 1,
          preferences,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate trip plan")
      }

      setTripPlan(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <Card className="bg-white shadow-lg border-0 rounded-2xl">
        <CardHeader className="bg-slate-800 text-white rounded-t-2xl p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Plane className="h-8 w-8" />
            AI Trip Planner
          </CardTitle>
          <CardDescription className="text-slate-200 text-base sm:text-lg">
            Get personalized travel itineraries powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-semibold text-slate-700">
                  Destination *
                </Label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="e.g., Goa, Kerala, Rajasthan"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-sm font-semibold text-slate-700">
                  Number of Travelers *
                </Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="e.g., 2"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  required
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold text-slate-700">
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold text-slate-700">
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-semibold text-slate-700">
                  Budget Range
                </Label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Budget">Budget (₹5,000-15,000)</SelectItem>
                    <SelectItem value="Moderate">Moderate (₹15,000-35,000)</SelectItem>
                    <SelectItem value="Luxury">Luxury (₹35,000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences" className="text-sm font-semibold text-slate-700">
                  Travel Preferences
                </Label>
                <Textarea
                  id="preferences"
                  placeholder="e.g., Adventure activities, cultural sites, food experiences, relaxation"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Perfect Trip...
                </>
              ) : (
                <>
                  <Plane className="mr-2 h-5 w-5" />
                  Plan My Trip
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Error:</span>
                <span>{error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {tripPlan && (
        <div className="space-y-6">
          {/* Trip Overview */}
          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                {tripPlan.tripOverview.destination} Trip Overview
              </CardTitle>
              <CardDescription className="text-blue-100 text-base sm:text-lg">
                {tripPlan.tripOverview.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <CalendarDays className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">{tripPlan.tripOverview.duration}</div>
                  <div className="text-sm text-slate-600">Days</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <DollarSign className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">{tripPlan.tripOverview.totalEstimatedCost}</div>
                  <div className="text-sm text-slate-600">Total Cost</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-800">{tripPlan.tripOverview.startDate}</div>
                  <div className="text-sm text-slate-600">Start Date</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-800">{tripPlan.tripOverview.endDate}</div>
                  <div className="text-sm text-slate-600">End Date</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800">Trip Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {tripPlan.tripOverview.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Tabs */}
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto p-1 bg-slate-100 rounded-xl">
              <TabsTrigger
                value="itinerary"
                className="px-3 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger
                value="accommodation"
                className="px-3 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Hotels
              </TabsTrigger>
              <TabsTrigger
                value="transport"
                className="px-3 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Transport
              </TabsTrigger>
              <TabsTrigger
                value="budget"
                className="px-3 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Budget
              </TabsTrigger>
              <TabsTrigger
                value="packing"
                className="px-3 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Packing
              </TabsTrigger>
              <TabsTrigger
                value="tips"
                className="px-3 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="mt-6">
              <div className="space-y-6">
                {tripPlan.dailyItinerary.map((day) => (
                  <Card key={day.day} className="bg-white shadow-lg border-0 rounded-2xl">
                    <CardHeader className="bg-slate-50 rounded-t-2xl p-6">
                      <CardTitle className="text-xl font-bold text-slate-800">
                        Day {day.day}: {day.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600">{day.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">Activities</h4>
                        <div className="space-y-4">
                          {day.activities.map((activity, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <span className="font-semibold text-slate-800">{activity.time}</span>
                                  <span className="text-slate-600">•</span>
                                  <span className="font-medium text-slate-800">{activity.activity}</span>
                                </div>
                                <Badge variant="outline" className="w-fit">
                                  {activity.cost}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-600 mb-1">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {activity.location} • {activity.duration}
                              </div>
                              <p className="text-sm text-slate-700 mb-2">{activity.description}</p>
                              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">💡 {activity.tips}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">Meals</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {day.meals.map((meal, index) => (
                            <div key={index} className="p-4 bg-emerald-50 rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <Utensils className="h-4 w-4 text-emerald-600" />
                                <span className="font-semibold text-slate-800">{meal.type}</span>
                              </div>
                              <div className="text-sm space-y-1">
                                <div className="font-medium text-slate-800">{meal.restaurant}</div>
                                <div className="text-slate-600">{meal.location}</div>
                                <div className="text-emerald-600 font-semibold">{meal.cost}</div>
                                <div className="text-xs text-slate-600">{meal.speciality}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="p-4 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Hotel className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-slate-800">Accommodation</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="font-medium text-slate-800">{day.accommodation.hotel}</div>
                          <div className="text-slate-600">{day.accommodation.location}</div>
                          <div className="text-purple-600 font-semibold">{day.accommodation.cost}</div>
                          <div className="text-xs text-slate-600">Check-in: {day.accommodation.checkIn}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="accommodation" className="mt-6">
              <div className="space-y-6">
                {tripPlan.accommodationDetails.map((hotel, index) => (
                  <Card key={index} className="bg-white shadow-lg border-0 rounded-2xl">
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-bold text-slate-800">{hotel.name}</CardTitle>
                      <CardDescription className="text-slate-600">
                        {hotel.type} • {hotel.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Pricing</h4>
                            <div className="text-sm space-y-1">
                              <div>
                                Per Night: <span className="font-semibold text-emerald-600">{hotel.pricePerNight}</span>
                              </div>
                              <div>
                                Total Nights: <span className="font-semibold">{hotel.totalNights}</span>
                              </div>
                              <div>
                                Total Cost: <span className="font-semibold text-emerald-600">{hotel.totalCost}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.map((amenity, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Booking Tips</h4>
                            <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">{hotel.bookingTips}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Alternatives</h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                              {hotel.alternatives.map((alt, i) => (
                                <li key={i}>• {alt}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transport" className="mt-6">
              <div className="space-y-6">
                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-bold text-slate-800">To Destination</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-semibold">Method:</span> {tripPlan.transportation.toDestination.method}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Cost:</span>{" "}
                          <span className="text-emerald-600">{tripPlan.transportation.toDestination.cost}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Duration:</span>{" "}
                          {tripPlan.transportation.toDestination.duration}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Details:</span>{" "}
                          {tripPlan.transportation.toDestination.details}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-slate-800 mb-2">Booking Tips</h4>
                        <p className="text-sm text-slate-600">{tripPlan.transportation.toDestination.bookingTips}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-bold text-slate-800">Local Transportation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tripPlan.transportation.localTransport.map((transport, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl">
                          <h4 className="font-semibold text-slate-800 mb-2">{transport.method}</h4>
                          <div className="text-sm space-y-1">
                            <div>
                              Cost: <span className="font-semibold text-emerald-600">{transport.cost}</span>
                            </div>
                            <div className="text-slate-600">{transport.tips}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="mt-6">
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold text-slate-800">Budget Breakdown</CardTitle>
                  <CardDescription className="text-slate-600">
                    Daily Average: {tripPlan.budgetBreakdown.dailyAverage}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-xl text-center">
                      <Hotel className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-slate-800">{tripPlan.budgetBreakdown.accommodation}</div>
                      <div className="text-sm text-slate-600">Accommodation</div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl text-center">
                      <Plane className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-slate-800">{tripPlan.budgetBreakdown.transportation}</div>
                      <div className="text-sm text-slate-600">Transportation</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl text-center">
                      <Utensils className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-slate-800">{tripPlan.budgetBreakdown.food}</div>
                      <div className="text-sm text-slate-600">Food</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl text-center">
                      <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-slate-800">{tripPlan.budgetBreakdown.activities}</div>
                      <div className="text-sm text-slate-600">Activities</div>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-xl text-center">
                      <ShoppingBag className="h-8 w-8 text-rose-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-slate-800">{tripPlan.budgetBreakdown.shopping}</div>
                      <div className="text-sm text-slate-600">Shopping</div>
                    </div>
                    <div className="p-4 bg-slate-100 rounded-xl text-center">
                      <DollarSign className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-slate-800">{tripPlan.budgetBreakdown.miscellaneous}</div>
                      <div className="text-sm text-slate-600">Miscellaneous</div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{tripPlan.budgetBreakdown.total}</div>
                    <div className="text-lg text-slate-600">Total Estimated Cost</div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-800 mb-3">Money-Saving Tips</h4>
                    <ul className="space-y-2">
                      {tripPlan.budgetBreakdown.budgetTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packing" className="mt-6">
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold text-slate-800">Packing Checklist</CardTitle>
                  <CardDescription className="text-slate-600">Essential items for your trip</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(tripPlan.packingList).map(([category, items]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="font-semibold text-slate-800 capitalize border-b border-slate-200 pb-2">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </h4>
                        <ul className="space-y-2">
                          {items.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                              <div className="w-4 h-4 border border-slate-300 rounded flex-shrink-0"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="mt-6">
              <div className="space-y-6">
                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-bold text-slate-800">Important Travel Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <ul className="space-y-3">
                      {tripPlan.importantTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Emergency Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-2">Emergency Contacts</h4>
                          <div className="text-sm space-y-1">
                            <div>
                              Local Emergency:{" "}
                              <span className="font-semibold text-red-600">
                                {tripPlan.emergencyInfo.localEmergency}
                              </span>
                            </div>
                            <div>
                              Hospital: <span className="font-semibold">{tripPlan.emergencyInfo.nearestHospital}</span>
                            </div>
                            <div>
                              Embassy: <span className="font-semibold">{tripPlan.emergencyInfo.embassy}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-2">Important Contacts</h4>
                          <ul className="text-sm space-y-1">
                            {tripPlan.emergencyInfo.importantContacts.map((contact, index) => (
                              <li key={index}>• {contact}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Safety Tips</h4>
                        <ul className="text-sm space-y-2">
                          {tripPlan.emergencyInfo.safetyTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-orange-600 mt-1 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {tripPlan.bookingChecklist && (
                  <Card className="bg-white shadow-lg border-0 rounded-2xl">
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-bold text-slate-800">Booking Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-3">
                        {tripPlan.bookingChecklist.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 border border-slate-300 rounded flex-shrink-0"></div>
                              <span className="text-sm font-medium text-slate-800">{item.item}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  item.priority === "High"
                                    ? "destructive"
                                    : item.priority === "Medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {item.priority}
                              </Badge>
                              <span className="text-xs text-slate-600">{item.deadline}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
