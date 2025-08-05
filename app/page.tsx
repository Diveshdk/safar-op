"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Hotel, MessageCircle, Users, Star, Calendar, Menu, X, Globe, Compass } from "lucide-react"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import dynamic from "next/dynamic" // Use 'dynamic' for lazy loading

// Correct dynamic imports for default exports
const CreatePost = dynamic(() => import("@/components/create-post"), { ssr: false })
const UserPosts = dynamic(() => import("@/components/user-posts"), { ssr: false })
const LocationSetup = dynamic(() => import("@/components/location-setup"), { ssr: false })
const LocationChat = dynamic(() => import("@/components/location-chat"), { ssr: false })
const TripPlanner = dynamic(() => import("@/components/trip-planner"), { ssr: false })
const HotelBooking = dynamic(() => import("@/components/hotel-booking"), { ssr: false })
const PlaceSearch = dynamic(() => import("@/components/place-search"), { ssr: false })

interface Activity {
  id: string
  title: string
  category: string
  image: string
  description: string
  location: string
  rating: number
  price: string
}

const activities: Activity[] = [
  {
    id: "1",
    title: "Mountain Hiking Adventure",
    category: "ADVENTURE",
    image: "/placeholder.svg?height=300&width=400&text=Mountain+Hiking",
    description: "Experience breathtaking mountain trails",
    location: "Swiss Alps",
    rating: 4.8,
    price: "$120",
  },
  {
    id: "2",
    title: "Safari Wildlife Tour",
    category: "ADVENTURE",
    image: "/placeholder.svg?height=300&width=400&text=Safari+Tour",
    description: "Witness amazing wildlife in their natural habitat",
    location: "Kenya",
    rating: 4.9,
    price: "$350",
  },
  {
    id: "3",
    title: "Surfing Lessons",
    category: "WATER SPORTS",
    image: "/placeholder.svg?height=300&width=400&text=Surfing",
    description: "Learn to surf with professional instructors",
    location: "Bali, Indonesia",
    rating: 4.7,
    price: "$80",
  },
  {
    id: "4",
    title: "Cultural Heritage Walk",
    category: "HISTORY & CULTURE",
    image: "/placeholder.svg?height=300&width=400&text=Heritage+Walk",
    description: "Explore ancient temples and cultural sites",
    location: "Kyoto, Japan",
    rating: 4.6,
    price: "$45",
  },
  {
    id: "5",
    title: "Scuba Diving Experience",
    category: "WATER SPORTS",
    image: "/placeholder.svg?height=300&width=400&text=Scuba+Diving",
    description: "Discover underwater marine life",
    location: "Great Barrier Reef",
    rating: 4.9,
    price: "$200",
  },
  {
    id: "6",
    title: "City Food Tour",
    category: "OTHER ACTIVITIES",
    image: "/placeholder.svg?height=300&width=400&text=Food+Tour",
    description: "Taste authentic local cuisine",
    location: "Bangkok, Thailand",
    rating: 4.8,
    price: "$60",
  },
]

const categories = ["ALL", "ADVENTURE", "HIGH ADRENALINE", "WATER SPORTS", "HISTORY & CULTURE", "OTHER ACTIVITIES"]

const blogPosts = [
  {
    id: "1",
    title: "The Best Activities to Do While in Bali",
    category: "POPULAR",
    image: "/placeholder.svg?height=200&width=300&text=Bali+Beach",
    tags: ["ALL THINGS EUROPE", "ALL THINGS ITALY"],
  },
  {
    id: "2",
    title: "Rafting through Raft Badger and Soap Creek rapids of Grand Canyon",
    image: "/placeholder.svg?height=200&width=300&text=Rafting",
    tags: [],
  },
  {
    id: "3",
    title: "Sailing Cruises Attractions And Landmarks Guide",
    image: "/placeholder.svg?height=200&width=300&text=Sailing",
    tags: [],
  },
  {
    id: "4",
    title: "Going on a gorilla tracking tour in Uganda, Rwanda, and learning",
    image: "/placeholder.svg?height=200&width=300&text=Gorilla+Tour",
    tags: [],
  },
]

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState("home")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredActivities = activities.filter((activity) => {
    const matchesCategory = selectedCategory === "ALL" || activity.category === selectedCategory
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">SAFAR</span>
                <span className="text-sm text-slate-500 hidden sm:block">TRAVEL SIMPLIFIED</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">
                  HOW IT WORKS
                </a>
                <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">
                  START PLANNING
                </a>
                <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">
                  BLOG
                </a>
                <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">
                  REVIEWS
                </a>
                <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">
                  CONTACT
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    LOGIN
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">SIGNUP</Button>
                </SignUpButton>
                <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-200">
              <div className="px-4 py-2 space-y-2">
                <a href="#" className="block py-2 text-slate-600 hover:text-slate-900">
                  HOW IT WORKS
                </a>
                <a href="#" className="block py-2 text-slate-600 hover:text-slate-900">
                  START PLANNING
                </a>
                <a href="#" className="block py-2 text-slate-600 hover:text-slate-900">
                  BLOG
                </a>
                <a href="#" className="block py-2 text-slate-600 hover:text-slate-900">
                  REVIEWS
                </a>
                <a href="#" className="block py-2 text-slate-600 hover:text-slate-900">
                  CONTACT
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/placeholder.svg?height=1080&width=1920&text=Beautiful+Travel+Destination')`,
            }}
          />

          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">FIND THE PERFECT PLACE TO GO</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Receive personalized recommendations for activities, hotels, and more
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center max-w-2xl mx-auto bg-white rounded-full p-2 shadow-2xl">
              <div className="flex items-center flex-1 px-4 py-3">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="What would you like to do?"
                  className="flex-1 text-gray-800 placeholder-gray-500 outline-none text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <SignUpButton mode="modal">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full text-lg font-semibold">
                  START PLANNING
                </Button>
              </SignUpButton>
            </div>
          </div>

          {/* Floating Video Button */}
          <div className="absolute bottom-8 right-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg">
              <div className="text-center">
                <div className="text-xs font-semibold">WATCH THE VIDEO</div>
              </div>
            </Button>
          </div>
        </section>

        {/* Trip Inspiration Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-4">TRIP INSPIRATION</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                FIND THE PERFECT PLACE TO GO ACTIVITIES,
                <br />
                HOTELS, AND MORE
              </h2>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`px-6 py-2 rounded-full font-medium ${
                    selectedCategory === category
                      ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                      : "border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((activity) => (
                <Card
                  key={activity.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-800 font-semibold">{activity.category}</Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                      <p className="text-sm opacity-90">{activity.description}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{activity.rating}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-cyan-600">{activity.price}</span>
                      <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-4">
                3 STEPS TO THE PERFECT TRIP
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                FIND TRAVEL PERFECTION, WITH THE
                <br />
                WISDOM OF EXPERTS
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Naturally head of the class when it comes to luxury travel planning, because we do more homework than
                anyone else, with a few little sweeteners thrown in! Travel to the four corners of the world, without
                going around in circles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <img src="/placeholder.svg?height=80&width=80&text=Step+1" alt="Step 1" className="w-20 h-20" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tell us what you want to do</h3>
                <p className="text-gray-600">Fill out a 2-minute questionnaire about how you like to travel</p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <img src="/placeholder.svg?height=80&width=80&text=Step+2" alt="Step 2" className="w-20 h-20" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Travel Preference & Dates</h3>
                <p className="text-gray-600">It all happens online. We recommend everything to your vision</p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <img src="/placeholder.svg?height=80&width=80&text=Step+3" alt="Step 3" className="w-20 h-20" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">We'll give you tailored recommendations</h3>
                <p className="text-gray-600">Once you're happy with your final plan, we handle everything for you</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <SignUpButton mode="modal">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 text-lg font-semibold">
                  LET'S PLAN YOUR TRIP
                </Button>
              </SignUpButton>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-4">
                SUPERIOR NETWORKING FOR TRAVEL PLANNING
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                EASILY COORDINATE AND PLAN
                <br />
                WITH FRIENDS AND FAMILY
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                You're the type of person who wants to take amazing, unique vacations – the kind where luxury meets
                authentic, and each experience is curated specifically for you. We value the user journey and experience
                above all else and are differentiated by serving their needs first – we want to make their hectic and
                stressful lives easier by enabling them to focus on enjoying their vacation and ensuring they get the
                most.
              </p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Avatar key={i} className="w-16 h-16 border-4 border-white shadow-lg">
                      <AvatarImage src={`/placeholder.svg?height=64&width=64&text=User+${i}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <SignUpButton mode="modal">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 text-lg font-semibold">
                  GET STARTED
                </Button>
              </SignUpButton>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-4">OUR LATEST BLOG POSTS</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">FROM THE RESOURCE CENTER</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {blogPosts.map((post, index) => (
                <Card
                  key={post.id}
                  className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 ${
                    index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        index === 0 ? "h-80" : "h-48"
                      }`}
                    />
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-cyan-500 text-white font-semibold">{post.category}</Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className={`font-bold mb-2 ${index === 0 ? "text-2xl" : "text-lg"}`}>{post.title}</h3>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-white/20 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">THE VALUE FOR EXPERIENCE</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Relax... You're with us! We make it simple.</p>
            <SignUpButton mode="modal">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 text-lg font-semibold">
                START PLANNING
              </Button>
            </SignUpButton>
          </div>

          {/* Illustration */}
          <div className="mt-16 relative">
            <div className="flex justify-center items-end space-x-8">
              <img
                src="/placeholder.svg?height=200&width=150&text=Travel+Illustration"
                alt="Travel"
                className="w-32 h-40"
              />
              <img
                src="/placeholder.svg?height=250&width=200&text=City+Illustration"
                alt="City"
                className="w-40 h-50"
              />
              <img
                src="/placeholder.svg?height=200&width=150&text=Adventure+Illustration"
                alt="Adventure"
                className="w-32 h-40"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">GET IN TOUCH</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="font-semibold">Address</p>
                  <p>Safar Travel</p>
                  <p>123 Travel Street,</p>
                  <p>Adventure City, AC 12345</p>
                  <p className="mt-4 font-semibold">Support Phone</p>
                  <p>+1-234-567-8900</p>
                  <p className="mt-4 font-semibold">Email: info@safar.com</p>
                  <p className="text-sm">Response time usually 4 hours</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">ABOUT US</h3>
                <div className="space-y-2 text-gray-300">
                  <a href="#" className="block hover:text-white">
                    How it Works
                  </a>
                  <a href="#" className="block hover:text-white">
                    Start Planning
                  </a>
                  <a href="#" className="block hover:text-white">
                    About Us
                  </a>
                  <a href="#" className="block hover:text-white">
                    Blog
                  </a>
                  <a href="#" className="block hover:text-white">
                    Reviews
                  </a>
                  <a href="#" className="block hover:text-white">
                    Trip Inspiration
                  </a>
                  <a href="#" className="block hover:text-white">
                    Contact Us
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">FROM THE BLOG</h3>
                <div className="space-y-2 text-gray-300">
                  <a href="#" className="block hover:text-white">
                    Travelling Guides
                  </a>
                  <a href="#" className="block hover:text-white">
                    Planning Your Trip
                  </a>
                  <a href="#" className="block hover:text-white">
                    Product Guides
                  </a>
                  <a href="#" className="block hover:text-white">
                    Guest Posts
                  </a>
                  <a href="#" className="block hover:text-white">
                    Destinations
                  </a>
                  <a href="#" className="block hover:text-white">
                    Tours
                  </a>
                  <a href="#" className="block hover:text-white">
                    Webinars
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">GET SOCIAL</h3>
                <p className="text-gray-300 mb-4">
                  Keep up-to-date with all the latest and breaking social media news. There are a lot of exciting things
                  happening this year.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">f</div>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">t</div>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">in</div>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">SAFAR</span>
                  <span className="text-sm text-gray-400">TRAVEL SIMPLIFIED</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Copyright © 2024 Safar and other trademarks, service marks, and designs are the registered or
                  unregistered trademarks of Safar Inc. in USA and other countries.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">SAFAR</h1>
                <p className="text-xs text-slate-500">AI Travel Companion</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <span>Welcome back,</span>
                <span className="font-semibold text-cyan-600">{user?.firstName}</span>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white/50 backdrop-blur-sm border border-slate-200">
            <TabsTrigger
              value="home"
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger
              value="planner"
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger
              value="hotels"
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              <Hotel className="w-4 h-4" />
              <span className="hidden sm:inline">Hotels</span>
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to Your Travel Dashboard</h2>
              <p className="text-xl text-slate-600 mb-8">
                Discover amazing destinations with AI-powered recommendations
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0 bg-white/70 backdrop-blur-sm"
                  onClick={() => setActiveTab("chat")}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Travel Assistant</h3>
                  <p className="text-slate-600">Get personalized travel recommendations and chat about destinations</p>
                </Card>

                <Card
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0 bg-white/70 backdrop-blur-sm"
                  onClick={() => setActiveTab("planner")}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Trip Planner</h3>
                  <p className="text-slate-600">Plan your perfect itinerary with AI-powered suggestions</p>
                </Card>

                <Card
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0 bg-white/70 backdrop-blur-sm"
                  onClick={() => setActiveTab("hotels")}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Hotel className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Hotel Booking</h3>
                  <p className="text-slate-600">Find and book the perfect accommodation for your trip</p>
                </Card>
              </div>
            </div>

            <LocationSetup />
          </TabsContent>

          <TabsContent value="chat">
            <LocationChat />
          </TabsContent>

          <TabsContent value="planner">
            <TripPlanner />
          </TabsContent>

          <TabsContent value="hotels">
            <HotelBooking />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Travel Community</h2>
                <p className="text-slate-600">Share your experiences and discover new places</p>
              </div>
              {/* Pass necessary props to CreatePost */}
              <CreatePost
                currentLocation={null} // You might need to pass actual location data here
                userId={user?.id || ""}
                userName={user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Anonymous"}
                userAvatar={user?.imageUrl || ""}
                onClose={() => {}} // Provide a dummy function or actual state setter
                onPostCreated={() => {}} // Provide a dummy function or actual state setter
              />
            </div>
            <UserPosts />
          </TabsContent>

          <TabsContent value="search">
            <PlaceSearch />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
