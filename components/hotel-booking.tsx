"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import AddHotel from "./add-hotel"

interface Hotel {
  id: number
  name: string
  description: string
  city: string
  address?: string
  price: number
  image_url?: string
  amenities: string[]
  rating: number
  total_rooms: number
  available_rooms: number
}

interface Props {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  "Valet Parking": <Car className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Restaurant: <Utensils className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
}

export default function HotelBooking({ currentLocation }: Props) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHotels = async () => {
    if (!currentLocation?.city) {
      setError("Please set your location first")
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log("Fetching hotels for city:", currentLocation.city)

      const response = await fetch(`/api/hotels?city=${encodeURIComponent(currentLocation.city)}`)
      const data = await response.json()

      console.log("Hotels API response:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      setHotels(data.hotels || [])

      if (data.message) {
        console.log("Hotels API message:", data.message)
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
      setError(error instanceof Error ? error.message : "Failed to load hotels")
      toast.error("Failed to load hotels")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentLocation?.city) {
      fetchHotels()
    }
  }, [currentLocation?.city])

  const handleRefresh = () => {
    fetchHotels()
  }

  const handleHotelAdded = () => {
    // Refresh the hotels list when a new hotel is added
    fetchHotels()
    toast.success("Hotel list refreshed!")
  }

  if (!currentLocation) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">Please set your location to view hotels</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hotels in {currentLocation.city}</h2>
          <p className="text-gray-600">Find the perfect place to stay</p>
        </div>
        <Button onClick={handleRefresh} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Add Hotel Button */}
      <AddHotel currentLocation={currentLocation} onHotelAdded={handleHotelAdded} />

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full rounded-lg" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Hotels Grid */}
      {!loading && !error && hotels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={hotel.image_url || "/placeholder.svg?height=240&width=400"}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {hotel.rating}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{hotel.name}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
                {hotel.address && (
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {hotel.address}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Amenities */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenityIcons[amenity] || <span className="h-3 w-3 mr-1">•</span>}
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{hotel.amenities.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Availability */}
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{hotel.available_rooms}</span> rooms available out of{" "}
                  {hotel.total_rooms}
                </div>

                {/* Price and Book Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">₹{hotel.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">/night</span>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && hotels.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-10 w-10 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">No hotels found in {currentLocation.city}</p>
            <p className="text-sm text-gray-500 mb-4">Be the first to add a hotel in this area!</p>
            <AddHotel currentLocation={currentLocation} onHotelAdded={handleHotelAdded} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
