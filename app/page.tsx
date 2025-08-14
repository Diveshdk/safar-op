"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { MapPin, Search, MessageCircle, Hotel, Plane, Users, Star, Globe, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import components with default imports
import LocationSetup from "@/components/location-setup"
import PlaceSearch from "@/components/place-search"
import LocationChat from "@/components/location-chat"
import UserPosts from "@/components/user-posts"
import CreatePost from "@/components/create-post"
import HotelBooking from "@/components/hotel-booking"
import TripPlanner from "@/components/trip-planner"

interface UserProfile {
  id: string
  name: string
  avatar: string
}

function AppContent() {
  const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth()

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
    name: string
    city: string
  } | null>(null)
  const [showLocationSetup, setShowLocationSetup] = useState(false)
  const [activeTab, setActiveTab] = useState("search")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [postRefreshTrigger, setPostRefreshTrigger] = useState(0)

  // Set up user profile after authentication
  useEffect(() => {
    if (isSignedIn && userId) {
      setUserProfile({
        id: userId,
        name: `User ${userId.slice(-4)}`, // Simple name generation
        avatar: `/placeholder.svg?height=40&width=40&text=${userId.slice(-2)}`,
      })
    }
  }, [isSignedIn, userId])

  const handleLocationSet = (location: { lat: number; lng: number; name: string; city: string }) => {
    setCurrentLocation(location)
    setShowLocationSetup(false)
  }

  const handlePostCreated = () => {
    setShowCreatePost(false)
    setPostRefreshTrigger((prev) => prev + 1)
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading SAFAR...</p>
        </div>
      </div>
    )
  }

  // Landing page for non-authenticated users
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">SAFAR</h1>
            <p className="text-xl md:text-2xl text-indigo-200 mb-8 font-light">Smart AI-Powered Travel Companion</p>
            <div className="flex items-center justify-center space-x-8 text-indigo-300">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>Discover</span>
              </div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Connect</span>
              </div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Explore</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/30 transition-colors">
                  <Search className="h-8 w-8 text-indigo-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Search</h3>
                <p className="text-indigo-200">Get instant travel insights</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                  <MessageCircle className="h-8 w-8 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Live Local Chat</h3>
                <p className="text-indigo-200">Connect with travelers</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/30 transition-colors">
                  <Hotel className="h-8 w-8 text-pink-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Hotel Booking</h3>
                <p className="text-indigo-200">Find perfect stays</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/30 transition-colors">
                  <Star className="h-8 w-8 text-yellow-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Travel Community</h3>
                <p className="text-indigo-200">Share experiences</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-16">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-2xl mx-auto">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to explore?</h2>
                <p className="text-indigo-200 mb-8 text-lg">Join thousands of travelers discovering amazing places</p>
                <div className="space-y-4">
                  <SignUpButton mode="modal">
                    <Button className="bg-white text-indigo-900 hover:bg-indigo-50 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Start Your Journey
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignUpButton>
                  <div className="flex items-center justify-center space-x-4 text-sm text-indigo-300">
                    <span>Sign in with Google</span>
                    <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                    <span>Free forever</span>
                    <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                    <span>No credit card required</span>
                  </div>
                  <div className="mt-6">
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="text-indigo-200 hover:text-white hover:bg-white/10">
                        Already have an account? Sign in
                      </Button>
                    </SignInButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-12 text-indigo-300">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 mr-1" />
                <span className="font-bold">10K+</span>
              </div>
              <span className="text-sm">Travelers</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Globe className="h-4 w-4 mr-1" />
                <span className="font-bold">50+</span>
              </div>
              <span className="text-sm">Countries</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="h-4 w-4 mr-1" />
                <span className="font-bold">4.9</span>
              </div>
              <span className="text-sm">Rating</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main authenticated app
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SAFAR
              </h1>
              {currentLocation && (
                <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <MapPin className="h-4 w-4 mr-1" />
                  {currentLocation.city}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {!currentLocation && (
                <Button
                  onClick={() => setShowLocationSetup(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Set Location
                </Button>
              )}
              {userProfile && (
                <div className="flex items-center space-x-2">
                  <img
                    src={userProfile.avatar || "/placeholder.svg"}
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{userProfile.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!currentLocation ? (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to SAFAR!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Set your location to discover local experiences, connect with travelers, and explore amazing places.
            </p>
            <Button
              onClick={() => setShowLocationSetup(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Choose Your Location
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="search" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="hotels" className="flex items-center">
                <Hotel className="h-4 w-4 mr-2" />
                Hotels
              </TabsTrigger>
              <TabsTrigger value="planner" className="flex items-center">
                <Plane className="h-4 w-4 mr-2" />
                Planner
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <PlaceSearch currentLocation={currentLocation} />
            </TabsContent>

            <TabsContent value="chat">
              <LocationChat
                currentLocation={currentLocation}
                userId={userId!}
                userName={userProfile?.name || "Anonymous"}
                userAvatar={userProfile?.avatar || "/placeholder.svg"}
              />
            </TabsContent>

            <TabsContent value="posts">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Travel Community</h2>
                  <Button
                    onClick={() => setShowCreatePost(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Share Experience
                  </Button>
                </div>
                <UserPosts currentLocation={currentLocation} userId={userId!} refreshTrigger={postRefreshTrigger} />
              </div>
            </TabsContent>

            <TabsContent value="hotels">
              <HotelBooking currentLocation={currentLocation} userId={userId!} />
            </TabsContent>

            <TabsContent value="planner">
              <TripPlanner currentLocation={currentLocation} />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Modals */}
      {showLocationSetup && (
        <LocationSetup onLocationSet={handleLocationSet} onClose={() => setShowLocationSetup(false)} />
      )}

      {showCreatePost && userProfile && (
        <CreatePost
          currentLocation={currentLocation}
          userId={userProfile.id}
          userName={userProfile.name}
          userAvatar={userProfile.avatar}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  )
}

export default function Home() {
  return <AppContent />
}
