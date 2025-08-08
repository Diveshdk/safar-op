"use client"

import { useEffect, useState } from "react"
import { useUser, SignInButton, SignOutButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { MapPin, Search, MessageCircle, Plus, Hotel, Camera, Heart, Users, Plane, Globe, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from "next/dynamic"

// Lazy load the real LocationSetup component
const LocationSetup = dynamic(() => import("@/components/location-setup"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location setup...</p>
        </CardContent>
      </Card>
    </div>
  ),
})

// Replace the fallback components with real dynamic imports
const PlaceSearch = dynamic(() => import("@/components/place-search"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading search...</p>
      </CardContent>
    </Card>
  ),
})

const LocationChat = dynamic(() => import("@/components/location-chat"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading chat...</p>
      </CardContent>
    </Card>
  ),
})

const UserPosts = dynamic(() => import("@/components/user-posts"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading posts...</p>
      </CardContent>
    </Card>
  ),
})

const HotelBooking = dynamic(() => import("@/components/hotel-booking"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <Hotel className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading hotels...</p>
      </CardContent>
    </Card>
  ),
})

const CreatePost = dynamic(() => import("@/components/create-post"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading create post...</p>
        </CardContent>
      </Card>
    </div>
  ),
})

const TripPlanner = dynamic(() => import("@/components/trip-planner"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <Plane className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading trip planner...</p>
      </CardContent>
    </Card>
  ),
})

function AppContent() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
    name: string
    city: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState<"home" | "search" | "chat" | "posts" | "hotels" | "planner">("home")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showLocationSetup, setShowLocationSetup] = useState(false)
  const [postsRefreshTrigger, setPostsRefreshTrigger] = useState(0)

  useEffect(() => {
    if (user && !currentLocation) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setShowLocationSetup(true)
      }, 500)
    }
  }, [user, currentLocation])

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-600 mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold mb-2 text-gray-800">SAFAR</h1>
          <p className="text-gray-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SignedOut>
        <div className="min-h-screen bg-white relative overflow-hidden">
          {/* Navigation */}
          <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-gray-800">SAFAR</h1>
                  <span className="text-sm text-gray-500">by vista</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="relative pt-16 pb-20 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  TRIP INSPIRATION
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-8">
                  FIND THE PERFECT PLACE TO GO ACTIVITIES,<br />
                  HOTELS, AND MORE
                </h1>
                
                {/* Category Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {['ALL', 'ADVENTURE', 'HIGH ADRENALINE', 'WATER SPORTS', 'HISTORY & CULTURE', 'OTHER ACTIVITIES'].map((category) => (
                    <button
                      key={category}
                      className="px-6 py-2 border-2 border-cyan-400 text-cyan-600 hover:bg-cyan-400 hover:text-white transition-colors rounded-sm text-sm font-medium"
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Activity Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                  {[
                    { title: 'HIKING', subtitle: 'An Ultimate Luxury Ireland Journey', image: '/placeholder.jpg' },
                    { title: 'ANIMAL WATCHING', subtitle: 'A studding off beaten Safari path to China', image: '/placeholder.jpg' },
                    { title: 'SURFING', subtitle: 'Journeying Through Nelson Mandela\'s Roots', image: '/placeholder.jpg' },
                    { title: 'CYCLING', subtitle: 'The Ultimate Croatian Epicurean Journey', image: '/placeholder.jpg' },
                  ].map((activity, index) => (
                    <Card key={index} className="relative overflow-hidden group cursor-pointer">
                      <div className="aspect-[4/5] relative">
                        <img 
                          src={activity.image || "/placeholder.svg"} 
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-white/20 backdrop-blur-sm rounded">
                            <Globe className="w-3 h-3 mr-1" />
                            {activity.title}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-semibold text-sm leading-tight">
                            {activity.subtitle}
                          </h3>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  3 STEPS TO THE PERFECT TRIP
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                  FIND TRAVEL PERFECTION, WITH THE<br />
                  WISDOM OF EXPERTS
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-16 max-w-3xl mx-auto">
                  Naturally head of the class when it comes to luxury travel planning, because we do more homework than anyone else,
                  with a few little sweeteners thrown in! Travel to the four corners of the world, without going around in circles.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Users className="w-16 h-16 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Tell us what you want to do</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Fill out a 2-minute questionnaire about how you like to travel
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Search className="w-16 h-16 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Share Your Travel Preference & Dates</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      It all happens online. We recommend everything to your vision
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Plane className="w-16 h-16 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">We'll give you tailored recommendations</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Once you're happy with your final plan, We handle everything for you
                    </p>
                  </div>
                </div>

                <SignInButton mode="modal">
                  <Button className="bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider">
                    LETS PLAN YOUR TRIP
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>

          {/* Value Section */}
          <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
                  THE VALUE FOR EXPERIENCE
                </h2>
                <p className="text-lg text-gray-600 mb-12">
                  Relax... You're with us! We make it simple.
                </p>
                
                <SignInButton mode="modal">
                  <Button className="bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider mb-16">
                    START PLANNING
                  </Button>
                </SignInButton>

                {/* Illustration area */}
                <div className="relative h-64 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                  <div className="text-gray-400">
                    <Users className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-sm">Travel illustration area</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Location Setup Modal */}
        {showLocationSetup && (
          <LocationSetup
            onLocationSet={(location) => {
              setCurrentLocation(location)
              setShowLocationSetup(false)
            }}
            onClose={() => setShowLocationSetup(false)}
          />
        )}

        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-800">
                  SAFAR
                </h1>
                {currentLocation && (
                  <div className="hidden sm:flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                    <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                    {currentLocation.city}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowCreatePost(true)}
                  size="sm"
                  className="bg-cyan-400 hover:bg-cyan-500 text-white rounded-full px-4"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Post</span>
                </Button>

                {user && (
                  <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-600 text-white">
                      {user.firstName?.charAt(0) ||
                        user.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <SignOutButton>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Location Bar */}
        {currentLocation && (
          <div className="sm:hidden bg-blue-50 border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-blue-700">
                <MapPin className="h-4 w-4 mr-1" />
                {currentLocation.city}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSetup(true)}
                className="text-blue-600 text-xs"
              >
                Change
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="bg-white border-b sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "home", label: "Home", icon: Heart, color: "text-red-500" },
                { id: "search", label: "Explore", icon: Search, color: "text-blue-500" },
                { id: "planner", label: "Trip Planner", icon: Plane, color: "text-indigo-500" },
                { id: "chat", label: "Chat", icon: MessageCircle, color: "text-green-500" },
                { id: "posts", label: "Posts", icon: Camera, color: "text-purple-500" },
                { id: "hotels", label: "Hotels", icon: Hotel, color: "text-orange-500" },
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === id
                      ? `border-cyan-400 ${color} bg-cyan-50`
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 pb-20">
          {activeTab === "home" && (
            <div className="space-y-6">
              {/* Welcome Hero */}
              <div className="relative bg-white rounded-lg border border-gray-200 p-6 overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
                    Welcome back, {user?.firstName || "Traveler"}! 🌍
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Ready for your next adventure? Discover amazing places and connect with fellow travelers.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => setActiveTab("search")}
                      className="bg-cyan-400 hover:bg-cyan-500 text-white"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Explore Places
                    </Button>
                    <Button
                      onClick={() => setActiveTab("chat")}
                      variant="outline"
                      className="border-cyan-400 text-cyan-600 hover:bg-cyan-50"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Local Chat
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                  onClick={() => setActiveTab("search")}
                >
                  <CardContent className="p-4 text-center">
                    <Search className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium text-gray-700">Explore</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200" onClick={() => setActiveTab("chat")}>
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium text-gray-700">Local Chat</p>
                  </CardContent>
                </Card>
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                  onClick={() => setActiveTab("hotels")}
                >
                  <CardContent className="p-4 text-center">
                    <Hotel className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-sm font-medium text-gray-700">Hotels</p>
                  </CardContent>
                </Card>
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                  onClick={() => setShowCreatePost(true)}
                >
                  <CardContent className="p-4 text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm font-medium text-gray-700">Share</p>
                  </CardContent>
                </Card>
              </div>

              <UserPosts
                currentLocation={currentLocation}
                userId={user?.id || ""}
                showAll={false}
                refreshTrigger={postsRefreshTrigger}
              />
            </div>
          )}

          {activeTab === "search" && <PlaceSearch currentLocation={currentLocation} />}
          {activeTab === "chat" && (
            <LocationChat
              currentLocation={currentLocation}
              userId={user?.id || ""}
              userName={user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Anonymous"}
              userAvatar={user?.imageUrl || ""}
            />
          )}
          {activeTab === "posts" && (
            <UserPosts currentLocation={currentLocation} userId={user?.id || ""} refreshTrigger={postsRefreshTrigger} />
          )}
          {activeTab === "hotels" && <HotelBooking currentLocation={currentLocation} userId={user?.id || ""} />}
          {activeTab === "planner" && <TripPlanner currentLocation={currentLocation} />}
        </main>

        {showCreatePost && (
          <CreatePost
            currentLocation={currentLocation}
            userId={user?.id || ""}
            userName={user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Anonymous"}
            userAvatar={user?.imageUrl || ""}
            onClose={() => setShowCreatePost(false)}
            onPostCreated={() => {
              setShowCreatePost(false)
              setPostsRefreshTrigger((prev) => prev + 1)
            }}
          />
        )}
      </SignedIn>
    </div>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setMounted(true)
    } catch (err) {
      setError("Failed to initialize app")
      console.error("App initialization error:", err)
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-600 mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold mb-2 text-gray-800">SAFAR</h1>
          <p className="text-gray-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return <AppContent />
}
