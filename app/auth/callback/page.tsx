import { Suspense } from "react"

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Completing sign in...</h1>
          <p className="text-gray-600">Please wait while we redirect you.</p>
        </div>
      </div>
    </Suspense>
  )
}
