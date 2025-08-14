"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, MapPin, Clock, Camera } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface UserPostsProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
  showAll?: boolean
  refreshTrigger?: number // Add this new prop
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
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [currentLocation, showAll, refreshTrigger]) // Add refreshTrigger here

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: currentLocation?.city,
          showAll: showAll,
          userId: userId,
        }),
      })

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      })

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: post.liked_by_user ? post.likes - 1 : post.likes + 1,
                  liked_by_user: !post.liked_by_user,
                }
              : post,
          ),
        )
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading posts...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          {showAll ? "All Posts" : `Posts from ${currentLocation?.city || "your area"}`} ✨
        </h3>
        {currentLocation && !showAll && (
          <div className="flex items-center text-sm font-medium text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-4 py-2 border border-indigo-200">
            <MapPin className="h-4 w-4 mr-2 text-indigo-600" />
            {currentLocation.city}
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
          <CardContent className="p-12 text-center">
            <Camera className="h-16 w-16 mx-auto text-gray-400 mb-6" />
            <p className="text-gray-700 mb-3 font-semibold text-xl">No posts yet</p>
            <p className="text-gray-500 text-lg leading-relaxed">
              {showAll
                ? "Be the first to share your travel experience!"
                : `Be the first to share something about ${currentLocation?.city}!`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 hover:scale-[1.02]"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-4 ring-indigo-100 shadow-lg">
                      <AvatarImage src={post.user_avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold">
                        {post.user_name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{post.user_name}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-indigo-500" />
                          {post.city}
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-0 font-semibold px-3 py-1 rounded-full"
                  >
                    Travel Story
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <h4 className="font-bold text-xl mb-3 text-gray-900 leading-tight">{post.title}</h4>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">{post.content}</p>

                {post.image_url && (
                  <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt="Post image"
                      className="w-full h-64 md:h-80 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 hover:bg-rose-50 rounded-full px-4 py-2 transition-all duration-300 ${
                        post.liked_by_user ? "text-rose-600 bg-rose-50" : "text-gray-600"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${post.liked_by_user ? "fill-current" : ""}`} />
                      <span className="font-semibold">{post.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-full px-4 py-2 transition-all duration-300"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">{post.comments}</span>
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500 font-medium">
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
