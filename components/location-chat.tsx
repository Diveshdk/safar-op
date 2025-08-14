"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Users, MapPin, Wifi, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface LocationChatProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
  userName: string
  userAvatar: string
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

export default function LocationChat({ currentLocation, userId, userName, userAvatar }: LocationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (currentLocation) {
      connectWebSocket()
      loadMessages()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [currentLocation])

  const connectWebSocket = () => {
    if (!currentLocation) return

    // Simulate WebSocket connection
    setConnected(true)
    setOnlineUsers(Math.floor(Math.random() * 15) + 3)

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        loadMessages()
      }
    }, 10000)

    return () => clearInterval(interval)
  }

  const loadMessages = async () => {
    if (!currentLocation) return

    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: currentLocation.city,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        }),
      })

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentLocation) return

    setLoading(true)
    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          city: currentLocation.city,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          userId: userId,
          userName: userName,
          userAvatar: userAvatar,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewMessage("")
        loadMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!currentLocation) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 sm:p-12 text-center">
          <MapPin className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4 sm:mb-6" />
          <p className="text-gray-700 font-semibold text-base sm:text-lg">Set your location to join local chat</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
          Local Chat 💬
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">Connect with travelers in {currentLocation.city}</p>
      </div>

      <Card className="overflow-hidden shadow-2xl border-0 bg-white">
        <CardHeader className="bg-emerald-600 text-white shadow-lg">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-lg sm:text-xl font-bold">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="truncate">{currentLocation.city}</span>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6 text-sm font-medium">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Wifi className={`h-4 w-4 sm:h-5 sm:w-5 ${connected ? "text-emerald-200" : "text-red-200"}`} />
                <span>{connected ? "Live" : "Offline"}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{onlineUsers}</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages Area */}
          <div className="h-80 sm:h-96 md:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-12 sm:mt-16">
                <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-gray-300" />
                <p className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">No messages yet</p>
                <p className="text-sm sm:text-lg">Be the first to start a conversation in {currentLocation.city}!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex space-x-3 sm:space-x-4">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 ring-2 ring-gray-200 shadow-md">
                    <AvatarImage src={message.user_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-slate-600 text-white font-semibold text-xs sm:text-sm">
                      {message.user_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-2">
                      <span className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {message.user_name}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 font-medium">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {message.user_id === userId && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 font-semibold w-fit">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md border border-gray-100">
                      <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
            <div className="flex space-x-2 sm:space-x-4">
              <Input
                placeholder={`Message travelers in ${currentLocation.city}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-2 border-gray-200 focus:border-emerald-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                maxLength={500}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !newMessage.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 font-medium">
              Only travelers in {currentLocation.city} can see this chat
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chat Guidelines */}
      <Card className="shadow-lg border-0 bg-blue-50">
        <CardContent className="p-4 sm:p-6">
          <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg text-gray-900">💡 Chat Guidelines</h4>
          <ul className="text-gray-700 space-y-1 sm:space-y-2 leading-relaxed text-sm sm:text-base">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Share local tips and recommendations</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Ask questions about {currentLocation.city}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Be respectful and helpful</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>No spam or inappropriate content</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
