"use client"

import { useAuth } from "@clerk/nextjs"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Building2, Star, MapPin, Users, Globe, Sparkles, ArrowRight } from "lucide-react"
import LocationSetup from "@/components/location-setup"
import PlaceSearch from "@/components/place-search"
import LocationChat from "@/components/location-chat"
import UserPosts from "@/components/user-posts"
import CreatePost from "@/components/create-post"
import HotelBooking from "@/components/hotel-booking"
import TripPlanner from "@/components/trip-planner"

function AppContent() {
  const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth()
  const [activeTab, setActiveTab] = useState("home")
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
    address: string
  } | null>(null)

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">SAFAR</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">Smart AI-Powered Travel Companion</p>
            <div className="flex items-center justify-center space-x-6 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Discover</span>
              </div>
              <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Connect</span>
              </div>
              <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Explore</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl w-full">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-white mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Search</h3>
                <p className="text-white/80 text-sm">Get instant travel insights</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-white mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">Live Local Chat</h3>
                <p className="text-white/80 text-sm">Connect with travelers</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-white mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">Hotel Booking</h3>
                <p className="text-white/80 text-sm">Find perfect stays</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <Star className="w-12 h-12 text-white mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">Travel Community</h3>
                <p className="text-white/80 text-sm">Share experiences</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to explore?</h3>
              <p className="text-white/80 mb-6">Join thousands of travelers discovering amazing places</p>

              <div className="space-y-3">
                <SignUpButton mode="modal">
                  <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10 border border-white/30">
                    Already have an account? Sign in
                  </Button>
                </SignInButton>
              </div>

              <p className="text-white/60 text-xs mt-4">Sign in with Google • Free forever • No credit card required</p>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 mt-12 text-white/70 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>10K+ Travelers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>50+ Countries</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>4.9 Rating</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SAFAR</h1>
              <p className="text-gray-600">Your AI-powered travel companion</p>
            </div>

            {!userLocation && (
              <Card>
                <CardContent className="p-6">
                  <LocationSetup onLocationSet={setUserLocation} />
                </CardContent>
              </Card>
            )}

            {userLocation && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("search")}
                >
                  <CardContent className="p-6 text-center">
                    <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Search Places</h3>
                    <p className="text-gray-600 text-sm">Find amazing destinations</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("chat")}>
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Local Chat</h3>
                    <p className="text-gray-600 text-sm">Connect with travelers</p>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("hotels")}
                >
                  <CardContent className="p-6 text-center">
                    <Building2 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Book Hotels</h3>
                    <p className="text-gray-600 text-sm">Find perfect stays</p>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("posts")}
                >
                  <CardContent className="p-6 text-center">
                    <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Community</h3>
                    <p className="text-gray-600 text-sm">Share experiences</p>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("create")}
                >
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Create Post</h3>
                    <p className="text-gray-600 text-sm">Share your journey</p>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("planner")}
                >
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Trip Planner</h3>
                    <p className="text-gray-600 text-sm">Plan your adventure</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )
      case "search":
        return <PlaceSearch />
      case "chat":
        return userLocation ? <LocationChat userLocation={userLocation} /> : <div>Please set your location first</div>
      case "posts":
        return <UserPosts />
      case "create":
        return userLocation ? <CreatePost userLocation={userLocation} /> : <div>Please set your location first</div>
      case "hotels":
        return <HotelBooking />
      case "planner":
        return <TripPlanner />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => setActiveTab("home")}>
                SAFAR
              </h1>
              {userLocation && (
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {userLocation.address}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hello, {userId}</span>
              <Button variant="outline" size="sm" onClick={() => (window.location.href = "/api/auth/signout")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>
    </div>
  )
}

export default function Home() {
  return <AppContent />
}
