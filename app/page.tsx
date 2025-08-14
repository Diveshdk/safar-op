"use client"

import { useEffect, useState } from "react"
import { ClerkProvider, useUser, SignInButton, SignOutButton, useAuth } from "@clerk/nextjs"
import { MapPin, Search, MessageCircle, Plus, Hotel, Camera, Heart, Users, Plane, Globe, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from "next/dynamic"

// Lazy load the real LocationSetup component
const LocationSetup = dynamic(() => import("@/components/location-setup"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-slate-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium text-sm sm:text-base">Loading location setup...</p>
        </CardContent>
      </Card>
    </div>
  ),
})

// Replace the fallback components with real dynamic imports
const PlaceSearch = dynamic(() => import("@/components/place-search"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-white">
      <CardContent className="p-8 sm:p-12 text-center">
        <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-slate-400" />
        <p className="text-gray-600 font-medium text-base sm:text-lg">Loading search...</p>
      </CardContent>
    </Card>
  ),
})

const LocationChat = dynamic(() => import("@/components/location-chat"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-white">
      <CardContent className="p-8 sm:p-12 text-center">
        <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-emerald-400" />
        <p className="text-gray-600 font-medium text-base sm:text-lg">Loading chat...</p>
      </CardContent>
    </Card>
  ),
})

const UserPosts = dynamic(() => import("@/components/user-posts"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-white">
      <CardContent className="p-8 sm:p-12 text-center">
        <Camera className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-purple-400" />
        <p className="text-gray-600 font-medium text-base sm:text-lg">Loading posts...</p>
      </CardContent>
    </Card>
  ),
})

const HotelBooking = dynamic(() => import("@/components/hotel-booking"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-white">
      <CardContent className="p-8 sm:p-12 text-center">
        <Hotel className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-orange-400" />
        <p className="text-gray-600 font-medium text-base sm:text-lg">Loading hotels...</p>
      </CardContent>
    </Card>
  ),
})

const CreatePost = dynamic(() => import("@/components/create-post"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-6 sm:p-8 text-center">
          <Plus className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-purple-400" />
          <p className="text-gray-700 font-medium text-sm sm:text-base">Loading create post...</p>
        </CardContent>
      </Card>
    </div>
  ),
})

const TripPlanner = dynamic(() => import("@/components/trip-planner"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-white">
      <CardContent className="p-8 sm:p-12 text-center">
        <Plane className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-blue-400" />
        <p className="text-gray-600 font-medium text-base sm:text-lg">Loading trip planner...</p>
      </CardContent>
    </Card>
  ),
})

function AppContent() {
  const { user, isLoaded } = useUser()
  const { userId, sessionId, getToken, isSignedIn } = useAuth()
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white px-4">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-white border-t-transparent mx-auto mb-6 sm:mb-8"></div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">SAFAR</h1>
          <p className="text-slate-300 text-base sm:text-lg font-medium">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 sm:w-96 sm:h-96 bg-slate-800 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 sm:w-96 sm:h-96 bg-slate-800 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-slate-700 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Hero Section */}
            <div className="mb-12 sm:mb-16">
              <div className="mb-8 sm:mb-12">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-4 sm:mb-6 text-white tracking-tight">
                  SAFAR
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 mb-4 sm:mb-6 font-light tracking-wide px-4">
                  Smart AI-Powered Travel Companion
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-slate-400 text-base sm:text-lg px-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="font-medium">Discover</span>
                  </div>
                  <div className="hidden sm:block w-2 h-2 bg-slate-500 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="font-medium">Connect</span>
                  </div>
                  <div className="hidden sm:block w-2 h-2 bg-slate-500 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="font-medium">Explore</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
              <div className="bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-700 hover:bg-slate-750 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <Search className="h-10 w-10 sm:h-14 sm:w-14 mx-auto mb-4 sm:mb-6 text-blue-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">AI-Powered Search</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  Get instant travel insights with intelligent recommendations
                </p>
              </div>
              <div className="bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-700 hover:bg-slate-750 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <MessageCircle className="h-10 w-10 sm:h-14 sm:w-14 mx-auto mb-4 sm:mb-6 text-emerald-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Live Local Chat</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  Connect with travelers and locals in real-time
                </p>
              </div>
              <div className="bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-700 hover:bg-slate-750 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <Hotel className="h-10 w-10 sm:h-14 sm:w-14 mx-auto mb-4 sm:mb-6 text-orange-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Hotel Booking</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  Find and book perfect accommodations worldwide
                </p>
              </div>
              <div className="bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-700 hover:bg-slate-750 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <Star className="h-10 w-10 sm:h-14 sm:w-14 mx-auto mb-4 sm:mb-6 text-yellow-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Travel Community</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  Share experiences with fellow adventurers
                </p>
              </div>
            </div>

            {/* Sign In Section */}
            <div className="bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-2xl max-w-lg mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to explore?</h3>
              <p className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Join thousands of travelers discovering amazing places around the world
              </p>

              <SignInButton mode="modal">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 mb-4 sm:mb-6"
                  size="lg"
                >
                  <Star className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Start Your Journey
                  <span className="ml-2 sm:ml-3">→</span>
                </Button>
              </SignInButton>

              <p className="text-slate-500 text-xs sm:text-sm">
                Sign in with Google • Free forever • No credit card required
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-slate-500 px-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">10K+ Travelers</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">50+ Countries</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">4.9 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">SAFAR</h1>
              {currentLocation && (
                <div className="hidden sm:flex items-center text-sm font-medium text-gray-700 bg-slate-100 rounded-full px-3 sm:px-4 py-1 sm:py-2 border border-slate-200">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-slate-600" />
                  <span className="truncate max-w-32 sm:max-w-none">{currentLocation.city}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                onClick={() => setShowCreatePost(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 sm:px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">Post</span>
              </Button>

              {user && (
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 sm:ring-4 ring-slate-200 shadow-lg">
                  <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-slate-600 text-white font-semibold text-sm">
                    {user.firstName?.charAt(0) ||
                      user.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              )}

              <SignOutButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-2 sm:px-4 font-medium text-sm"
                >
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Location Bar */}
      {currentLocation && (
        <div className="sm:hidden bg-slate-100 border-b border-slate-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-medium text-slate-700">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{currentLocation.city}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLocationSetup(true)}
              className="text-blue-600 text-xs font-medium hover:bg-blue-50 rounded-full px-3 py-1"
            >
              Change
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide">
            {[
              { id: "home", label: "Home", icon: Heart, color: "text-rose-600", bgColor: "bg-rose-50" },
              { id: "search", label: "Explore", icon: Search, color: "text-blue-600", bgColor: "bg-blue-50" },
              { id: "planner", label: "Planner", icon: Plane, color: "text-indigo-600", bgColor: "bg-indigo-50" },
              { id: "chat", label: "Chat", icon: MessageCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" },
              { id: "posts", label: "Posts", icon: Camera, color: "text-purple-600", bgColor: "bg-purple-50" },
              { id: "hotels", label: "Hotels", icon: Hotel, color: "text-orange-600", bgColor: "bg-orange-50" },
            ].map(({ id, label, icon: Icon, color, bgColor }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 sm:space-x-3 py-3 sm:py-4 px-3 sm:px-6 border-b-3 transition-all whitespace-nowrap font-medium rounded-t-xl text-sm sm:text-base ${
                  activeTab === id
                    ? `border-slate-600 ${color} ${bgColor} shadow-sm`
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{id === "planner" ? "Plan" : label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20 sm:pb-24">
        {activeTab === "home" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Welcome Hero */}
            <div className="relative bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
                  Welcome back, {user?.firstName || "Traveler"}! 🌍
                </h2>
                <p className="text-slate-300 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                  Ready for your next adventure? Discover amazing places and connect with fellow travelers around the
                  world.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => setActiveTab("search")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Explore Places
                  </Button>
                  <Button
                    onClick={() => setActiveTab("chat")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Join Local Chat
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-blue-50 hover:scale-105"
                onClick={() => setActiveTab("search")}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-blue-600" />
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">Explore</p>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-emerald-50 hover:scale-105"
                onClick={() => setActiveTab("chat")}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-emerald-600" />
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">Local Chat</p>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-orange-50 hover:scale-105"
                onClick={() => setActiveTab("hotels")}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <Hotel className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-orange-600" />
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">Hotels</p>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-purple-50 hover:scale-105"
                onClick={() => setShowCreatePost(true)}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <Plus className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-purple-600" />
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">Share</p>
                </CardContent>
              </Card>
            </div>

            <UserPosts
              currentLocation={currentLocation}
              userId={userId || ""}
              showAll={false}
              refreshTrigger={postsRefreshTrigger}
            />
          </div>
        )}

        {activeTab === "search" && <PlaceSearch currentLocation={currentLocation} />}
        {activeTab === "chat" && (
          <LocationChat
            currentLocation={currentLocation}
            userId={userId || ""}
            userName={user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Anonymous"}
            userAvatar={user?.imageUrl || ""}
          />
        )}
        {activeTab === "posts" && (
          <UserPosts currentLocation={currentLocation} userId={userId || ""} refreshTrigger={postsRefreshTrigger} />
        )}
        {activeTab === "hotels" && <HotelBooking currentLocation={currentLocation} userId={userId || ""} />}
        {activeTab === "planner" && <TripPlanner currentLocation={currentLocation} />}
      </main>

      {showCreatePost && (
        <CreatePost
          currentLocation={currentLocation}
          userId={userId || ""}
          userName={user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Anonymous"}
          userAvatar={user?.imageUrl || ""}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false)
            setPostsRefreshTrigger((prev) => prev + 1)
          }}
        />
      )}
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
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-0 max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-red-500 mb-6 text-base sm:text-lg">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold w-full sm:w-auto"
          >
            Reload Page
          </Button>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white px-4">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-white border-t-transparent mx-auto mb-6 sm:mb-8"></div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">SAFAR</h1>
          <p className="text-slate-300 text-base sm:text-lg font-medium">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-0 max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-red-500 text-base sm:text-lg">Missing Clerk publishable key</p>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#1e40af",
          colorBackground: "#ffffff",
          colorInputBackground: "#f8fafc",
          colorInputText: "#1e293b",
        },
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl",
          card: "shadow-2xl border-0 rounded-2xl",
        },
      }}
    >
      <AppContent />
    </ClerkProvider>
  )
}
