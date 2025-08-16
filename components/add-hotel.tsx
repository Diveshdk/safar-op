"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Plus, Hotel, Loader2, MapPin, DollarSign, ImageIcon, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Props {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  onHotelAdded?: () => void
}

export default function AddHotel({ currentLocation, onHotelAdded }: Props) {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: currentLocation?.city || "",
    address: "",
    price_per_night: "",
    image_url: "",
    amenities: "",
    total_rooms: "1",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please sign in to add a hotel")
      return
    }

    if (!formData.name.trim() || !formData.description.trim() || !formData.city.trim() || !formData.price_per_night) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      const amenitiesArray = formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0)

      const hotelData = {
        name: formData.name,
        description: formData.description,
        city: formData.city,
        address: formData.address,
        latitude: currentLocation?.lat || null,
        longitude: currentLocation?.lng || null,
        price_per_night: formData.price_per_night,
        image_url: formData.image_url || "/placeholder.svg?height=240&width=400",
        amenities: amenitiesArray,
        total_rooms: formData.total_rooms,
      }

      console.log("Adding hotel:", hotelData)

      const response = await fetch("/api/hotels/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelData),
      })

      const result = await response.json()
      console.log("Add hotel response:", result)

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`)
      }

      console.log("Hotel added successfully:", result)
      toast.success("Hotel added successfully!")

      // Reset form
      setFormData({
        name: "",
        description: "",
        city: currentLocation?.city || "",
        address: "",
        price_per_night: "",
        image_url: "",
        amenities: "",
        total_rooms: "1",
      })

      setIsOpen(false)
      onHotelAdded?.()
    } catch (error) {
      console.error("Error adding hotel:", error)
      toast.error(error instanceof Error ? error.message : "Failed to add hotel")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Hotel className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">Sign in to add your hotel</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Your Hotel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Hotel className="h-5 w-5 mr-2 text-orange-500" />
            Add Your Hotel
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Hotel Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter hotel name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your hotel, amenities, and unique features"
                required
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter full address"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Pricing and Rooms */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-sm font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Price per Night (₹) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price_per_night}
                  onChange={(e) => handleInputChange("price_per_night", e.target.value)}
                  placeholder="Enter price in rupees"
                  required
                  min="1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="rooms" className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Total Rooms
                </Label>
                <Input
                  id="rooms"
                  type="number"
                  value={formData.total_rooms}
                  onChange={(e) => handleInputChange("total_rooms", e.target.value)}
                  placeholder="Number of rooms"
                  min="1"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="image" className="text-sm font-medium flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                Image URL
              </Label>
              <Input
                id="image"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="Enter image URL (optional)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="amenities" className="text-sm font-medium">
                Amenities
              </Label>
              <Input
                id="amenities"
                value={formData.amenities}
                onChange={(e) => handleInputChange("amenities", e.target.value)}
                placeholder="WiFi, Pool, Gym, Restaurant (comma separated)"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Separate amenities with commas</p>
            </div>
          </div>

          {/* Current Location Info */}
          {currentLocation && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <MapPin className="h-4 w-4 inline mr-1" />
                Hotel will be listed in: <Badge variant="secondary">{currentLocation.city}</Badge>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Hotel...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hotel
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
