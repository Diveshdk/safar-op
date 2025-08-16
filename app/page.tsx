"use client"

import { useState, useEffect } from "react"
import { MapPin, MessageSquare, Search, Calendar, Plus, Globe, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

import LocationSetup from "@/components/location-setup"
import CreatePost from "@/components/create-post"
import UserPosts from "@/components/user-posts"
import LocationChat from "@/components/location-chat"
import PlaceSearch from "@/components/place-search"
import TripPlanner from "@/components/trip-planner"

export default function Home() {
  const { user, isLoaded } = useUser()
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
    name: string
    city: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      try {
        setCurrentLocation(JSON.parse(savedLocation))
      } catch (error) {
        console.error("Error parsing saved location:", error)
        localStorage.removeItem("userLocation")
      }
    }
  }, [])

  const handleLocationSet = (location: { lat: number; lng: number; name: string; city: string }) => {
    setCurrentLocation(location)
    localStorage.setItem("userLocation", JSON.stringify(location))
    toast.success(`Location set to ${location.city}! 📍`)
  }

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
    toast.success("Post created successfully! 🎉")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <Globe className="h-16 w-16 mx-auto text-slate-600 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to SAFAR</h1>
            <p className="text-gray-600 mb-6">
              Your ultimate travel companion for discovering and sharing amazing experiences
            </p>
            <p className="text-sm text-gray-500">Please sign in to continue</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Welcome to SAFAR ✈️</h1>
              <p className="text-gray-600 mt-2 text-lg">Your ultimate travel companion</p>
            </div>
            {currentLocation && (
              <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
                <MapPin className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-gray-900">{currentLocation.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Setup */}
        {!currentLocation && (
          <div className="mb-8">
            <LocationSetup onLocationSet={handleLocationSet} />
          </div>
        )}

        {/* Main Content */}
        {currentLocation && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-white shadow-lg rounded-xl p-1 border border-gray-200">
              <TabsTrigger
                value="home"
                className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Posts</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="explore"
                className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Explore</span>
              </TabsTrigger>
              <TabsTrigger
                value="plan"
                className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Plan</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-8">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105"
                  onClick={() => setActiveTab("create")}
                >
                  <CardContent className="p-6 text-center">
                    <Plus className="h-8 w-8 mx-auto text-slate-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Share Story</h3>
                    <p className="text-sm text-gray-600">Create a new post</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105"
                  onClick={() => setActiveTab("chat")}
                >
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto text-slate-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Local Chat</h3>
                    <p className="text-sm text-gray-600">Connect with locals</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105"
                  onClick={() => setActiveTab("explore")}
                >
                  <CardContent className="p-6 text-center">
                    <Search className="h-8 w-8 mx-auto text-slate-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Explore</h3>
                    <p className="text-sm text-gray-600">Discover places</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105"
                  onClick={() => setActiveTab("plan")}
                >
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 mx-auto text-slate-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Plan Trip</h3>
                    <p className="text-sm text-gray-600">AI trip planner</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Posts */}
              <UserPosts currentLocation={currentLocation} showAll={false} refreshTrigger={refreshTrigger} />
            </TabsContent>

            <TabsContent value="create">
              <CreatePost currentLocation={currentLocation} onPostCreated={handlePostCreated} />
            </TabsContent>

            <TabsContent value="posts">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setRefreshTrigger((prev) => prev + 1)}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    Refresh Posts
                  </Button>
                </div>
                <UserPosts currentLocation={currentLocation} showAll={true} refreshTrigger={refreshTrigger} />
              </div>
            </TabsContent>

            <TabsContent value="chat">
              <LocationChat currentLocation={currentLocation} />
            </TabsContent>

            <TabsContent value="explore">
              <PlaceSearch />
            </TabsContent>

            <TabsContent value="plan">
              <TripPlanner />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
