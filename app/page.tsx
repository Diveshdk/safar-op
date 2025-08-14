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
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading location setup...</p>
        </CardContent>
      </Card>
    </div>
  ),
})

// Replace the fallback components with real dynamic imports
const PlaceSearch = dynamic(() => import("@/components/place-search"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-12 text-center">
        <Search className="h-16 w-16 mx-auto mb-6 text-indigo-400" />
        <p className="text-gray-600 font-medium text-lg">Loading search...</p>
      </CardContent>
    </Card>
  ),
})

const LocationChat = dynamic(() => import("@/components/location-chat"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-12 text-center">
        <MessageCircle className="h-16 w-16 mx-auto mb-6 text-emerald-400" />
        <p className="text-gray-600 font-medium text-lg">Loading chat...</p>
      </CardContent>
    </Card>
  ),
})

const UserPosts = dynamic(() => import("@/components/user-posts"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-12 text-center">
        <Camera className="h-16 w-16 mx-auto mb-6 text-purple-400" />
        <p className="text-gray-600 font-medium text-lg">Loading posts...</p>
      </CardContent>
    </Card>
  ),
})

const HotelBooking = dynamic(() => import("@/components/hotel-booking"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-12 text-center">
        <Hotel className="h-16 w-16 mx-auto mb-6 text-orange-400" />
        <p className="text-gray-600 font-medium text-lg">Loading hotels...</p>
      </CardContent>
    </Card>
  ),
})

const CreatePost = dynamic(() => import("@/components/create-post"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <Plus className="h-16 w-16 mx-auto mb-6 text-purple-400" />
          <p className="text-gray-700 font-medium">Loading create post...</p>
        </CardContent>
      </Card>
    </div>
  ),
})

const TripPlanner = dynamic(() => import("@/components/trip-planner"), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-12 text-center">
        <Plane className="h-16 w-16 mx-auto mb-6 text-blue-400" />
        <p className="text-gray-600 font-medium text-lg">Loading trip planner...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent mx-auto mb-8"></div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">SAFAR</h1>
          <p className="text-indigo-100 text-lg font-medium">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex items-center">
          <div className="max-w-2xl mx-auto text-center text-white">
            {/* Hero Section */}
            <div className="mb-16">
              <div className="mb-12">
                <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent tracking-tight">
                  SAFAR
                </h1>
                <p className="text-2xl md:text-3xl text-indigo-100 mb-6 font-light tracking-wide">
                  Smart AI-Powered Travel Companion
                </p>
                <div className="flex items-center justify-center space-x-8 text-indigo-200 text-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-6 w-6" />
                    <span className="font-medium">Discover</span>
                  </div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6" />
                    <span className="font-medium">Connect</span>
                  </div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Plane className="h-6 w-6" />
                    <span className="font-medium">Explore</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <Search className="h-14 w-14 mx-auto mb-6 text-indigo-200" />
                <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Search</h3>
                <p className="text-indigo-200 leading-relaxed">
                  Get instant travel insights with intelligent recommendations
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <MessageCircle className="h-14 w-14 mx-auto mb-6 text-purple-200" />
                <h3 className="text-xl font-semibold text-white mb-3">Live Local Chat</h3>
                <p className="text-indigo-200 leading-relaxed">Connect with travelers and locals in real-time</p>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <Hotel className="h-14 w-14 mx-auto mb-6 text-pink-200" />
                <h3 className="text-xl font-semibold text-white mb-3">Hotel Booking</h3>
                <p className="text-indigo-200 leading-relaxed">Find and book perfect accommodations worldwide</p>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <Star className="h-14 w-14 mx-auto mb-6 text-yellow-200" />
                <h3 className="text-xl font-semibold text-white mb-3">Travel Community</h3>
                <p className="text-indigo-200 leading-relaxed">Share experiences with fellow adventurers</p>
              </div>
            </div>

            {/* Sign In Section */}
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl max-w-lg mx-auto">
              <h3 className="text-3xl font-bold mb-4">Ready to explore?</h3>
              <p className="text-indigo-100 mb-8 text-lg leading-relaxed">
                Join thousands of travelers discovering amazing places around the world
              </p>

              <SignInButton mode="modal">
                <Button
                  className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-4 px-8 text-xl rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 mb-6"
                  size="lg"
                >
                  <Star className="mr-3 h-6 w-6" />
                  Start Your Journey
                  <span className="ml-3">→</span>
                </Button>
              </SignInButton>

              <p className="text-indigo-200 text-sm">Sign in with Google • Free forever • No credit card required</p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center space-x-12 text-indigo-200">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                <span className="font-medium">10K+ Travelers</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5" />
                <span className="font-medium">50+ Countries</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5" />
                <span className="font-medium">4.9 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
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
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                SAFAR
              </h1>
              {currentLocation && (
                <div className="hidden sm:flex items-center text-sm font-medium text-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-4 py-2 border border-indigo-200">
                  <MapPin className="h-4 w-4 mr-2 text-indigo-600" />
                  {currentLocation.city}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowCreatePost(true)}
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Post</span>
              </Button>

              {user && (
                <Avatar className="h-10 w-10 ring-4 ring-indigo-200 shadow-lg">
                  <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold">
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
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4 font-medium"
                >
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Location Bar */}
      {currentLocation && (
        <div className="sm:hidden bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-medium text-indigo-700">
              <MapPin className="h-4 w-4 mr-2" />
              {currentLocation.city}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLocationSetup(true)}
              className="text-indigo-600 text-xs font-medium hover:bg-indigo-100 rounded-full"
            >
              Change
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {[
              { id: "home", label: "Home", icon: Heart, color: "text-rose-500", bgColor: "bg-rose-50" },
              { id: "search", label: "Explore", icon: Search, color: "text-indigo-500", bgColor: "bg-indigo-50" },
              { id: "planner", label: "Trip Planner", icon: Plane, color: "text-blue-500", bgColor: "bg-blue-50" },
              { id: "chat", label: "Chat", icon: MessageCircle, color: "text-emerald-500", bgColor: "bg-emerald-50" },
              { id: "posts", label: "Posts", icon: Camera, color: "text-purple-500", bgColor: "bg-purple-50" },
              { id: "hotels", label: "Hotels", icon: Hotel, color: "text-orange-500", bgColor: "bg-orange-50" },
            ].map(({ id, label, icon: Icon, color, bgColor }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-3 py-4 px-6 border-b-3 transition-all whitespace-nowrap font-medium rounded-t-xl ${
                  activeTab === id
                    ? `border-indigo-500 ${color} ${bgColor} shadow-sm`
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pb-24">
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Welcome Hero */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Welcome back, {user?.firstName || "Traveler"}! 🌍
                </h2>
                <p className="text-indigo-100 mb-6 text-lg leading-relaxed">
                  Ready for your next adventure? Discover amazing places and connect with fellow travelers around the
                  world.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => setActiveTab("search")}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Explore Places
                  </Button>
                  <Button
                    onClick={() => setActiveTab("chat")}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Join Local Chat
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:scale-105"
                onClick={() => setActiveTab("search")}
              >
                <CardContent className="p-6 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                  <p className="font-semibold text-gray-800">Explore</p>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:scale-105"
                onClick={() => setActiveTab("chat")}
              >
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
                  <p className="font-semibold text-gray-800">Local Chat</p>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:scale-105"
                onClick={() => setActiveTab("hotels")}
              >
                <CardContent className="p-6 text-center">
                  <Hotel className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                  <p className="font-semibold text-gray-800">Hotels</p>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:scale-105"
                onClick={() => setShowCreatePost(true)}
              >
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <p className="font-semibold text-gray-800">Share</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border-0">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-red-500 mb-6 text-lg">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Reload Page
          </Button>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent mx-auto mb-8"></div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">SAFAR</h1>
          <p className="text-indigo-100 text-lg font-medium">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border-0">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-red-500 text-lg">Missing Clerk publishable key</p>
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
          colorPrimary: "#4f46e5",
          colorBackground: "#ffffff",
          colorInputBackground: "#f8fafc",
          colorInputText: "#1e293b",
        },
        elements: {
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl",
          card: "shadow-2xl border-0 rounded-2xl",
        },
      }}
    >
      <AppContent />
    </ClerkProvider>
  )
}
