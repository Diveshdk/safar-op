-- Drop existing tables if they exist (be careful with this in production)
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS user_posts CASCADE;

-- Create user_posts table with correct structure
CREATE TABLE user_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    city TEXT NOT NULL,
    lat DECIMAL,
    lng DECIMAL,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_likes table
CREATE TABLE post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES user_posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_posts_city ON user_posts(city);
CREATE INDEX idx_user_posts_created_at ON user_posts(created_at DESC);
CREATE INDEX idx_user_posts_user_id ON user_posts(user_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

-- Enable Row Level Security
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for user_posts (allow all operations for now)
CREATE POLICY "Allow all operations on user_posts" ON user_posts
    FOR ALL USING (true) WITH CHECK (true);

-- Create policies for post_likes (allow all operations for now)
CREATE POLICY "Allow all operations on post_likes" ON post_likes
    FOR ALL USING (true) WITH CHECK (true);

-- Insert some test data
INSERT INTO user_posts (user_id, user_name, user_avatar, title, content, city, likes, comments) VALUES
('test_user_1', 'John Doe', 'https://example.com/avatar1.jpg', 'Amazing sunset in Mumbai', 'Just witnessed the most beautiful sunset at Marine Drive. The colors were absolutely breathtaking!', 'Mumbai', 5, 2),
('test_user_2', 'Jane Smith', 'https://example.com/avatar2.jpg', 'Street food adventure in Delhi', 'Tried the most delicious chaat at Chandni Chowk. The flavors were incredible and the experience was unforgettable!', 'Delhi', 8, 4),
('test_user_3', 'Mike Johnson', 'https://example.com/avatar3.jpg', 'Peaceful morning in Goa', 'Woke up early to catch the sunrise at Anjuna Beach. The tranquility and beauty of this place never fails to amaze me.', 'Goa', 12, 6);
