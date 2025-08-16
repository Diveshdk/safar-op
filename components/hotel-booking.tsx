"use client"

import { useState, useEffect } from "react"
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, Users, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import AddHotel from "./add-hotel"

interface Hotel {
  id: string
  name: string
  description: string
  city: string
  address?: string
  price: number
  image_url: string
  amenities: string[]
  rating: number
  available_rooms: number
}

interface Props {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
}

export default function HotelBooking({ currentLocation }: Props) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchHotels = async () => {
    if (!currentLocation) return

    try {
      setLoading(true)
      console.log("Fetching hotels for:", currentLocation.city)

      const response = await fetch(`/api/hotels?city=${encodeURIComponent(currentLocation.city)}`)
      const data = await response.json()

      console.log("Hotels response:", data)

      if (data.success) {
        setHotels(data.hotels || [])
        if (data.hotels?.length > 0) {
          toast.success(`Found ${data.hotels.length} hotels in ${currentLocation.city}`)
        }
      } else {
        throw new Error(data.error || "Failed to fetch hotels")
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
      toast.error("Failed to load hotels")
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [currentLocation, refreshKey])

  const handleHotelAdded = () => {
    console.log("Hotel added, refreshing list...")
    setRefreshKey((prev) => prev + 1)
    toast.success("Hotel list refreshed!")
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("wifi")) return <Wifi className="h-3 w-3" />
    if (amenityLower.includes("parking") || amenityLower.includes("car")) return <Car className="h-3 w-3" />
    if (amenityLower.includes("restaurant") || amenityLower.includes("food")) return <Utensils className="h-3 w-3" />
    if (amenityLower.includes("gym") || amenityLower.includes("fitness")) return <Dumbbell className="h-3 w-3" />
    return <Users className="h-3 w-3" />
  }

  if (!currentLocation) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Set your location to find hotels</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Hotel and Refresh */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Hotels in {currentLocation.city}</h2>
          <p className="text-gray-600 text-sm">Find and book the perfect accommodation</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <div className="min-w-[140px]">
            <AddHotel currentLocation={currentLocation} onHotelAdded={handleHotelAdded} />
          </div>
        </div>
      </div>

      {/* Hotels List */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : hotels.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={hotel.image_url || "/placeholder.svg"}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=240&width=400"
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {hotel.rating}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{hotel.name}</CardTitle>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  {hotel.address || hotel.city}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{hotel.description}</p>

                {/* Amenities */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {getAmenityIcon(amenity)}
                        <span className="ml-1">{amenity}</span>
                      </Badge>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{hotel.amenities.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Price and Booking */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <div className="text-lg font-semibold">₹{hotel.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">per night</div>
                  </div>
                  <div className="text-right">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                      Book Now
                    </Button>
                    <div className="text-xs text-gray-500 mt-1">{hotel.available_rooms} rooms left</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No hotels found</h3>
            <p className="text-gray-600 mb-4">No hotels available in {currentLocation.city} at the moment.</p>
            <AddHotel currentLocation={currentLocation} onHotelAdded={handleHotelAdded} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
