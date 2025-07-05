"use client"

import { useEffect, useState } from "react"
import { ClerkProvider, useUser, SignInButton, SignOutButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { MapPin, Search, MessageCircle, Plus, Hotel, Camera, Heart, Users, Plane, Globe, Star } from "lucide-react"
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

// Simple fallback components to prevent import errors
function PlaceSearchFallback() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Search feature loading...</p>
      </CardContent>
    </Card>
  )
}

function LocationChatFallback() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Chat feature loading...</p>
      </CardContent>
    </Card>
  )
}

function UserPostsFallback() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Posts loading...</p>
      </CardContent>
    </Card>
  )
}

function HotelBookingFallback() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Hotel className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Hotels loading...</p>
      </CardContent>
    </Card>
  )
}

function AppContent() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
    name: string
    city: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState<"home" | "search" | "chat" | "posts" | "hotels">("home")
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold mb-2">🚀 SAFAR</h1>
          <p className="text-blue-100">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center">
            <div className="max-w-lg mx-auto text-center text-white">
              {/* Hero Section */}
              <div className="mb-12">
                <div className="mb-8">
                  <div className="text-8xl mb-6 animate-bounce">🚀</div>
                  <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    SAFAR
                  </h1>
                  <p className="text-2xl text-blue-100 mb-3 font-light">Smart AI-Powered Travel Companion</p>
                  <div className="flex items-center justify-center space-x-2 text-blue-200">
                    <Globe className="h-5 w-5" />
                    <span>Discover</span>
                    <span>•</span>
                    <Users className="h-5 w-5" />
                    <span>Connect</span>
                    <span>•</span>
                    <Plane className="h-5 w-5" />
                    <span>Explore</span>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Search className="h-10 w-10 mx-auto mb-3 text-blue-200" />
                  <p className="text-sm font-medium text-blue-100">AI-Powered Search</p>
                  <p className="text-xs text-blue-200 mt-1">Get instant travel insights</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <MessageCircle className="h-10 w-10 mx-auto mb-3 text-purple-200" />
                  <p className="text-sm font-medium text-blue-100">Live Local Chat</p>
                  <p className="text-xs text-blue-200 mt-1">Connect with travelers</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Hotel className="h-10 w-10 mx-auto mb-3 text-pink-200" />
                  <p className="text-sm font-medium text-blue-100">Hotel Booking</p>
                  <p className="text-xs text-blue-200 mt-1">Find perfect stays</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Star className="h-10 w-10 mx-auto mb-3 text-yellow-200" />
                  <p className="text-sm font-medium text-blue-100">Travel Community</p>
                  <p className="text-xs text-blue-200 mt-1">Share experiences</p>
                </div>
              </div>

              {/* Sign In Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-2">Ready to explore?</h3>
                <p className="text-blue-100 mb-6">Join thousands of travelers discovering amazing places</p>

                <SignInButton mode="modal">
                  <Button
                    className="w-full bg-white text-purple-600 hover:bg-blue-50 font-bold py-4 text-lg rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 mb-4"
                    size="lg"
                  >
                    <span className="mr-2">🌟</span>
                    Start Your Journey
                    <span className="ml-2">→</span>
                  </Button>
                </SignInButton>

                <p className="text-sm text-blue-200">Sign in with Google • Free forever • No credit card required</p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center justify-center space-x-6 text-blue-200">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">10K+ Travelers</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  <span className="text-sm">50+ Countries</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="text-sm">4.9 Rating</span>
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 SAFAR
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-4"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Post</span>
                </Button>

                {user && (
                  <Avatar className="h-8 w-8 ring-2 ring-blue-200">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
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
                { id: "chat", label: "Chat", icon: MessageCircle, color: "text-green-500" },
                { id: "posts", label: "Posts", icon: Camera, color: "text-purple-500" },
                { id: "hotels", label: "Hotels", icon: Hotel, color: "text-orange-500" },
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === id
                      ? `border-blue-500 ${color} bg-blue-50`
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
              <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-2xl p-6 text-white overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Welcome back, {user?.firstName || "Traveler"}! 🌍
                  </h2>
                  <p className="text-blue-100 mb-4">
                    Ready for your next adventure? Discover amazing places and connect with fellow travelers.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => setActiveTab("search")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Explore Places
                    </Button>
                    <Button
                      onClick={() => setActiveTab("chat")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
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
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("search")}
                >
                  <CardContent className="p-4 text-center">
                    <Search className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Explore</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("chat")}>
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">Local Chat</p>
                  </CardContent>
                </Card>
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("hotels")}
                >
                  <CardContent className="p-4 text-center">
                    <Hotel className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-sm font-medium">Hotels</p>
                  </CardContent>
                </Card>
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setShowCreatePost(true)}
                >
                  <CardContent className="p-4 text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm font-medium">Share</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold mb-2">🚀 SAFAR</h1>
          <p className="text-blue-100">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-red-500">Missing Clerk publishable key</p>
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
          colorPrimary: "#3b82f6",
          colorBackground: "#ffffff",
          colorInputBackground: "#f8fafc",
          colorInputText: "#1e293b",
        },
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
          card: "shadow-lg",
        },
      }}
    >
      <AppContent />
    </ClerkProvider>
  )
}
