# SAFAR - Smart AI-Powered Travel Companion

A comprehensive travel application built with Next.js, featuring AI-powered search, local chat, trip planning, and hotel booking capabilities.

## Features

- 🔍 **AI-Powered Search**: Get instant travel insights and recommendations
- 💬 **Local Chat**: Connect with travelers in your current location
- 🏨 **Hotel Booking**: Find and book accommodations
- 📝 **Travel Posts**: Share experiences and tips with the community
- 🗺️ **Trip Planner**: Plan complete itineraries with AI assistance
- 📍 **Location-Based Services**: All features are location-aware

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Maps**: Google Maps API
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
