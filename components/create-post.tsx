"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Camera, Send, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

interface CreatePostProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  onPostCreated?: () => void
}

export default function CreatePost({ currentLocation, onPostCreated }: CreatePostProps) {
  const { user } = useUser()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please sign in to create a post")
      return
    }

    if (!currentLocation) {
      toast.error("Please set your location first")
      return
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Submitting post:", {
        title: title.trim(),
        content: content.trim(),
        city: currentLocation.city,
        userId: user.id,
        userName: user.fullName || user.firstName || "Anonymous",
      })

      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          city: currentLocation.city,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          imageUrl: imageUrl.trim() || null,
          userId: user.id,
          userName: user.fullName || user.firstName || "Anonymous",
          userAvatar: user.imageUrl || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Post creation failed:", data)
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      console.log("Post created successfully:", data)

      // Reset form
      setTitle("")
      setContent("")
      setImageUrl("")

      toast.success("Post created successfully! 🎉")

      // Notify parent component to refresh posts
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 text-center">
          <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">Please sign in to create posts</p>
        </CardContent>
      </Card>
    )
  }

  if (!currentLocation) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">Please set your location to create posts</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
          <Camera className="h-6 w-6 mr-3 text-slate-600" />
          Share Your Experience ✨
        </CardTitle>
        <div className="flex items-center text-sm text-gray-600 bg-slate-100 rounded-full px-4 py-2 w-fit">
          <MapPin className="h-4 w-4 mr-2 text-slate-600" />
          <span className="font-medium">{currentLocation.city}</span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="What's the title of your story? 📝"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-2 border-gray-200 focus:border-slate-500 rounded-xl px-4 py-3"
              maxLength={100}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
          </div>

          <div>
            <Textarea
              placeholder="Share your experience, tips, or recommendations... 🌟"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] text-base border-2 border-gray-200 focus:border-slate-500 rounded-xl px-4 py-3 resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/500 characters</p>
          </div>

          <div>
            <Input
              placeholder="Add an image URL (optional) 📸"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border-2 border-gray-200 focus:border-slate-500 rounded-xl px-4 py-3"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating Post...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Share Your Story
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
