"use client"

import { useState } from "react"
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Plane,
  Hotel,
  Utensils,
  Camera,
  CheckCircle,
  AlertCircle,
  Download,
  Share,
  Star,
  Navigation,
  Package,
  Phone,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "1",
    preferences: "",
  })
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedDays, setExpandedDays] = useState<number[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleDayExpansion = (day: number) => {
    setExpandedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const generateTripPlan = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError("Please fill in destination, start date, and end date")
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
          ...formData,
          currentLocation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to generate trip plan: ${response.status}`)
      }

      setTripPlan(data)
      setExpandedDays([1]) // Expand first day by default
    } catch (error) {
      console.error("Trip planning error:", error)
      setError(error instanceof Error ? error.message : "Failed to generate trip plan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const exportTripPlan = () => {
    if (!tripPlan) return

    const dataStr = JSON.stringify(tripPlan, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${tripPlan.tripOverview.destination}-trip-plan.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Trip Planner ✈️</h2>
        <p className="text-gray-600">Get a detailed, personalized trip plan powered by AI</p>
      </div>

      {/* Trip Planning Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Plan Your Perfect Trip
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, Tokyo, Bali"
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="travelers">Number of Travelers</Label>
              <Select value={formData.travelers} onValueChange={(value) => handleInputChange("travelers", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select travelers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Person</SelectItem>
                  <SelectItem value="2">2 People</SelectItem>
                  <SelectItem value="3">3 People</SelectItem>
                  <SelectItem value="4">4 People</SelectItem>
                  <SelectItem value="5+">5+ People</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Budget">Budget ($50-100/day)</SelectItem>
                  <SelectItem value="Moderate">Moderate ($100-250/day)</SelectItem>
                  <SelectItem value="Luxury">Luxury ($250+/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="preferences">Travel Preferences (Optional)</Label>
            <Textarea
              id="preferences"
              placeholder="e.g., Adventure activities, cultural experiences, food tours, relaxation, nightlife..."
              value={formData.preferences}
              onChange={(e) => handleInputChange("preferences", e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </p>
            </div>
          )}

          <Button
            onClick={generateTripPlan}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Plane className="h-5 w-5 mr-2" />
            )}
            {loading ? "Generating Your Trip Plan..." : "Generate Trip Plan"}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Creating Your Perfect Trip Plan...</h3>
            <p className="text-gray-600">Our AI is crafting a detailed itinerary just for you</p>
          </CardContent>
        </Card>
      )}

      {/* Trip Plan Results */}
      {tripPlan && !loading && (
        <div className="space-y-6">
          {/* Trip Overview */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{tripPlan.tripOverview.destination}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-blue-100 mb-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {tripPlan.tripOverview.duration} days
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {tripPlan.tripOverview.totalEstimatedCost}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {formData.travelers} traveler{formData.travelers !== "1" ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-blue-100 mb-4">{tripPlan.tripOverview.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {tripPlan.tripOverview.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={exportTripPlan}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Trip Information */}
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="accommodation">Hotels</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="packing">Packing</TabsTrigger>
              <TabsTrigger value="tips">Tips & Info</TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Day-by-Day Itinerary</h3>
              {tripPlan.dailyItinerary.map((day) => (
                <Card key={day.day}>
                  <Collapsible open={expandedDays.includes(day.day)} onOpenChange={() => toggleDayExpansion(day.day)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                              Day {day.day}: {day.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{day.date}</p>
                          </div>
                          {expandedDays.includes(day.day) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-6">
                        {/* Activities */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Camera className="h-4 w-4 mr-2 text-green-600" />
                            Activities
                          </h4>
                          <div className="space-y-3">
                            {day.activities.map((activity, index) => (
                              <div key={index} className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium text-green-900">{activity.activity}</h5>
                                    <p className="text-sm text-green-700">{activity.location}</p>
                                  </div>
                                  <div className="text-right text-sm">
                                    <p className="font-medium">{activity.time}</p>
                                    <p className="text-green-600">{activity.cost}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {activity.duration}
                                  </span>
                                  <span className="italic">💡 {activity.tips}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Meals */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Utensils className="h-4 w-4 mr-2 text-orange-600" />
                            Meals
                          </h4>
                          <div className="space-y-2">
                            {day.meals.map((meal, index) => (
                              <div key={index} className="bg-orange-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="font-medium text-orange-900">
                                      {meal.type} - {meal.restaurant}
                                    </h5>
                                    <p className="text-sm text-orange-700">{meal.location}</p>
                                    <p className="text-xs text-gray-600">Try: {meal.speciality}</p>
                                  </div>
                                  <span className="text-sm font-medium text-orange-600">{meal.cost}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Accommodation */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Hotel className="h-4 w-4 mr-2 text-purple-600" />
                            Accommodation
                          </h4>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-purple-900">{day.accommodation.hotel}</h5>
                                <p className="text-sm text-purple-700">{day.accommodation.location}</p>
                                <p className="text-xs text-gray-600">Check-in: {day.accommodation.checkIn}</p>
                              </div>
                              <span className="text-sm font-medium text-purple-600">{day.accommodation.cost}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="accommodation">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Accommodation Details</h3>
                {tripPlan.accommodationDetails.map((hotel, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold">{hotel.name}</h4>
                          <p className="text-gray-600">{hotel.location}</p>
                          <Badge variant="outline" className="mt-2">
                            {hotel.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{hotel.totalCost}</p>
                          <p className="text-sm text-gray-600">
                            {hotel.pricePerNight} × {hotel.totalNights} nights
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Amenities</h5>
                          <div className="flex flex-wrap gap-1">
                            {hotel.amenities.map((amenity, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Booking Tips</h5>
                          <p className="text-sm text-gray-600">{hotel.bookingTips}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Alternatives</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
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

            <TabsContent value="transport">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Transportation</h3>

                {/* To Destination */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plane className="h-5 w-5 mr-2 text-blue-600" />
                      Getting There
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Method</h5>
                        <p className="text-gray-700">{tripPlan.transportation.toDestination.method}</p>
                        <p className="text-sm text-gray-600 mt-1">{tripPlan.transportation.toDestination.details}</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Cost & Duration</h5>
                        <p className="text-lg font-semibold text-green-600">
                          {tripPlan.transportation.toDestination.cost}
                        </p>
                        <p className="text-sm text-gray-600">{tripPlan.transportation.toDestination.duration}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Booking Tips</h5>
                      <p className="text-sm text-gray-600">{tripPlan.transportation.toDestination.bookingTips}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Local Transport */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Navigation className="h-5 w-5 mr-2 text-green-600" />
                      Local Transportation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tripPlan.transportation.localTransport.map((transport, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-green-900">{transport.method}</h5>
                              <p className="text-sm text-gray-600">{transport.tips}</p>
                            </div>
                            <span className="text-sm font-medium text-green-600">{transport.cost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="budget">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Budget Breakdown</h3>

                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{tripPlan.budgetBreakdown.total}</p>
                        <p className="text-sm text-gray-600">Total Cost</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{tripPlan.budgetBreakdown.dailyAverage}</p>
                        <p className="text-sm text-gray-600">Per Day</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{tripPlan.tripOverview.duration}</p>
                        <p className="text-sm text-gray-600">Days</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{formData.travelers}</p>
                        <p className="text-sm text-gray-600">Travelers</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Accommodation", amount: tripPlan.budgetBreakdown.accommodation, icon: Hotel },
                        { label: "Transportation", amount: tripPlan.budgetBreakdown.transportation, icon: Plane },
                        { label: "Food", amount: tripPlan.budgetBreakdown.food, icon: Utensils },
                        { label: "Activities", amount: tripPlan.budgetBreakdown.activities, icon: Camera },
                        { label: "Shopping", amount: tripPlan.budgetBreakdown.shopping, icon: Package },
                        { label: "Miscellaneous", amount: tripPlan.budgetBreakdown.miscellaneous, icon: CreditCard },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <item.icon className="h-4 w-4 mr-2 text-gray-600" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <span className="font-semibold">{item.amount}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium mb-3">Money-Saving Tips</h5>
                      <ul className="space-y-1">
                        {tripPlan.budgetBreakdown.budgetTips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-600 mr-2">💡</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="packing">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Packing Checklist</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Clothing", items: tripPlan.packingList.clothing, icon: "👕" },
                    { title: "Electronics", items: tripPlan.packingList.electronics, icon: "🔌" },
                    { title: "Documents", items: tripPlan.packingList.documents, icon: "📄" },
                    { title: "Health & Safety", items: tripPlan.packingList.healthAndSafety, icon: "🏥" },
                    { title: "Miscellaneous", items: tripPlan.packingList.miscellaneous, icon: "🎒" },
                    { title: "Weather Specific", items: tripPlan.packingList.weatherSpecific, icon: "🌤️" },
                  ].map((category, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <span className="mr-2">{category.icon}</span>
                          {category.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.items.map((item, i) => (
                            <li key={i} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tips">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Tips & Important Information</h3>

                {/* Important Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-600" />
                      Travel Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tripPlan.importantTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-600 mr-2 mt-1">💡</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Emergency Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-red-600" />
                      Emergency Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Emergency Contacts</h5>
                      <p className="text-sm text-gray-700">{tripPlan.emergencyInfo.localEmergency}</p>
                      <p className="text-sm text-gray-700">{tripPlan.emergencyInfo.nearestHospital}</p>
                      <p className="text-sm text-gray-700">{tripPlan.emergencyInfo.embassy}</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Safety Tips</h5>
                      <ul className="space-y-1">
                        {tripPlan.emergencyInfo.safetyTips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-red-600 mr-2">⚠️</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Booking Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tripPlan.bookingChecklist.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span className="font-medium">{item.item}</span>
                          </div>
                          <div className="text-right">
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
                            <p className="text-xs text-gray-600 mt-1">{item.deadline}</p>
                          </div>
                        </div>
                      ))}
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
