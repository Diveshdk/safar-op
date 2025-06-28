"use client"

import { useEffect, useState } from "react"
import { Hotel, BedDouble, Loader2, CalendarDays, MapPin } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HotelInfo {
  id: string
  name: string
  price: number
  city: string
  description: string
  image_url?: string
}

interface Props {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
}

/**
 * Minimal hotel-booking list.
 * Later you can add CRUD endpoints (`/api/hotels`) and payment integration.
 */
export default function HotelBooking({ currentLocation, userId }: Props) {
  const [hotels, setHotels] = useState<HotelInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHotels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation?.city])

  const loadHotels = async () => {
    if (!currentLocation?.city) {
      setHotels([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: currentLocation.city }),
      })
      const data = await res.json()
      setHotels(data.hotels ?? [])
    } catch {
      // fallback demo hotel
      setHotels([
        {
          id: "demo1",
          name: "Sunset Paradise Resort",
          price: 79,
          city: currentLocation!.city,
          description: "Cozy rooms • Free breakfast • Near beach",
          image_url: "/placeholder.svg?height=240&width=400",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!currentLocation) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Set location to view available hotels</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading hotels in {currentLocation.city}…</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center">
          <Hotel className="h-5 w-5 mr-2 text-orange-500" />
          <CardTitle className="text-xl">Hotels in {currentLocation.city}</CardTitle>
        </CardHeader>
      </Card>

      {hotels.map((h) => (
        <Card key={h.id} className="overflow-hidden">
          {h.image_url && (
            <img src={h.image_url || "/placeholder.svg"} alt={h.name} className="w-full h-40 object-cover" />
          )}
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="flex items-center">
              <BedDouble className="h-4 w-4 mr-2 text-orange-500" />
              {h.name}
            </CardTitle>
            <Badge className="bg-green-100 text-green-700 font-medium">${h.price}/night</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">{h.description}</p>
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
