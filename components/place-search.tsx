"use client"

import type React from "react"
import { useState } from "react"
import {
  Search,
  MapPin,
  Cloud,
  Camera,
  Utensils,
  Hotel,
  Car,
  Clock,
  Globe,
  DollarSign,
  Lightbulb,
  Star,
  Users,
  Calendar,
  Thermometer,
  Umbrella,
  Shirt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlaceSearchProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
}

interface PlaceInfo {
  name: string
  country: string
  region: string
  bestTimeToVisit: string
  description: string
  history: string
  culture: string
  language: {
    primary: string[]
    phrases: string[]
  }
  notablePlaces: Array<{ name: string; description: string }>
  activities: Array<{ name: string; description: string }>
  food: Array<{ name: string; description: string }>
  hotels: Array<{ name: string; type: string; priceRange: string; description: string }>
  transportation: {
    howToReach: string
    localTransport: string
    distance: string
  }
  dailyExpenses: {
    budget: { accommodation: string; food: string; transport: string; activities: string; total: string }
    midRange: { accommodation: string; food: string; transport: string; activities: string; total: string }
    luxury: { accommodation: string; food: string; transport: string; activities: string; total: string }
  }
  weather: {
    current: string
    temperature: string
    rainfall: string
    clothing: string
  }
  funFacts: string[]
  tips: string[]
}

export default function PlaceSearch({ currentLocation }: PlaceSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<PlaceInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/search-place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          currentLocation: currentLocation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Search failed: ${response.status}`)
      }

      setSearchResults(data)
    } catch (error) {
      console.error("Search error:", error)
      setError(error instanceof Error ? error.message : "Failed to search. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const quickSearches = [
    "Paris",
    "Tokyo",
    "Bali",
    "New York",
    "London",
    "Dubai",
    "Thailand",
    "Goa",
    "Manali",
    "Kerala",
    "Rajasthan",
    "Kashmir",
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations 🗺️</h2>
        <p className="text-gray-600">Search for any place and get comprehensive AI-powered travel insights</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search for any destination (e.g., Paris, Tokyo, Goa, Manali)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Gathering travel insights...</h3>
            <p className="text-gray-600">Our AI is researching the best information about {searchQuery}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults && !loading && (
        <div className="space-y-6">
          {/* Header Info */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{searchResults.name}</h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {searchResults.country}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {searchResults.region}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Best: {searchResults.bestTimeToVisit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-gray-700 text-lg leading-relaxed">{searchResults.description}</p>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="stay">Hotels</TabsTrigger>
              <TabsTrigger value="expenses">Budget</TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      History & Heritage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{searchResults.history}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-purple-600" />
                      Culture & Traditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{searchResults.culture}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-green-600" />
                    Language & Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Primary Languages:</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.language.primary.map((lang, index) => (
                          <Badge key={index} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Useful Phrases:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {searchResults.language.phrases.map((phrase, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                            {phrase}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Fun Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchResults.funFacts.map((fact, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{fact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="places">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-600" />
                    Must-Visit Places
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.notablePlaces.map((place, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <h4 className="font-semibold text-lg mb-2 text-gray-900">{place.name}</h4>
                        <p className="text-gray-600 text-sm">{place.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-green-600" />
                    Things to Do & Experiences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.activities.map((activity, index) => (
                      <div key={index} className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                        <h4 className="font-semibold text-lg mb-2 text-green-900">{activity.name}</h4>
                        <p className="text-green-700 text-sm">{activity.description}</p>
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
                    Local Cuisine & Specialties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.food.map((dish, index) => (
                      <div key={index} className="bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition-colors">
                        <h4 className="font-semibold text-lg mb-2 text-orange-900">{dish.name}</h4>
                        <p className="text-orange-700 text-sm">{dish.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stay">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hotel className="h-5 w-5 mr-2 text-purple-600" />
                    Accommodation Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.hotels.map((hotel, index) => (
                      <div key={index} className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-lg text-purple-900">{hotel.name}</h4>
                          <div className="text-right">
                            <Badge
                              variant={
                                hotel.type === "Luxury" ? "default" : hotel.type === "Budget" ? "secondary" : "outline"
                              }
                            >
                              {hotel.type}
                            </Badge>
                            <p className="text-sm font-semibold text-purple-700 mt-1">{hotel.priceRange}</p>
                          </div>
                        </div>
                        <p className="text-purple-700 text-sm">{hotel.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Daily Budget Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Budget */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-green-900 mb-3">Budget Travel</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Accommodation:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.budget.accommodation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Food:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.budget.food}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transport:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.budget.transport}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Activities:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.budget.activities}</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-green-700">{searchResults.dailyExpenses.budget.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mid-Range */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-blue-900 mb-3">Mid-Range Travel</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Accommodation:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.midRange.accommodation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Food:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.midRange.food}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transport:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.midRange.transport}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Activities:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.midRange.activities}</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-blue-700">{searchResults.dailyExpenses.midRange.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Luxury */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-purple-900 mb-3">Luxury Travel</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Accommodation:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.luxury.accommodation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Food:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.luxury.food}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transport:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.luxury.transport}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Activities:</span>
                            <span className="font-semibold">{searchResults.dailyExpenses.luxury.activities}</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-purple-700">{searchResults.dailyExpenses.luxury.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Car className="h-5 w-5 mr-2 text-blue-600" />
                      Transportation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How to Reach:</h4>
                      <p className="text-gray-700">{searchResults.transportation.howToReach}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Local Transport:</h4>
                      <p className="text-gray-700">{searchResults.transportation.localTransport}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Distance:</h4>
                      <p className="text-gray-700">{searchResults.transportation.distance}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weather">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                    Weather & Climate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Thermometer className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold mb-1">Temperature</h4>
                      <p className="text-sm text-gray-700">{searchResults.weather.temperature}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Cloud className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <h4 className="font-semibold mb-1">Current Season</h4>
                      <p className="text-sm text-gray-700">{searchResults.weather.current}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Umbrella className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold mb-1">Rainfall</h4>
                      <p className="text-sm text-gray-700">{searchResults.weather.rainfall}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Shirt className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold mb-1">What to Pack</h4>
                      <p className="text-sm text-gray-700">{searchResults.weather.clothing}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Travel Tips & Advice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-yellow-50 p-4 rounded-lg">
                        <div className="bg-yellow-200 rounded-full p-1 mt-1">
                          <span className="text-yellow-800 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 flex-1">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Quick Search Suggestions */}
      {!searchResults && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {quickSearches.map((place) => (
                <Button
                  key={place}
                  variant="outline"
                  onClick={() => {
                    setSearchQuery(place)
                    setTimeout(() => handleSearch(), 100)
                  }}
                  className="justify-center hover:bg-blue-50 hover:border-blue-300"
                >
                  {place}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
