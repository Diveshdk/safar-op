# 🚀 SAFAR - Smart AI-Powered Travel Companion

A comprehensive travel companion app built with Next.js, Supabase, and AI integration.

## ✨ Features

- **User Authentication**: Google OAuth via Supabase
- **Location-based Services**: Automatic location detection and location-based content
- **AI-Powered Search**: Search destinations and get detailed AI-generated travel guides
- **Real-time Chat**: Location-based chat with fellow travelers
- **User Posts**: Share travel experiences and tips with upvoting system
- **Weather Integration**: Current weather information for destinations
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **AI**: Google Gemini API
- **Maps**: Google Maps API
- **UI Components**: shadcn/ui

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account
- Google Cloud Platform account (for Maps API and OAuth)
- Google AI Studio account (for Gemini API)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration  
GEMINI_API_KEY=your_gemini_api_key

# Google Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Environment
NODE_ENV=development
\`\`\`

### Where to Get API Keys

1. **Supabase**: 
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get URL and keys from Settings > API

2. **Gemini API**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Copy the key (starts with AIzaSy...)

3. **Google Maps API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable Maps JavaScript API and Geocoding API
   - Create credentials and get API key

4. **Google OAuth**:
   - In Google Cloud Console, go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add your domain to authorized origins

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd safar-travel-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up your environment variables in `.env.local`

4. Run the database setup scripts in Supabase SQL Editor:
   - Execute `scripts/create-tables.sql`
   - Execute `scripts/seed-data.sql`

5. Configure Supabase Auth:
   - Go to Authentication > Settings
   - Add Google as a provider
   - Set redirect URL to: `http://localhost:3000/auth/callback`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

1. **Sign Up/Login**: Use Google OAuth or test login
2. **Explore**: Search for destinations to get AI-powered travel guides
3. **Chat**: Join location-based chat rooms to connect with other travelers
4. **Share**: Create posts about your travel experiences
5. **Discover**: Browse posts from other travelers in your area

## 🗄️ Database Schema

The app uses the following main tables:
- `profiles`: User profile information
- `user_posts`: Travel posts and experiences
- `chat_messages`: Location-based chat messages
- `post_likes`: Post like tracking

## 🔧 API Endpoints

- `/api/search-place`: AI-powered destination search
- `/api/chat/messages`: Get location-based chat messages
- `/api/chat/send`: Send chat messages
- `/api/posts`: Get user posts
- `/api/posts/create`: Create new posts
- `/api/posts/like`: Like/unlike posts
- `/api/geocode`: Reverse geocoding for location names

## 🎨 Design Inspiration

The UI design is inspired by modern travel apps with a focus on:
- Clean, intuitive interface
- Travel-themed color scheme
- Mobile-first responsive design
- Pinterest-like feed for posts
- Chat interface similar to modern messaging apps

## 🚀 Deployment

The app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
