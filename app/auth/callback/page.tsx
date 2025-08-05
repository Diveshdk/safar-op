"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AuthCallbackPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // User is signed in, redirect to home or dashboard
      router.push("/")
    } else if (isLoaded && !isSignedIn) {
      // User is not signed in, redirect to sign-in page
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Authenticating...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Please wait while we verify your identity.</p>
        </CardContent>
      </Card>
    </div>
  )
}
