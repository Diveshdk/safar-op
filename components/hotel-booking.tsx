"use client"

import { useEffect, useState } from "react"
import { Hotel, BedDouble, Loader2, CalendarDays, MapPin } from 'lucide-react'
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
          name: "Business Executive Hotel",
          price: 5500,
          city: currentLocation!.city,
          description: "Executive rooms • Business center • Conference facilities • Premium location",
          image_url: "/placeholder.svg?height=240&width=400",
        },
        {
          id: "demo2",
          name: "Corporate Suites",
          price: 8500,
          city: currentLocation!.city,
          description: "Modern amenities • Meeting rooms • High-speed internet • Airport shuttle",
          image_url: "/placeholder.svg?height=240&width=400",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!currentLocation) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-8 text-center">
          <MapPin className="h-10 w-10 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Set location to view available accommodations</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-slate-600" />
          <p className="text-slate-600">Loading accommodations in {currentLocation.city}…</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader className="flex items-center">
          <Hotel className="h-5 w-5 mr-2 text-slate-600" />
          <CardTitle className="text-xl text-slate-800">Business Accommodations in {currentLocation.city}</CardTitle>
        </CardHeader>
      </Card>

      {hotels.map((h) => (
        <Card key={h.id} className="overflow-hidden border-slate-200 hover-lift">
          {h.image_url && (
            <img src={h.image_url || "/placeholder.svg"} alt={h.name} className="w-full h-40 object-cover" />
          )}
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="flex items-center text-slate-800">
              <BedDouble className="h-4 w-4 mr-2 text-slate-600" />
              {h.name}
            </CardTitle>
            <Badge className="bg-slate-100 text-slate-700 font-medium">₹{h.price}/night</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-slate-700 text-sm leading-relaxed">{h.description}</p>
            <Button size="sm" className="btn-primary">
              <CalendarDays className="h-4 w-4 mr-1" />
              Reserve Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
