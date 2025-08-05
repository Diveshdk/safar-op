"use client"

import type React from "react"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserButton } from "@clerk/nextjs"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import dynamic from "next/dynamic" // Use 'dynamic' for lazy loading
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { UserPosts } from "@/components/user-posts"
import { LocationChat } from "@/components/location-chat"
import { TripPlanner } from "@/components/trip-planner"
import { PlaceSearch } from "@/components/place-search"
import { HotelBooking } from "@/components/hotel-booking"

// Correct dynamic imports for default exports
const CreatePost = dynamic(() => import("@/components/create-post"), { ssr: false })
const LocationSetup = dynamic(() => import("@/components/location-setup"), { ssr: false })

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between h-16 px-4 border-b shrink-0 md:px-6">
        <Link className="flex items-center gap-2 text-lg font-semibold sm:text-base" href="#">
          <MountainIcon className="w-6 h-6" />
          <span className="sr-only">Safar</span>
        </Link>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          </SignedOut>
        </div>
      </header>
      <main className="flex-1 grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:p-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Welcome to Safar!</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p>
              Safar is your ultimate travel companion. Plan your trips, discover new places, and share your adventures
              with the community.
            </p>
            <Separator />
            <div className="grid gap-2">
              <h3 className="font-semibold">Key Features:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI-powered Trip Planning</li>
                <li>Location-based Chat</li>
                <li>Place Search & Discovery</li>
                <li>Hotel Booking</li>
                <li>Community Posts</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <CreatePost />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <UserPosts />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Trip Planner</CardTitle>
          </CardHeader>
          <CardContent>
            <TripPlanner />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <LocationChat />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Place Search</CardTitle>
          </CardHeader>
          <CardContent>
            <PlaceSearch />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hotel Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <HotelBooking />
          </CardContent>
        </Card>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Safar. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
