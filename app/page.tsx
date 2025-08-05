"use client"

import { useEffect, useState } from "react"
import { useUser, SignInButton, SignOutButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import {
  MapPin,
  Search,
  MessageCircle,
  Plus,
  Hotel,
  Camera,
  Heart,
  Users,
  Plane,
  Globe,
  Star,
  Menu,
  X,
  Play,
  Compass,
  Calendar,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"

// Lazy load the components
const LocationSetup = dynamic(() => import("@/components/location-setup"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location setup...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">SAFAR</h1>
          <p className="text-slate-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SignedOut>
        {/* Professional Landing Page */}
        <div className="relative">
          {/* Navigation */}
          <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    SAFAR
                  </span>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                  <a href="#features" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                    Features
                  </a>
                  <a href="#destinations" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                    Destinations
                  </a>
                  <a href="#community" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                    Community
                  </a>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-slate-600 hover:text-sky-600">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6">
                      Get Started
                    </Button>
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
                  <a href="#features" className="block text-slate-600 hover:text-sky-600 font-medium">
                    Features
                  </a>
                  <a href="#destinations" className="block text-slate-600 hover:text-sky-600 font-medium">
                    Destinations
                  </a>
                  <a href="#community" className="block text-slate-600 hover:text-sky-600 font-medium">
                    Community
                  </a>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-sky-600">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                      Get Started
                    </Button>
                  </SignInButton>
                </div>
              </div>
            )}
          </nav>

          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
              }}
            />

            {/* Content */}
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">FIND THE PERFECT PLACE TO GO</h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
                Receive personalized recommendations for activities, hotels, and more with AI-powered travel planning
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="What would you like to do?"
                    className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-lg text-slate-800"
                  />
                  <SignInButton mode="modal">
                    <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8">
                      START PLANNING
                    </Button>
                  </SignInButton>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-8 text-white/80">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>50K+ Travelers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>150+ Countries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>4.9 Rating</span>
                </div>
              </div>
            </div>

            {/* Video Play Button */}
            <div className="absolute bottom-8 right-8">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30"
              >
                <Play className="h-6 w-6 text-white ml-1" />
              </Button>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="features" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-sky-500 font-semibold mb-4 tracking-wide uppercase">3 STEPS TO THE PERFECT TRIP</p>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                  FIND TRAVEL PERFECTION, WITH THE
                  <br />
                  WISDOM OF EXPERTS
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Naturally head of the class when it comes to luxury travel planning, because we do more homework than
                  anyone else, with a few little sweeteners thrown in! Travel to the four corners of the world, without
                  going around in circles.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="h-12 w-12 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Tell us what you want to do</h3>
                  <p className="text-slate-600">Fill out a 2-minute questionnaire about how you like to travel</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-12 w-12 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Share Your Travel Preference & Dates</h3>
                  <p className="text-slate-600">It all happens online. We recommend everything to your vision</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="h-12 w-12 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">We'll give you tailored recommendations</h3>
                  <p className="text-slate-600">Once you're happy with your final plan, We handle everything for you</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 text-lg">
                    LET'S PLAN YOUR TRIP
                  </Button>
                </SignInButton>
              </div>
            </div>
          </section>

          {/* Destinations Section */}
          <section id="destinations" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-sky-500 font-semibold mb-4 tracking-wide uppercase">TRIP INSPIRATION</p>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
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
                      className={
                        category === "ALL"
                          ? "bg-sky-500 hover:bg-sky-600 text-white"
                          : "border-sky-200 text-sky-600 hover:bg-sky-50"
                      }
                    >
                      {category}
                    </Button>
                  ),
                )}
              </div>

              {/* Activity Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`,
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        HIKING
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold mb-1">An Ultimate Luxury Ireland Journey</h3>
                    </div>
                  </div>
                </Card>

                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`,
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        ANIMAL WATCHING
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold mb-1">A studding off beaten Safari path to China</h3>
                    </div>
                  </div>
                </Card>

                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`,
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        SURFING
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold mb-1">Journeying Through Nelson Mandela's Roots</h3>
                    </div>
                  </div>
                </Card>

                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`,
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        CYCLING
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold mb-1">The Ultimate Croatian Epicurean Journey</h3>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Community Section */}
          <section id="community" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-sky-500 font-semibold mb-4 tracking-wide uppercase">
                    SUPERIOR NETWORKING FOR TRAVEL PLANNING
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                    EASILY COORDINATE AND PLAN
                    <br />
                    WITH FRIENDS AND FAMILY
                  </h2>
                  <p className="text-xl text-slate-600 mb-8">
                    You're the type of person who wants to take amazing, unique vacations – the kind where luxury meets
                    authentic, and each experience is curated specifically for you. We value the user journey and
                    experience above all else and are differentiated by serving their needs first – we want to make
                    their hectic and stressful lives easier by enabling them to focus on enjoying their vacation and
                    ensuring they get the most.
                  </p>
                  <SignInButton mode="modal">
                    <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 text-lg">
                      GET STARTED
                    </Button>
                  </SignInButton>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                      <div
                        key={i}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">THE VALUE FOR EXPERIENCE</h2>
              <p className="text-xl text-slate-300 mb-8">Relax... You're with us! We make it simple.</p>
              <SignInButton mode="modal">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 text-lg">
                  START PLANNING
                </Button>
              </SignInButton>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Compass className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold">SAFAR</span>
                  </div>
                  <p className="text-slate-400 mb-4">TRAVEL SIMPLIFIED</p>
                  <p className="text-slate-400 text-sm">
                    Your AI-powered travel companion for discovering amazing places and creating unforgettable
                    experiences.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-4">ABOUT US</h3>
                  <ul className="space-y-2 text-slate-400">
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
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold mb-4">FROM THE BLOG</h3>
                  <ul className="space-y-2 text-slate-400">
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
                        Destinations
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Guest Posts
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold mb-4">GET SOCIAL</h3>
                  <p className="text-slate-400 mb-4">
                    Keep up-to-date with all the latest and breaking social media news.
                  </p>
                  <div className="flex space-x-4">
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-2">
                      <Globe className="h-5 w-5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-2">
                      <Users className="h-5 w-5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-2">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
                <p>&copy; 2024 SAFAR. All rights reserved. Travel simplified with AI.</p>
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
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-slate-800">SAFAR</span>
                </div>

                {currentLocation && (
                  <div className="hidden sm:flex items-center text-sm text-slate-600 bg-slate-100 rounded-full px-3 py-1">
                    <MapPin className="h-4 w-4 mr-1 text-sky-500" />
                    {currentLocation.city}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowCreatePost(true)}
                  size="sm"
                  className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-4"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Share</span>
                </Button>

                {user && (
                  <Avatar className="h-8 w-8 ring-2 ring-sky-200">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
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
          <div className="sm:hidden bg-sky-50 border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-sky-700">
                <MapPin className="h-4 w-4 mr-1" />
                {currentLocation.city}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSetup(true)}
                className="text-sky-600 text-xs"
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
                { id: "search", label: "Explore", icon: Search, color: "text-sky-500" },
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
                      ? `border-sky-500 ${color} bg-sky-50`
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "home" && (
            <div className="space-y-8">
              {/* Welcome Hero */}
              <div className="relative overflow-hidden rounded-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(14, 165, 233, 0.8), rgba(59, 130, 246, 0.8)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
                  }}
                />
                <div className="relative z-10 p-8 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
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
                      <Calendar className="h-4 w-4 mr-2" />
                      Plan a Trip
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                  onClick={() => setActiveTab("search")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-200 transition-colors">
                      <Search className="h-6 w-6 text-sky-500" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Explore</h3>
                    <p className="text-sm text-slate-600">Discover amazing destinations</p>
                  </CardContent>
                </Card>

                <Card
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                  onClick={() => setActiveTab("chat")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <MessageCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">AI Assistant</h3>
                    <p className="text-sm text-slate-600">Get travel recommendations</p>
                  </CardContent>
                </Card>

                <Card
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                  onClick={() => setActiveTab("hotels")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                      <Hotel className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Hotels</h3>
                    <p className="text-sm text-slate-600">Find perfect accommodations</p>
                  </CardContent>
                </Card>

                <Card
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                  onClick={() => setShowCreatePost(true)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                      <Plus className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Share</h3>
                    <p className="text-sm text-slate-600">Share your experiences</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent mx-auto mb-6"></div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">SAFAR</h1>
          <p className="text-slate-600">Loading your travel companion...</p>
        </div>
      </div>
    )
  }

  return <AppContent />
}
