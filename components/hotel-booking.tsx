"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Coffee, Search } from "lucide-react"
import { AddHotel } from "./add-hotel"
import { useToast } from "@/hooks/use-toast"

interface Hotel {
  id: string
  name: string
  location: string
  description: string
  price_range: string
  amenities: string[]
  rating: number
  image_url?: string
  created_at: string
}

export function HotelBooking() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLocation, setSearchLocation] = useState("")
  const { toast } = useToast()

  const fetchHotels = async (location?: string) => {
    try {
      setLoading(true)
      const url = location ? `/api/hotels?location=${encodeURIComponent(location)}` : "/api/hotels"

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch hotels")
      }

      setHotels(data.hotels || [])
    } catch (error) {
      console.error("Error fetching hotels:", error)
      toast({
        title: "Error",
        description: "Failed to load hotels",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const handleSearch = () => {
    fetchHotels(searchLocation)
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("wifi") || amenityLower.includes("internet")) {
      return <Wifi className="w-4 h-4" />
    }
    if (amenityLower.includes("parking") || amenityLower.includes("car")) {
      return <Car className="w-4 h-4" />
    }
    if (amenityLower.includes("breakfast") || amenityLower.includes("coffee")) {
      return <Coffee className="w-4 h-4" />
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Hotel Booking</h1>
        <p className="text-gray-600">Find and book the perfect accommodation for your stay</p>
      </div>

      <AddHotel />

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search by location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading hotels...</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hotels found. Be the first to add one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden">
              {hotel.image_url && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={hotel.image_url || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{hotel.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hotel.location}
                    </div>
                  </div>
                  {hotel.rating > 0 && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{hotel.rating}</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">{hotel.description}</p>

                <div className="mb-3">
                  <p className="font-semibold text-green-600">{hotel.price_range}</p>
                </div>

                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs flex items-center gap-1">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{hotel.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button className="w-full">Book Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
