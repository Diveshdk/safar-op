-- Create user_posts table
CREATE TABLE IF NOT EXISTS user_posts (
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

-- Create post_likes table for tracking likes
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES user_posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_posts_city ON user_posts(city);
CREATE INDEX IF NOT EXISTS idx_user_posts_created_at ON user_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_posts_user_id ON user_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for user_posts
CREATE POLICY "Allow public read access to posts" ON user_posts
    FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own posts" ON user_posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update their own posts" ON user_posts
    FOR UPDATE USING (true);

-- Create policies for post_likes
CREATE POLICY "Allow public read access to likes" ON post_likes
    FOR SELECT USING (true);

CREATE POLICY "Allow users to manage their own likes" ON post_likes
    FOR ALL USING (true);
