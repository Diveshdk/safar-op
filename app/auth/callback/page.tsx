"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { Compass } from "lucide-react"

export default function AuthCallback() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.push("/")
      } else {
        router.push("/")
      }
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 text-white animate-spin" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">SAFAR</h1>
        <p className="text-slate-600">Completing your sign in...</p>
      </div>
    </div>
  )
}
