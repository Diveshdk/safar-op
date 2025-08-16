-- Create hotels table if it doesn't exist
CREATE TABLE IF NOT EXISTS hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price INTEGER NOT NULL,
  image_url TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_rooms INTEGER DEFAULT 1,
  available_rooms INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_owner ON hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON hotels(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Create policies for hotels table
DROP POLICY IF EXISTS "Hotels are viewable by everyone" ON hotels;
CREATE POLICY "Hotels are viewable by everyone" ON hotels
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own hotels" ON hotels;
CREATE POLICY "Users can insert their own hotels" ON hotels
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own hotels" ON hotels;
CREATE POLICY "Users can update their own hotels" ON hotels
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Insert some sample data
INSERT INTO hotels (owner_id, name, description, city, address, price, image_url, amenities, rating, total_rooms, available_rooms) VALUES
('sample_user_1', 'Grand Palace Hotel', 'Luxury hotel with world-class amenities and service', 'Mumbai', '123 Marine Drive, Mumbai, Maharashtra', 15000, '/placeholder.svg?height=240&width=400', '["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Room Service"]', 4.8, 50, 45),
('sample_user_2', 'Beach Resort Goa', 'Beautiful beachfront resort with stunning ocean views', 'Goa', '456 Calangute Beach Road, Goa', 8500, '/placeholder.svg?height=240&width=400', '["WiFi", "Beach Access", "Pool", "Restaurant", "Bar", "Water Sports"]', 4.6, 30, 25),
('sample_user_3', 'Hill Station Retreat', 'Peaceful mountain retreat perfect for relaxation', 'Shimla', '789 Mall Road, Shimla, Himachal Pradesh', 6500, '/placeholder.svg?height=240&width=400', '["WiFi", "Mountain View", "Restaurant", "Fireplace", "Garden"]', 4.4, 20, 18),
('sample_user_4', 'Business Center Hotel', 'Modern hotel perfect for business travelers', 'Delhi', '321 Connaught Place, New Delhi', 12000, '/placeholder.svg?height=240&width=400', '["WiFi", "Business Center", "Conference Rooms", "Gym", "Restaurant"]', 4.5, 40, 35),
('sample_user_5', 'Heritage Haveli', 'Traditional heritage hotel with royal architecture', 'Jaipur', '654 City Palace Road, Jaipur, Rajasthan', 9500, '/placeholder.svg?height=240&width=400', '["WiFi", "Heritage Architecture", "Restaurant", "Courtyard", "Cultural Shows"]', 4.7, 25, 22)
ON CONFLICT (id) DO NOTHING;
