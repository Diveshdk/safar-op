"use client"

import type React from "react"
import { useState } from "react"
import { Search, MapPin, Cloud, Camera, Utensils, Hotel, Car, Clock, Globe, DollarSign, Lightbulb, Star, Users, Calendar, Thermometer, Umbrella, Shirt } from 'lucide-react'
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
    "Singapore",
    "New York",
    "London",
    "Dubai",
    "Switzerland",
    "Goa",
    "Kerala",
    "Rajasthan",
    "Kashmir",
    "Himachal",
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Destination Research</h2>
        <p className="text-slate-600">Professional travel intelligence and comprehensive destination insights</p>
      </div>

      {/* Search Bar */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search for any destination (e.g., Paris, Tokyo, Goa, Kerala)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3 border-slate-200"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="btn-primary px-8"
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
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Analyzing destination data...</h3>
            <p className="text-slate-600">Gathering comprehensive travel intelligence for {searchQuery}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults && !loading && (
        <div className="space-y-6">
          {/* Header Info */}
          <Card className="overflow-hidden border-slate-200">
            <div className="bg-slate-800 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{searchResults.name}</h1>
                  <div className="flex items-center space-x-4 text-slate-200">
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
              <p className="text-slate-700 text-lg leading-relaxed">{searchResults.description}</p>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
              <TabsTrigger value="places" className="data-[state=active]:bg-white">Places</TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-white">Activities</TabsTrigger>
              <TabsTrigger value="food" className="data-[state=active]:bg-white">Food</TabsTrigger>
              <TabsTrigger value="stay" className="data-[state=active]:bg-white">Hotels</TabsTrigger>
              <TabsTrigger value="expenses" className="data-[state=active]:bg-white">Budget</TabsTrigger>
              <TabsTrigger value="weather" className="data-[state=active]:bg-white">Weather</TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-white">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Clock className="h-5 w-5 mr-2 text-slate-600" />
                      History & Heritage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">{searchResults.history}</p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Users className="h-5 w-5 mr-2 text-slate-600" />
                      Culture & Traditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">{searchResults.culture}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Globe className="h-5 w-5 mr-2 text-slate-600" />
                    Language & Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-slate-800">Primary Languages:</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.language.primary.map((lang, index) => (
                          <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-slate-800">Useful Phrases:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {searchResults.language.phrases.map((phrase, index) => (
                          <div key={index} className="bg-slate-50 p-2 rounded text-sm border border-slate-200">
                            {phrase}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Lightbulb className="h-5 w-5 mr-2 text-slate-600" />
                    Key Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchResults.funFacts.map((fact, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Star className="h-4 w-4 text-slate-500 mt-1 flex-shrink-0" />
                        <p className="text-slate-700">{fact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="places">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <MapPin className="h-5 w-5 mr-2 text-slate-600" />
                    Must-Visit Places
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.notablePlaces.map((place, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                        <h4 className="font-semibold text-lg mb-2 text-slate-800">{place.name}</h4>
                        <p className="text-slate-600 text-sm">{place.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Camera className="h-5 w-5 mr-2 text-slate-600" />
                    Activities & Experiences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.activities.map((activity, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                        <h4 className="font-semibold text-lg mb-2 text-slate-800">{activity.name}</h4>
                        <p className="text-slate-600 text-sm">{activity.description}</p>
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
                    Local Cuisine & Specialties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.food.map((dish, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                        <h4 className="font-semibold text-lg mb-2 text-slate-800">{dish.name}</h4>
                        <p className="text-slate-600 text-sm">{dish.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stay">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Hotel className="h-5 w-5 mr-2 text-slate-600" />
                    Accommodation Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.hotels.map((hotel, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-lg text-slate-800">{hotel.name}</h4>
                          <div className="text-right">
                            <Badge
                              variant={
                                hotel.type === "Luxury" ? "default" : hotel.type === "Budget" ? "secondary" : "outline"
                              }
                              className="bg-slate-100 text-slate-700"
                            >
                              {hotel.type}
                            </Badge>
                            <p className="text-sm font-semibold text-slate-700 mt-1">{hotel.priceRange}</p>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm">{hotel.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses">
              <div className="space-y-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <DollarSign className="h-5 w-5 mr-2 text-slate-600" />
                      Daily Budget Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Budget */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-bold text-lg text-slate-800 mb-3">Budget Travel</h3>
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
                          <hr className="my-2 border-slate-300" />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-slate-700">{searchResults.dailyExpenses.budget.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mid-Range */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-bold text-lg text-slate-800 mb-3">Mid-Range Travel</h3>
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
                          <hr className="my-2 border-slate-300" />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-slate-700">{searchResults.dailyExpenses.midRange.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Luxury */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-bold text-lg text-slate-800 mb-3">Luxury Travel</h3>
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
                          <hr className="my-2 border-slate-300" />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-slate-700">{searchResults.dailyExpenses.luxury.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Car className="h-5 w-5 mr-2 text-slate-600" />
                      Transportation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-slate-800">How to Reach:</h4>
                      <p className="text-slate-700">{searchResults.transportation.howToReach}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-slate-800">Local Transport:</h4>
                      <p className="text-slate-700">{searchResults.transportation.localTransport}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-slate-800">Distance:</h4>
                      <p className="text-slate-700">{searchResults.transportation.distance}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weather">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Cloud className="h-5 w-5 mr-2 text-slate-600" />
                    Weather & Climate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
                      <Thermometer className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                      <h4 className="font-semibold mb-1 text-slate-800">Temperature</h4>
                      <p className="text-sm text-slate-700">{searchResults.weather.temperature}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
                      <Cloud className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                      <h4 className="font-semibold mb-1 text-slate-800">Current Season</h4>
                      <p className="text-sm text-slate-700">{searchResults.weather.current}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
                      <Umbrella className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                      <h4 className="font-semibold mb-1 text-slate-800">Rainfall</h4>
                      <p className="text-sm text-slate-700">{searchResults.weather.rainfall}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
                      <Shirt className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                      <h4 className="font-semibold mb-1 text-slate-800">What to Pack</h4>
                      <p className="text-sm text-slate-700">{searchResults.weather.clothing}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <Lightbulb className="h-5 w-5 mr-2 text-slate-600" />
                    Professional Travel Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="bg-slate-200 rounded-full p-1 mt-1">
                          <span className="text-slate-800 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-slate-700 flex-1">{tip}</p>
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
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Popular Business Destinations</CardTitle>
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
                  className="justify-center hover:bg-slate-50 hover:border-slate-300 border-slate-200"
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
