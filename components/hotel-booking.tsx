"use client"

import { useEffect, useState } from "react"
import { Hotel, BedDouble, Loader2, CalendarDays, MapPin, Star, RefreshCw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import AddHotel from "./add-hotel"

interface HotelInfo {
  id: string
  name: string
  price: number
  city: string
  description: string
  image_url?: string
  rating?: number
  amenities?: string[]
  total_rooms?: number
  available_rooms?: number
}

interface Props {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
}

export default function HotelBooking({ currentLocation, userId }: Props) {
  const [hotels, setHotels] = useState<HotelInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHotels()
  }, [currentLocation?.city])

  const loadHotels = async () => {
    if (!currentLocation?.city) {
      setHotels([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      console.log("Loading hotels for city:", currentLocation.city)

      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: currentLocation.city }),
      })

      const data = await res.json()
      console.log("Hotels API response:", data)

      if (res.ok && data.hotels) {
        setHotels(data.hotels)
        toast.success(`Found ${data.hotels.length} hotels in ${currentLocation.city}`)
      } else {
        throw new Error(data.error || "Failed to load hotels")
      }
    } catch (error) {
      console.error("Error loading hotels:", error)
      toast.error("Failed to load hotels")

      // Fallback demo hotels
      setHotels([
        {
          id: "demo1",
          name: "Sunset Paradise Resort",
          price: 5500,
          city: currentLocation!.city,
          description: "Cozy rooms • Free breakfast • Near beach • Swimming pool",
          image_url: "/placeholder.svg?height=240&width=400",
          rating: 4.2,
          amenities: ["WiFi", "Pool", "Breakfast"],
          available_rooms: 25,
        },
        {
          id: "demo2",
          name: "City Center Hotel",
          price: 8500,
          city: currentLocation!.city,
          description: "Modern amenities • Business center • Gym • Restaurant",
          image_url: "/placeholder.svg?height=240&width=400",
          rating: 4.5,
          amenities: ["WiFi", "Gym", "Restaurant"],
          available_rooms: 30,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleHotelAdded = () => {
    console.log("Hotel added, refreshing list...")
    loadHotels()
  }

  const handleRefresh = () => {
    loadHotels()
  }

  if (!currentLocation) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-10 w-10 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">Set location to view available hotels</p>
          </CardContent>
        </Card>
        <AddHotel currentLocation={currentLocation} onHotelAdded={handleHotelAdded} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading hotels in {currentLocation.city}…</p>
          </CardContent>
        </Card>
        <AddHotel currentLocation={currentLocation} onHotelAdded={handleHotelAdded} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Hotel className="h-5 w-5 mr-2 text-orange-500" />
            <CardTitle className="text-xl">Hotels in {currentLocation.city}</CardTitle>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
      </Card>

      <AddHotel currentLocation={currentLocation} onHotelAdded={handleHotelAdded} />

      {hotels.map((h) => (
        <Card key={h.id} className="overflow-hidden">
          {h.image_url && (
            <img src={h.image_url || "/placeholder.svg"} alt={h.name} className="w-full h-40 object-cover" />
          )}
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-2 text-orange-500" />
              <CardTitle>{h.name}</CardTitle>
              {h.rating && (
                <Badge variant="secondary" className="ml-2">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {h.rating}
                </Badge>
              )}
            </div>
            <Badge className="bg-green-100 text-green-700 font-medium">₹{h.price}/night</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">{h.description}</p>

            {h.amenities && h.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {h.amenities.slice(0, 4).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {h.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{h.amenities.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {h.available_rooms && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{h.available_rooms}</span> rooms available
              </p>
            )}

            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white">
              <CalendarDays className="h-4 w-4 mr-1" />
              Book Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
