"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, MapPin, Clock, Camera, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

interface UserPostsProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
  showAll?: boolean
  refreshTrigger?: number
}

interface Post {
  id: string
  user_id: string
  user_name: string
  user_avatar?: string
  title: string
  content: string
  city: string
  image_url?: string
  likes: number
  comments: number
  created_at: string
  liked_by_user: boolean
}

export default function UserPosts({ currentLocation, userId, showAll = false, refreshTrigger }: UserPostsProps) {
  const { user } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [currentLocation, showAll, refreshTrigger, user])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Loading posts with params:", {
        city: currentLocation?.city,
        showAll,
        userId: user?.id,
      })

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: currentLocation?.city,
          showAll: showAll,
          userId: user?.id || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Posts loaded:", data)

      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error loading posts:", error)
      setError(error instanceof Error ? error.message : "Failed to load posts")
      toast.error("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("Please sign in to like posts")
      return
    }

    try {
      console.log("Liking post:", postId)

      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId: user.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Like response:", data)

      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: data.liked ? post.likes + 1 : post.likes - 1,
                  liked_by_user: data.liked,
                }
              : post,
          ),
        )

        toast.success(data.liked ? "Post liked! ❤️" : "Like removed")
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast.error(error instanceof Error ? error.message : "Failed to like post")
    }
  }

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-600 border-t-transparent mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-700 font-semibold text-base sm:text-lg">Loading posts...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 sm:p-12 text-center">
          <Camera className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-red-400 mb-4 sm:mb-6" />
          <p className="text-red-600 mb-2 sm:mb-3 font-semibold text-lg sm:text-xl">Error loading posts</p>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-4">{error}</p>
          <Button onClick={loadPosts} className="bg-slate-600 hover:bg-slate-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          {showAll ? "All Posts" : `Posts from ${currentLocation?.city || "your area"}`} ✨
        </h3>
        {currentLocation && !showAll && (
          <div className="flex items-center text-sm font-medium text-gray-600 bg-slate-100 rounded-full px-3 sm:px-4 py-1 sm:py-2 border border-slate-200 w-fit">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-slate-600" />
            <span className="truncate">{currentLocation.city}</span>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50 shadow-lg">
          <CardContent className="p-8 sm:p-12 text-center">
            <Camera className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4 sm:mb-6" />
            <p className="text-gray-700 mb-2 sm:mb-3 font-semibold text-lg sm:text-xl">No posts yet</p>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              {showAll
                ? "Be the first to share your travel experience!"
                : `Be the first to share something about ${currentLocation?.city}!`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white hover:scale-[1.01] sm:hover:scale-[1.02]"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 sm:ring-4 ring-slate-100 shadow-lg flex-shrink-0">
                      <AvatarImage src={post.user_avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-slate-600 text-white font-semibold text-sm">
                        {post.user_name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-base sm:text-lg truncate">{post.user_name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-3">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-slate-500" />
                          <span className="truncate">{post.city}</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-400" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 border-0 font-semibold px-2 sm:px-3 py-1 rounded-full flex-shrink-0"
                  >
                    Travel Story
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <h4 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 leading-tight">{post.title}</h4>
                <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{post.content}</p>

                {post.image_url && (
                  <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt="Post image"
                      className="w-full h-48 sm:h-64 md:h-80 object-cover hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=500"
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 sm:space-x-2 hover:bg-rose-50 rounded-full px-3 sm:px-4 py-2 transition-all duration-300 ${
                        post.liked_by_user ? "text-rose-600 bg-rose-50" : "text-gray-600"
                      }`}
                      disabled={!user}
                    >
                      <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${post.liked_by_user ? "fill-current" : ""}`} />
                      <span className="font-semibold text-sm sm:text-base">{post.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-full px-3 sm:px-4 py-2 transition-all duration-300"
                    >
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-semibold text-sm sm:text-base">{post.comments}</span>
                    </Button>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-500 font-medium">
                    {new Date(post.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
