"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, MessageCircle, MapPin, Users, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

interface LocationChatProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
}

interface ChatMessage {
  id: string
  user_id: string
  user_name: string
  user_avatar?: string
  message: string
  city: string
  created_at: string
}

export default function LocationChat({ currentLocation }: LocationChatProps) {
  const { user } = useUser()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentLocation) {
      loadMessages()
      // Set up polling for new messages every 5 seconds
      const interval = setInterval(loadMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [currentLocation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = async () => {
    if (!currentLocation) return

    try {
      setError(null)
      console.log("Loading messages for:", currentLocation.city)

      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: currentLocation.city,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Messages loaded:", data)

      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error loading messages:", error)
      setError(error instanceof Error ? error.message : "Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !currentLocation || !newMessage.trim()) {
      return
    }

    if (!newMessage.trim()) {
      toast.error("Please enter a message")
      return
    }

    setSending(true)

    try {
      console.log("Sending message:", {
        message: newMessage.trim(),
        city: currentLocation.city,
        userId: user.id,
        userName: user.fullName || user.firstName || "Anonymous",
      })

      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          city: currentLocation.city,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          userId: user.id,
          userName: user.fullName || user.firstName || "Anonymous",
          userAvatar: user.imageUrl || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Message sent:", data)

      setNewMessage("")
      toast.success("Message sent! 💬")

      // Reload messages to show the new message
      await loadMessages()
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  if (!user) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">Please sign in to join the chat</p>
        </CardContent>
      </Card>
    )
  }

  if (!currentLocation) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">Please set your location to join local chat</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-0 bg-white h-[600px] flex flex-col">
      <CardHeader className="pb-4 border-b border-gray-200">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="h-6 w-6 mr-3 text-slate-600" />
          Local Chat 💬
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600 bg-slate-100 rounded-full px-4 py-2">
            <MapPin className="h-4 w-4 mr-2 text-slate-600" />
            <span className="font-medium">{currentLocation.city}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {messages.length > 0 ? `${new Set(messages.map((m) => m.user_id)).size} users` : "No users yet"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-600 mb-2" />
                <p className="text-gray-600">Loading messages...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
                <p className="text-red-600 font-semibold mb-2">Error loading messages</p>
                <p className="text-gray-500 text-sm mb-4">{error}</p>
                <Button onClick={loadMessages} size="sm" className="bg-slate-600 hover:bg-slate-700">
                  Try Again
                </Button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-semibold mb-2">No messages yet</p>
                <p className="text-gray-500 text-sm">Be the first to start a conversation in {currentLocation.city}!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.user_id === user.id ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.user_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-slate-600 text-white text-xs">
                      {message.user_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.user_id === user.id ? "bg-slate-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-xs font-medium mb-1 opacity-75">{message.user_name}</p>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${currentLocation.city} travelers...`}
              className="flex-1 border-2 border-gray-200 focus:border-slate-500 rounded-xl"
              disabled={sending}
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 rounded-xl"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">{newMessage.length}/500 characters</p>
        </div>
      </CardContent>
    </Card>
  )
}
