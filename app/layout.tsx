import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SAFAR - Smart AI-Powered Travel Companion",
  description: "Discover amazing places, connect with travelers, and plan your perfect trip with AI assistance.",
  keywords: ["travel", "AI", "trip planning", "hotels", "local chat", "travel companion"],
  authors: [{ name: "SAFAR Team" }],
  creator: "SAFAR",
  publisher: "SAFAR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://safar-travel.vercel.app"),
  openGraph: {
    title: "SAFAR - Smart AI-Powered Travel Companion",
    description: "Discover amazing places, connect with travelers, and plan your perfect trip with AI assistance.",
    url: "https://safar-travel.vercel.app",
    siteName: "SAFAR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SAFAR - Smart AI-Powered Travel Companion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAFAR - Smart AI-Powered Travel Companion",
    description: "Discover amazing places, connect with travelers, and plan your perfect trip with AI assistance.",
    images: ["/og-image.jpg"],
    creator: "@safar_travel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
