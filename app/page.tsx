"use client"

import { useEffect, useState } from "react"
import { useUser, SignInButton, SignOutButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { MapPin, Search, MessageCircle, Plus, Hotel, Camera, Heart, Users, Plane, Globe, Star, Building2, Briefcase } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from "next/dynamic"

// Lazy load components
const LocationSetup = dynamic(() => import("@/components/location-setup"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading location setup...</p>
        </CardContent>
      </Card>
    </div>
  ),
})

const PlaceSearch = dynamic(() => import("@/components/place-search"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <Search className="h-12 w-12 mx-auto mb-4 text-slate-400" />
        <p className="text-slate-600">Loading search...</p>
      </CardContent>
    </Card>
  ),
})

const LocationChat = dynamic(() => import("@/components/location-chat"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
        <p className="text-slate-600">Loading chat...</p>
      </CardContent>
    </Card>
  ),
})

const UserPosts = dynamic(() => import("@/components/user-posts"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <Camera className="h-12 w-12 mx-auto mb-4 text-slate-400" />
        <p className="text-slate-600">Loading posts...</p>
      </CardContent>
    </Card>
  ),
})

const HotelBooking = dynamic(() => import("@/components/hotel-booking"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-8 text-center">
        <Hotel className="h-12 w-12 mx-auto mb-4 text-slate-400" />
        <p className="text-slate-600">Loading hotels...</p>
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
          <Plus className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Loading create post...</p>
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
        <Plane className="h-12 w-12 mx-auto mb-4 text-slate-400" />
        <p className="text-slate-600">Loading trip planner...</p>
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
      setTimeout(() => {
        setShowLocationSetup(true)
      }, 500)
    }
  }, [user, currentLocation])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-slate-600 mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold mb-2 text-slate-800">SAFAR</h1>
          <p className="text-slate-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SignedOut>
        <div className="min-h-screen bg-white relative overflow-hidden">
          {/* Professional Header */}
          <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-slate-700" />
                  <h1 className="text-2xl font-bold text-slate-800">SAFAR</h1>
                  <span className="text-sm text-slate-500 font-medium">Professional Travel Platform</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                    Features
                  </Button>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                    About
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="relative pt-16 pb-20 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight mb-6">
                    Professional Travel<br />
                    <span className="text-slate-600">Management Platform</span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                    Streamline your travel planning with AI-powered insights, real-time collaboration, 
                    and comprehensive destination intelligence.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <Card className="border-slate-200 hover-lift">
                    <CardContent className="p-6 text-center">
                      <Search className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">AI-Powered Research</h3>
                      <p className="text-slate-600 text-sm">Get comprehensive destination insights and recommendations</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 hover-lift">
                    <CardContent className="p-6 text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Team Collaboration</h3>
                      <p className="text-slate-600 text-sm">Connect with local experts and fellow travelers</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 hover-lift">
                    <CardContent className="p-6 text-center">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Business Tools</h3>
                      <p className="text-slate-600 text-sm">Professional trip planning and expense management</p>
                    </CardContent>
                  </Card>
                </div>

                {/* CTA Section */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Get Started Today</h3>
                  <p className="text-slate-600 mb-6">Join thousands of professionals using SAFAR for their travel needs</p>

                  <SignInButton mode="modal">
                    <Button className="w-full btn-primary mb-4">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Access Platform
                    </Button>
                  </SignInButton>

                  <p className="text-sm text-slate-500">Secure authentication • Enterprise ready • GDPR compliant</p>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex items-center justify-center space-x-8 text-slate-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">10,000+ Users</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">50+ Countries</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">4.9/5 Rating</span>
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

        {/* Professional Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-7 w-7 text-slate-700" />
                  <h1 className="text-xl font-bold text-slate-800">SAFAR</h1>
                </div>
                {currentLocation && (
                  <div className="hidden sm:flex items-center text-sm text-slate-600 bg-slate-100 rounded-lg px-3 py-1.5">
                    <MapPin className="h-4 w-4 mr-1 text-slate-500" />
                    {currentLocation.city}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowCreatePost(true)}
                  size="sm"
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">New Post</span>
                </Button>

                {user && (
                  <Avatar className="h-8 w-8 ring-2 ring-slate-200">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-slate-600 text-white">
                      {user.firstName?.charAt(0) ||
                        user.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <SignOutButton>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Location Bar */}
        {currentLocation && (
          <div className="sm:hidden bg-slate-50 border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-slate-700">
                <MapPin className="h-4 w-4 mr-1" />
                {currentLocation.city}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSetup(true)}
                className="text-slate-600 text-xs"
              >
                Change
              </Button>
            </div>
          </div>
        )}

        {/* Professional Navigation */}
        <nav className="bg-white border-b border-slate-200 sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "home", label: "Dashboard", icon: Heart, color: "text-slate-600" },
                { id: "search", label: "Research", icon: Search, color: "text-slate-600" },
                { id: "planner", label: "Planner", icon: Plane, color: "text-slate-600" },
                { id: "chat", label: "Collaborate", icon: MessageCircle, color: "text-slate-600" },
                { id: "posts", label: "Community", icon: Camera, color: "text-slate-600" },
                { id: "hotels", label: "Accommodation", icon: Hotel, color: "text-slate-600" },
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap font-medium ${
                    activeTab === id
                      ? `border-slate-800 text-slate-800 bg-slate-50`
                      : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 pb-20">
          {activeTab === "home" && (
            <div className="space-y-6">
              {/* Professional Welcome */}
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        Welcome back, {user?.firstName || "Professional"}
                      </h2>
                      <p className="text-slate-600 mt-1">
                        Manage your travel projects and collaborate with your network
                      </p>
                    </div>
                    <Building2 className="h-12 w-12 text-slate-400" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => setActiveTab("search")}
                      className="btn-primary"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Start Research
                    </Button>
                    <Button
                      onClick={() => setActiveTab("chat")}
                      className="btn-secondary"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card
                  className="border-slate-200 hover-lift cursor-pointer"
                  onClick={() => setActiveTab("search")}
                >
                  <CardContent className="p-4 text-center">
                    <Search className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-slate-700">Research</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 hover-lift cursor-pointer" onClick={() => setActiveTab("chat")}>
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-slate-700">Collaborate</p>
                  </CardContent>
                </Card>
                <Card
                  className="border-slate-200 hover-lift cursor-pointer"
                  onClick={() => setActiveTab("hotels")}
                >
                  <CardContent className="p-4 text-center">
                    <Hotel className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-slate-700">Book Stay</p>
                  </CardContent>
                </Card>
                <Card
                  className="border-slate-200 hover-lift cursor-pointer"
                  onClick={() => setShowCreatePost(true)}
                >
                  <CardContent className="p-4 text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-slate-700">Share</p>
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-slate-600 mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold mb-2 text-slate-800">SAFAR</h1>
          <p className="text-slate-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return <AppContent />
}
