"use client"

import { useState } from "react"
import { LocateFixed, Search, Sparkles, Globe, Star } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Props {
  onLocationSet: (location: { lat: number; lng: number; name: string; city: string }) => void
  onClose: () => void
}

// Popular cities with coordinates
const POPULAR_CITIES = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777, emoji: "🏙️", desc: "Financial Capital" },
  { name: "Delhi", lat: 28.6139, lng: 77.209, emoji: "🏛️", desc: "Capital City" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, emoji: "💻", desc: "Silicon Valley" },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, emoji: "💎", desc: "City of Pearls" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, emoji: "🏖️", desc: "Detroit of India" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, emoji: "🎭", desc: "Cultural Capital" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, emoji: "🎓", desc: "Oxford of East" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, emoji: "🏭", desc: "Manchester of India" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, emoji: "👑", desc: "Pink City" },
  { name: "Surat", lat: 21.1702, lng: 72.8311, emoji: "💍", desc: "Diamond City" },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, emoji: "🕌", desc: "City of Nawabs" },
  { name: "Kanpur", lat: 26.4499, lng: 80.3319, emoji: "🏭", desc: "Leather City" },
]

export default function LocationSetup({ onLocationSet, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<"popular" | "all">("popular")

  // Filter cities based on search
  const filteredCities = POPULAR_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get popular cities (top 12)
  const popularCities = POPULAR_CITIES.slice(0, 12)
  const displayCities = selectedCategory === "popular" ? popularCities : filteredCities

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(`/api/geocode?lat=${coords.latitude}&lng=${coords.longitude}`)
          const data = await response.json()

          onLocationSet({
            lat: coords.latitude,
            lng: coords.longitude,
            name: data.name || "Current Location",
            city: data.name || "Current Location",
          })
        } catch (err) {
          onLocationSet({
            lat: coords.latitude,
            lng: coords.longitude,
            name: "Current Location",
            city: "Current Location",
          })
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setLoading(false)
        setError("Unable to retrieve your location. Please select a city manually.")
        console.error("Geolocation error:", err)
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000,
      },
    )
  }

  const selectCity = (city: (typeof POPULAR_CITIES)[0]) => {
    onLocationSet({
      lat: city.lat,
      lng: city.lng,
      name: city.name,
      city: city.name,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden border-slate-200">
        <CardHeader className="bg-slate-800 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-2xl">
              <Globe className="h-6 w-6 mr-3" />
              Select Your Location
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
          <p className="text-slate-200 mt-2">
            Choose your current location to access local business networks and opportunities
          </p>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Auto Detect Location */}
          <div className="mb-6">
            <Button
              className="w-full btn-primary py-4 text-lg rounded-xl shadow-lg"
              onClick={detectLocation}
              disabled={loading}
            >
              <LocateFixed className="h-5 w-5 mr-3" />
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Detecting your location...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto-Detect My Location
                </>
              )}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search for your city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 mb-6">
            <Button
              variant={selectedCategory === "popular" ? "default" : "outline"}
              onClick={() => setSelectedCategory("popular")}
              className="rounded-full"
            >
              <Star className="h-4 w-4 mr-2" />
              Popular Cities
            </Button>
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full"
            >
              <Globe className="h-4 w-4 mr-2" />
              All Cities ({POPULAR_CITIES.length})
            </Button>
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCities.map((city) => (
              <Card
                key={city.name}
                className="hover-lift cursor-pointer border-slate-200 hover:border-slate-300 group"
                onClick={() => selectCity(city)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl group-hover:scale-110 transition-transform">{city.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-slate-600">{city.name}</h3>
                      <p className="text-sm text-slate-600">{city.desc}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs bg-slate-100 text-slate-600">
                    Business Hub
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {displayCities.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No cities found</h3>
              <p className="text-slate-500">Try searching with a different term</p>
            </div>
          )}

          {/* Professional Stats */}
          <div className="mt-8 bg-slate-50 rounded-xl p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-700">{POPULAR_CITIES.length}+</div>
                <div className="text-sm text-slate-600">Business Locations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-700">10K+</div>
                <div className="text-sm text-slate-600">Professional Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-700">50K+</div>
                <div className="text-sm text-slate-600">Business Connections</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
