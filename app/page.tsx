"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  MessageCircle,
  Building2,
  Star,
  MapPin,
  Users,
  Globe,
  Sparkles,
  Plane,
  Camera,
  Heart,
  Share2,
} from "lucide-react"
import LocationSetup from "@/components/location-setup"
import PlaceSearch from "@/components/place-search"
import LocationChat from "@/components/location-chat"
import UserPosts from "@/components/user-posts"
import CreatePost from "@/components/create-post"
import HotelBooking from "@/components/hotel-booking"
import TripPlanner from "@/components/trip-planner"

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">SAFAR</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6 font-light">Smart AI-Powered Travel Companion</p>
          <div className="flex items-center justify-center gap-6 text-white/80 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Discover</span>
            </div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Connect</span>
            </div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              <span>Explore</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl w-full">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Search</h3>
              <p className="text-white/80">Get instant travel insights</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Live Local Chat</h3>
              <p className="text-white/80">Connect with travelers</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Hotel Booking</h3>
              <p className="text-white/80">Find perfect stays</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Travel Community</h3>
              <p className="text-white/80">Share experiences</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to explore?</h3>
            <p className="text-white/80 mb-6">Join thousands of travelers discovering amazing places</p>

            <div className="space-y-3">
              <SignUpButton mode="modal">
                <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-semibold py-3 text-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </SignUpButton>

              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 font-medium bg-transparent"
                >
                  Already have an account? Sign In
                </Button>
              </SignInButton>
            </div>

            <p className="text-xs text-white/60 mt-4">Sign in with Google • Free forever • No credit card required</p>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-12 text-white/70 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>10K+ Travelers</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>50+ Countries</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>4.9 Rating</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const [activeTab, setActiveTab] = useState("search")
  const [userLocation, setUserLocation] = useState<{
    city: string
    country: string
    coordinates: [number, number]
  } | null>(null)

  if (!isLoaded || !userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <LandingPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SAFAR
              </h1>
              {userLocation && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {userLocation.city}, {userLocation.country}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                <AvatarFallback>
                  {user?.fullName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {user?.fullName || user?.emailAddresses[0]?.emailAddress}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!userLocation ? (
          <LocationSetup onLocationSet={setUserLocation} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-7 bg-white/80 backdrop-blur-lg">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Posts</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </TabsTrigger>
              <TabsTrigger value="hotels" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Hotels</span>
              </TabsTrigger>
              <TabsTrigger value="planner" className="flex items-center gap-2 hidden lg:flex">
                <Plane className="w-4 h-4" />
                <span className="hidden sm:inline">Planner</span>
              </TabsTrigger>
              <TabsTrigger value="share" className="flex items-center gap-2 hidden lg:flex">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <PlaceSearch userLocation={userLocation} />
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <LocationChat userLocation={userLocation} userId={userId} />
            </TabsContent>

            <TabsContent value="posts" className="space-y-6">
              <UserPosts userLocation={userLocation} userId={userId} />
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <CreatePost userLocation={userLocation} userId={userId} />
            </TabsContent>

            <TabsContent value="hotels" className="space-y-6">
              <HotelBooking userLocation={userLocation} />
            </TabsContent>

            <TabsContent value="planner" className="space-y-6">
              <TripPlanner userLocation={userLocation} userId={userId} />
            </TabsContent>

            <TabsContent value="share" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share Your Experience
                  </CardTitle>
                  <CardDescription>Tell others about your amazing travel experiences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Coming soon! Share your travel stories and inspire others.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

export default function Home() {
  return <AppContent />
}
