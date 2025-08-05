"use client"

import { useEffect, useState } from "react"
import { useUser, SignInButton, SignOutButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { MapPin, Search, MessageCircle, Plus, Hotel, Camera, Heart, Plane, Menu, X, Play, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import dynamicImport from "next/dynamic"

// Lazy load components
const LocationSetup = dynamicImport(() => import("@/components/location-setup"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location setup...</p>
        </CardContent>
      </Card>
    </div>
  ),
})

const PlaceSearch = dynamicImport(() => import("@/components/place-search"), {
  ssr: false,
  loading: () => (
    <Card className="professional-card">
      <CardContent className="p-8 text-center">
        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading search...</p>
      </CardContent>
    </Card>
  ),
})

const LocationChat = dynamicImport(() => import("@/components/location-chat"), {
  ssr: false,
  loading: () => (
    <Card className="professional-card">
      <CardContent className="p-8 text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading chat...</p>
      </CardContent>
    </Card>
  ),
})

const UserPosts = dynamicImport(() => import("@/components/user-posts"), {
  ssr: false,
  loading: () => (
    <Card className="professional-card">
      <CardContent className="p-8 text-center">
        <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading posts...</p>
      </CardContent>
    </Card>
  ),
})

const HotelBooking = dynamicImport(() => import("@/components/hotel-booking"), {
  ssr: false,
  loading: () => (
    <Card className="professional-card">
      <CardContent className="p-8 text-center">
        <Hotel className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading hotels...</p>
      </CardContent>
    </Card>
  ),
})

const CreatePost = dynamicImport(() => import("@/components/create-post"), {
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

const TripPlanner = dynamicImport(() => import("@/components/trip-planner"), {
  ssr: false,
  loading: () => (
    <Card className="professional-card">
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (user && !currentLocation) {
      setTimeout(() => {
        setShowLocationSetup(true)
      }, 500)
    }
  }, [user, currentLocation])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto mb-6"></div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">SAFAR</h1>
          <p className="text-gray-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SignedOut>
        {/* Professional Landing Page */}
        <div className="min-h-screen">
          {/* Navigation */}
          <nav className="glass-nav fixed top-0 w-full z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">SAFAR</span>
                  <span className="text-xs text-gray-500 hidden sm:block">TRAVEL SIMPLIFIED</span>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                  <a href="#how-it-works" className="text-gray-600 hover:text-gray-800 font-medium">
                    HOW IT WORKS
                  </a>
                  <a href="#activities" className="text-gray-600 hover:text-gray-800 font-medium">
                    START PLANNING
                  </a>
                  <a href="#blog" className="text-gray-600 hover:text-gray-800 font-medium">
                    BLOG
                  </a>
                  <a href="#reviews" className="text-gray-600 hover:text-gray-800 font-medium">
                    REVIEWS
                  </a>
                  <a href="#contact" className="text-gray-600 hover:text-gray-800 font-medium">
                    CONTACT
                  </a>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="border-gray-300 bg-transparent">
                      LOGIN
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button className="cyan-button">SIGNUP</Button>
                  </SignInButton>
                </div>

                <div className="md:hidden">
                  <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white border-t">
                <div className="px-4 py-4 space-y-4">
                  <a href="#how-it-works" className="block text-gray-600 hover:text-gray-800 font-medium">
                    HOW IT WORKS
                  </a>
                  <a href="#activities" className="block text-gray-600 hover:text-gray-800 font-medium">
                    START PLANNING
                  </a>
                  <a href="#blog" className="block text-gray-600 hover:text-gray-800 font-medium">
                    BLOG
                  </a>
                  <a href="#reviews" className="block text-gray-600 hover:text-gray-800 font-medium">
                    REVIEWS
                  </a>
                  <a href="#contact" className="block text-gray-600 hover:text-gray-800 font-medium">
                    CONTACT
                  </a>
                  <div className="flex space-x-2 pt-4 border-t">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        LOGIN
                      </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <Button className="cyan-button flex-1">SIGNUP</Button>
                    </SignInButton>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Hero Section */}
          <section className="hero-section min-h-screen flex items-center justify-center relative">
            <div className="text-center text-white max-w-4xl mx-auto px-4 z-10">
              <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-wide">FIND THE PERFECT PLACE TO GO</h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto font-light">
                Receive personalized recommendations for activities, hotels, and more
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative bg-white rounded-lg shadow-lg">
                  <div className="flex items-center p-2">
                    <div className="flex items-center px-4 py-3 flex-1">
                      <Search className="h-5 w-5 text-gray-400 mr-3" />
                      <Input
                        placeholder="What would you like to do?"
                        className="border-0 text-gray-800 text-lg focus:ring-0 bg-transparent"
                      />
                    </div>
                    <SignInButton mode="modal">
                      <Button className="cyan-button m-1">START PLANNING</Button>
                    </SignInButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Play Button */}
            <div className="absolute bottom-8 right-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Play className="h-6 w-6 text-white ml-1" />
              </div>
            </div>
          </section>

          {/* Navigation Icons */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center space-x-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="h-8 w-8 text-cyan-500" />
                  </div>
                  <p className="text-gray-600 font-medium tracking-wider">FLIGHTS</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Hotel className="h-8 w-8 text-cyan-500" />
                  </div>
                  <p className="text-gray-600 font-medium tracking-wider">MORE</p>
                </div>
                <SignInButton mode="modal">
                  <Button className="cyan-button">LET'S PLAN YOUR TRIP</Button>
                </SignInButton>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="section-subtitle">3 STEPS TO THE PERFECT TRIP</p>
                <h2 className="section-title">
                  FIND TRAVEL PERFECTION, WITH THE
                  <br />
                  WISDOM OF EXPERTS
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Naturally head of the class when it comes to luxury travel planning, because we do more homework than
                  anyone else, with a few little sweeteners thrown in! Travel to the four corners of the world, without
                  going around in circles.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 mb-16">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-8 relative">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center">
                      <Search className="h-16 w-16 text-cyan-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Tell us what you want to do</h3>
                  <p className="text-gray-600">Fill out a 2-minute questionnaire about how you like to travel</p>
                </div>

                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-8 relative">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Heart className="h-16 w-16 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Travel Preference & Dates</h3>
                  <p className="text-gray-600">It all happens online. We recommend everything to your vision</p>
                </div>

                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-8 relative">
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <Plane className="h-16 w-16 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">We'll give you tailored recommendations</h3>
                  <p className="text-gray-600">Once you're happy with your final plan, We handle everything for you</p>
                </div>
              </div>

              <div className="text-center">
                <SignInButton mode="modal">
                  <Button className="cyan-button text-lg px-8 py-4">LET'S PLAN YOUR TRIP</Button>
                </SignInButton>
              </div>
            </div>
          </section>

          {/* Activities Section */}
          <section id="activities" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="section-subtitle">TRIP INSPIRATION</p>
                <h2 className="section-title">
                  FIND THE PERFECT PLACE TO GO ACTIVITIES,
                  <br />
                  HOTELS, AND MORE
                </h2>
              </div>

              {/* Activity Categories */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {["ALL", "ADVENTURE", "HIGH ADRENALINE", "WATER SPORTS", "HISTORY & CULTURE", "OTHER ACTIVITIES"].map(
                  (category) => (
                    <Button
                      key={category}
                      variant={category === "ALL" ? "default" : "outline"}
                      className={category === "ALL" ? "cyan-button" : "border-cyan-200 text-cyan-600 hover:bg-cyan-50"}
                    >
                      {category}
                    </Button>
                  ),
                )}
              </div>

              {/* Activity Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  className="activity-card"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
                  }}
                >
                  <div className="activity-card-content">
                    <div>
                      <span className="bg-cyan-500 text-white px-3 py-1 rounded text-sm font-medium">HIKING</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">An Ultimate Luxury Ireland Journey</h3>
                    </div>
                  </div>
                </div>

                <div
                  className="activity-card"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
                  }}
                >
                  <div className="activity-card-content">
                    <div>
                      <span className="bg-cyan-500 text-white px-3 py-1 rounded text-sm font-medium">
                        ANIMAL WATCHING
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">A studding off beaten Safari path to China</h3>
                    </div>
                  </div>
                </div>

                <div
                  className="activity-card"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
                  }}
                >
                  <div className="activity-card-content">
                    <div>
                      <span className="bg-cyan-500 text-white px-3 py-1 rounded text-sm font-medium">SURFING</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Journeying Through Nelson Mandela's Roots</h3>
                    </div>
                  </div>
                </div>

                <div
                  className="activity-card"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
                  }}
                >
                  <div className="activity-card-content">
                    <div>
                      <span className="bg-cyan-500 text-white px-3 py-1 rounded text-sm font-medium">CYCLING</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">The Ultimate Croatian Epicurean Journey</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Community Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="section-subtitle text-left">SUPERIOR NETWORKING FOR TRAVEL PLANNING</p>
                  <h2 className="text-4xl font-light text-gray-800 mb-6 text-left">
                    EASILY COORDINATE AND PLAN
                    <br />
                    WITH FRIENDS AND FAMILY
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    You're the type of person who wants to take amazing, unique vacations – the kind where luxury meets
                    authentic, and each experience is curated specifically for you. We value the user journey and
                    experience above all else and are differentiated by serving their needs first – we want to make
                    their hectic and stressful lives easier by enabling them to focus on enjoying their vacation and
                    ensuring they get the most.
                  </p>
                  <SignInButton mode="modal">
                    <Button className="cyan-button text-lg px-8 py-4">GET STARTED</Button>
                  </SignInButton>
                </div>

                <div className="travel-network">
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">A</span>
                      </div>
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">B</span>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">C</span>
                      </div>
                      <div className="w-18 h-18 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">D</span>
                      </div>
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Compass className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-18 h-18 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">E</span>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">F</span>
                      </div>
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">G</span>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">H</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Section */}
          <section id="blog" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="section-subtitle">OUR LATEST BLOG POSTS</p>
                <h2 className="section-title">FROM THE RESOURCE CENTER</h2>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Featured Article */}
                <div className="lg:col-span-2">
                  <div className="professional-card overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Best Activities in Bali"
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <span className="bg-cyan-500 text-white px-3 py-1 rounded text-sm font-medium">POPULAR</span>
                      <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
                        The Best of Best Activities to Do While you are in Bali
                      </h3>
                      <p className="text-gray-600 text-sm">ALL THINGS EUROPE, ALL THINGS ITALY</p>
                    </div>
                  </div>
                </div>

                {/* Side Articles */}
                <div className="space-y-6">
                  <div className="professional-card overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Rafting"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Rafting through Raft Badger and Soap Creek rapids of Grand Canyon
                      </h4>
                    </div>
                  </div>

                  <div className="professional-card overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Sailing"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Sailing Cruises Attractions And Landmarks Guide
                      </h4>
                    </div>
                  </div>

                  <div className="professional-card overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Gorilla tracking"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Going on a gorilla tracking tour in Uganda, Rwanda, and learning
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="footer-illustration py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-light text-gray-800 mb-4">THE VALUE FOR EXPERIENCE</h2>
              <p className="text-lg text-gray-600 mb-8">Relax... You're with us! We make it simple.</p>
              <SignInButton mode="modal">
                <Button className="cyan-button text-lg px-8 py-4">START PLANNING</Button>
              </SignInButton>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer-section py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold mb-4 text-white">GET IN TOUCH</h3>
                  <div className="space-y-2 text-gray-300">
                    <p className="font-semibold">Address</p>
                    <p>SAFAR</p>
                    <p>Travel Simplified</p>
                    <p>Mumbai, India</p>
                    <p className="font-semibold mt-4">Support Phone</p>
                    <p>+91-XXX-XXX-XXXX</p>
                    <p className="font-semibold mt-4">Email: info@safar.com</p>
                    <p>Response time usually 4 hours</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-4 text-white">ABOUT US</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>
                      <a href="#" className="hover:text-white">
                        How it Works
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Start Planning
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Reviews
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Trip Inspiration
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold mb-4 text-white">FROM THE BLOG</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>
                      <a href="#" className="hover:text-white">
                        Travelling Guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Planning Your Trip
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Product Guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Guest Posts
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Destinations
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Tours
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Webinars
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold mb-4 text-white">GET SOCIAL</h3>
                  <p className="text-gray-300 mb-4">
                    Keep up-to-date with all the latest and breaking social media news. There are a lot of exciting
                    things happening this year.
                  </p>
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 cursor-pointer">
                      <span className="text-white text-sm">f</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 cursor-pointer">
                      <span className="text-white text-sm">G+</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 cursor-pointer">
                      <span className="text-white text-sm">t</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 cursor-pointer">
                      <span className="text-white text-sm">in</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 cursor-pointer">
                      <span className="text-white text-sm">in</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-600 mt-12 pt-8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-white text-xl font-bold">SAFAR</span>
                    <p className="text-gray-400 text-sm">TRAVEL SIMPLIFIED</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Copyright © 2024 SAFAR and other trademarks, service marks, and designs are the registered or
                  unregistered trademarks of SAFAR Inc in India and other countries.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Professional Dashboard */}
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
        <header className="glass-nav border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">SAFAR</span>
                </div>

                {currentLocation && (
                  <div className="hidden sm:flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                    <MapPin className="h-4 w-4 mr-1 text-cyan-500" />
                    {currentLocation.city}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button onClick={() => setShowCreatePost(true)} size="sm" className="cyan-button rounded-full px-4">
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Share</span>
                </Button>

                {user && (
                  <Avatar className="h-8 w-8 ring-2 ring-cyan-200">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-cyan-500 text-white">
                      {user.firstName?.charAt(0) ||
                        user.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <SignOutButton>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Location Bar */}
        {currentLocation && (
          <div className="sm:hidden bg-cyan-50 border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-cyan-700">
                <MapPin className="h-4 w-4 mr-1" />
                {currentLocation.city}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSetup(true)}
                className="text-cyan-600 text-xs"
              >
                Change
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "home", label: "Dashboard", icon: Heart, color: "text-red-500" },
                { id: "search", label: "Explore", icon: Search, color: "text-cyan-500" },
                { id: "planner", label: "Trip Planner", icon: Plane, color: "text-indigo-500" },
                { id: "chat", label: "AI Assistant", icon: MessageCircle, color: "text-green-500" },
                { id: "posts", label: "Community", icon: Camera, color: "text-purple-500" },
                { id: "hotels", label: "Hotels", icon: Hotel, color: "text-orange-500" },
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-4 px-6 border-b-2 transition-all whitespace-nowrap font-medium ${
                    activeTab === id
                      ? `border-cyan-500 ${color} bg-cyan-50`
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "home" && (
            <div className="space-y-8">
              {/* Welcome Hero */}
              <div className="professional-card overflow-hidden">
                <div
                  className="h-64 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(6, 182, 212, 0.8), rgba(8, 145, 178, 0.8)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
                  }}
                >
                  <div className="absolute inset-0 p-8 text-white flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-light mb-4">
                      Welcome back, {user?.firstName || "Traveler"}! 🌍
                    </h1>
                    <p className="text-xl text-white/90 mb-6 max-w-2xl">
                      Ready for your next adventure? Discover amazing places and connect with fellow travelers using our
                      AI-powered platform.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={() => setActiveTab("search")}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Explore Destinations
                      </Button>
                      <Button
                        onClick={() => setActiveTab("planner")}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                      >
                        <Plane className="h-4 w-4 mr-2" />
                        Plan a Trip
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="professional-card cursor-pointer" onClick={() => setActiveTab("search")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 text-cyan-500" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Explore</h3>
                    <p className="text-sm text-gray-600">Discover amazing destinations</p>
                  </CardContent>
                </Card>

                <Card className="professional-card cursor-pointer" onClick={() => setActiveTab("chat")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">AI Assistant</h3>
                    <p className="text-sm text-gray-600">Get travel recommendations</p>
                  </CardContent>
                </Card>

                <Card className="professional-card cursor-pointer" onClick={() => setActiveTab("hotels")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Hotel className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Hotels</h3>
                    <p className="text-sm text-gray-600">Find perfect accommodations</p>
                  </CardContent>
                </Card>

                <Card className="professional-card cursor-pointer" onClick={() => setShowCreatePost(true)}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Share</h3>
                    <p className="text-sm text-gray-600">Share your experiences</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto mb-6"></div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">SAFAR</h1>
          <p className="text-gray-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return <AppContent />
}
