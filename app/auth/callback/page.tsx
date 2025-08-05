// This is a client component, so it can use hooks like useRouter
"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Redirect to the home page after successful sign-in
      router.push("/")
    } else if (isLoaded && !isSignedIn) {
      // Optionally handle cases where sign-in fails or user is not signed in
      // For now, we'll just redirect to home, which will show the SignedOut state
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Processing Authentication...</h1>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}
