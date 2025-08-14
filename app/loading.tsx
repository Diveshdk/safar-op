export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-6"></div>
        <h1 className="text-4xl font-bold mb-2">🚀 SAFAR</h1>
        <p className="text-blue-100">Loading your travel companion...</p>
      </div>
    </div>
  )
}
