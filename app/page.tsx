"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { MapPin, Search, MessageSquare, Camera, Calendar, Hotel, Users, Globe, Navigation, Compass } from "lucide-react"

import LocationSetup from "@/components/location-setup"
import PlaceSearch from "@/components/place-search"
import LocationChat from "@/components/location-chat"
import UserPosts from "@/components/user-posts"
import CreatePost from "@/components/create-post"
import TripPlanner from "@/components/trip-planner"
import HotelBooking from "@/components/hotel-booking"

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
    name: string
    city: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showAllPosts, setShowAllPosts] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleLocationSet = (location: { lat: number; lng: number; name: string; city: string }) => {
    setCurrentLocation(location)
    console.log("Location set:", location)
  }

  const handlePostCreated = () => {
    setShowCreatePost(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-slate-600 text-white p-3 rounded-2xl mr-4">
                  <Compass className="h-8 w-8" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">SAFAR</h1>
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
                Your AI-powered travel companion for discovering, planning, and sharing amazing journeys ✈️
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 text-lg">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="lg" variant="outline" className="px-8 py-3 text-lg bg-transparent">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center p-6 shadow-xl border-0 bg-white">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">AI-Powered Discovery</h3>
                <p className="text-gray-600">Discover amazing places with intelligent recommendations</p>
              </Card>

              <Card className="text-center p-6 shadow-xl border-0 bg-white">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Smart Trip Planning</h3>
                <p className="text-gray-600">Create personalized itineraries with AI assistance</p>
              </Card>

              <Card className="text-center p-6 shadow-xl border-0 bg-white">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Travel Community</h3>
                <p className="text-gray-600">Connect with travelers and share experiences</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-slate-600 text-white p-2 rounded-xl mr-3">
                <Compass className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">SAFAR</h1>
            </div>
            <div className="flex items-center space-x-4">
              {currentLocation && (
                <div className="hidden sm:flex items-center text-sm font-medium text-gray-600 bg-slate-100 rounded-full px-3 py-1 border border-slate-200">
                  <MapPin className="h-4 w-4 mr-1 text-slate-600" />
                  <span className="truncate max-w-32">{currentLocation.city}</span>
                </div>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {[
              { id: "home", label: "Home", icon: Navigation },
              { id: "explore", label: "Explore", icon: Search },
              { id: "chat", label: "Local Chat", icon: MessageSquare },
              { id: "posts", label: "Posts", icon: Camera },
              { id: "planner", label: "Trip Planner", icon: Calendar },
              { id: "hotels", label: "Hotels", icon: Hotel },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-slate-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Location Setup */}
          {!currentLocation && (
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                  <MapPin className="h-6 w-6 mr-3 text-slate-600" />
                  Set Your Location 📍
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Let us know where you are to get personalized recommendations and connect with local travelers
                </p>
              </CardHeader>
              <CardContent>
                <LocationSetup onLocationSet={handleLocationSet} />
              </CardContent>
            </Card>
          )}

          {/* Home Tab */}
          {activeTab === "home" && currentLocation && (
            <div className="space-y-6 sm:space-y-8">
              {/* Welcome Card */}
              <Card className="shadow-xl border-0 bg-white">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      Welcome to {currentLocation.city}! 🌟
                    </h2>
                    <p className="text-gray-600 text-lg mb-6">
                      Ready to explore, plan, and share your travel experiences?
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <Button
                        onClick={() => setActiveTab("explore")}
                        className="flex flex-col items-center p-4 h-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                        variant="outline"
                      >
                        <Search className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium">Explore</span>
                      </Button>
                      <Button
                        onClick={() => setActiveTab("planner")}
                        className="flex flex-col items-center p-4 h-auto bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                        variant="outline"
                      >
                        <Calendar className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium">Plan Trip</span>
                      </Button>
                      <Button
                        onClick={() => setShowCreatePost(true)}
                        className="flex flex-col items-center p-4 h-auto bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                        variant="outline"
                      >
                        <Camera className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium">Share</span>
                      </Button>
                      <Button
                        onClick={() => setActiveTab("chat")}
                        className="flex flex-col items-center p-4 h-auto bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200"
                        variant="outline"
                      >
                        <MessageSquare className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium">Chat</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts Preview */}
              <UserPosts
                currentLocation={currentLocation}
                userId={user?.id || ""}
                showAll={false}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}

          {/* Explore Tab */}
          {activeTab === "explore" && currentLocation && (
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Search className="h-6 w-6 mr-3 text-slate-600" />
                  Explore Places ✨
                </CardTitle>
                <p className="text-gray-600">Discover amazing destinations with AI-powered recommendations</p>
              </CardHeader>
              <CardContent>
                <PlaceSearch currentLocation={currentLocation} />
              </CardContent>
            </Card>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && currentLocation && (
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-3 text-slate-600" />
                  Local Chat 💬
                </CardTitle>
                <p className="text-gray-600">Connect with travelers in {currentLocation.city}</p>
              </CardHeader>
              <CardContent>
                <LocationChat
                  currentLocation={currentLocation}
                  userId={user?.id || ""}
                  userName={user?.fullName || user?.firstName || "Anonymous"}
                  userAvatar={user?.imageUrl || ""}
                />
              </CardContent>
            </Card>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && currentLocation && (
            <div className="space-y-6 sm:space-y-8">
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <Camera className="h-6 w-6 mr-3 text-slate-600" />
                        Travel Stories 📸
                      </CardTitle>
                      <p className="text-gray-600 mt-1">Share and discover travel experiences</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => setShowCreatePost(true)}
                        className="bg-slate-600 hover:bg-slate-700 text-white"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Create Post
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAllPosts(!showAllPosts)}
                        className="border-slate-300"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {showAllPosts ? "Local Posts" : "All Posts"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <UserPosts
                currentLocation={currentLocation}
                userId={user?.id || ""}
                showAll={showAllPosts}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}

          {/* Trip Planner Tab */}
          {activeTab === "planner" && currentLocation && (
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="h-6 w-6 mr-3 text-slate-600" />
                  AI Trip Planner 🗺️
                </CardTitle>
                <p className="text-gray-600">Create personalized itineraries with AI assistance</p>
              </CardHeader>
              <CardContent>
                <TripPlanner currentLocation={currentLocation} />
              </CardContent>
            </Card>
          )}

          {/* Hotels Tab */}
          {activeTab === "hotels" && currentLocation && (
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Hotel className="h-6 w-6 mr-3 text-slate-600" />
                  Hotel Booking 🏨
                </CardTitle>
                <p className="text-gray-600">Find and book the perfect accommodation</p>
              </CardHeader>
              <CardContent>
                <HotelBooking currentLocation={currentLocation} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      {showCreatePost && currentLocation && user && (
        <CreatePost
          currentLocation={currentLocation}
          userId={user.id}
          userName={user.fullName || user.firstName || "Anonymous"}
          userAvatar={user.imageUrl || ""}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  )
}
