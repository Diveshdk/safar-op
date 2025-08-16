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
    rating DECIMAL(3, 2) DEFAULT 4.0,
    total_rooms INTEGER DEFAULT 1,
    available_rooms INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_owner ON hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON hotels(created_at DESC);

-- Enable Row Level Security
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Create policies for hotels
DROP POLICY IF EXISTS "Hotels are viewable by everyone" ON hotels;
CREATE POLICY "Hotels are viewable by everyone" ON hotels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own hotels" ON hotels;
CREATE POLICY "Users can insert their own hotels" ON hotels FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own hotels" ON hotels;
CREATE POLICY "Users can update their own hotels" ON hotels FOR UPDATE USING (true);

-- Insert some sample data
INSERT INTO hotels (owner_id, name, description, city, address, price, image_url, amenities, rating, total_rooms, available_rooms) VALUES
('sample-owner-1', 'The Grand Mumbai', 'Luxury 5-star hotel in the heart of Mumbai with stunning city views', 'Mumbai', 'Apollo Bunder, Colaba, Mumbai', 8500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge'], 4.8, 120, 45),
('sample-owner-2', 'Delhi Palace Hotel', 'Heritage hotel with modern amenities in New Delhi', 'Delhi', 'Connaught Place, New Delhi', 6500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Restaurant', 'Gym', 'Business Center', 'Parking'], 4.5, 80, 25),
('sample-owner-3', 'Bangalore Tech Suites', 'Modern hotel perfect for business travelers', 'Bangalore', 'MG Road, Bangalore', 4500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Business Center', 'Conference Rooms', 'Gym'], 4.3, 60, 18),
('sample-owner-4', 'Goa Beach Resort', 'Beachfront resort with stunning ocean views', 'Goa', 'Baga Beach, North Goa', 7500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Water Sports'], 4.7, 100, 35),
('sample-owner-5', 'Jaipur Heritage Inn', 'Traditional Rajasthani hospitality with modern comfort', 'Jaipur', 'Pink City, Jaipur', 3500, '/placeholder.svg?height=240&width=400', ARRAY['WiFi', 'Restaurant', 'Cultural Shows', 'Parking'], 4.4, 40, 12)
ON CONFLICT DO NOTHING;
