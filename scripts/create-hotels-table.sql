-- Create hotels table if it doesn't exist
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price INTEGER NOT NULL,
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0,
  total_rooms INTEGER DEFAULT 1,
  available_rooms INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_owner ON hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels(rating DESC);

-- Enable Row Level Security
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Create policies for hotels table
DROP POLICY IF EXISTS "Allow public read access to hotels" ON hotels;
CREATE POLICY "Allow public read access to hotels" ON hotels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert hotels" ON hotels;
CREATE POLICY "Allow authenticated users to insert hotels" ON hotels FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to update their own hotels" ON hotels;
CREATE POLICY "Allow users to update their own hotels" ON hotels FOR UPDATE USING (owner_id = auth.uid()::text);

DROP POLICY IF EXISTS "Allow users to delete their own hotels" ON hotels;
CREATE POLICY "Allow users to delete their own hotels" ON hotels FOR DELETE USING (owner_id = auth.uid()::text);

-- Insert sample data
INSERT INTO hotels (owner_id, name, description, city, address, price, image_url, amenities, rating, total_rooms, available_rooms) VALUES
('sample_user_1', 'The Grand Mumbai', 'Luxury hotel in the heart of Mumbai with stunning city views', 'Mumbai', 'Apollo Bunder, Colaba, Mumbai', 8000, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Valet Parking'], 4.8, 120, 35),
('sample_user_2', 'Delhi Palace Hotel', 'Heritage hotel near India Gate with traditional architecture', 'Delhi', 'Connaught Place, New Delhi', 6500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Restaurant', 'Bar', 'Room Service', 'Laundry'], 4.5, 80, 22),
('sample_user_3', 'Bangalore Business Inn', 'Modern hotel perfect for business travelers in IT hub', 'Bangalore', 'MG Road, Bangalore', 4500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Business Center', 'Meeting Rooms', 'Gym', 'Restaurant'], 4.3, 60, 18),
('sample_user_4', 'Goa Beach Resort', 'Beachfront resort with stunning ocean views and water sports', 'Goa', 'Calangute Beach, North Goa', 7500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Pool', 'Beach Access', 'Water Sports', 'Restaurant', 'Bar'], 4.7, 90, 28),
('sample_user_5', 'Jaipur Heritage Hotel', 'Royal palace converted into luxury hotel with traditional decor', 'Jaipur', 'City Palace Road, Jaipur', 5500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Restaurant', 'Cultural Shows', 'Spa', 'Garden'], 4.6, 70, 20)
ON CONFLICT DO NOTHING;
