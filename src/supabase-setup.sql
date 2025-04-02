
-- Create tables for the HeritageAR application

-- Note: The uuid-ossp extension is already enabled in Supabase by default
-- No need to create it explicitly

-- Historical Sites Table
CREATE TABLE IF NOT EXISTS historical_sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT NOT NULL,
  ar_model_url TEXT,
  coordinates JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Profile Table (extends Auth users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT display_name_length CHECK (char_length(display_name) >= 2 AND char_length(display_name) <= 50)
);

-- User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  site_id UUID REFERENCES historical_sites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);

-- Row Level Security Policies

-- Historical Sites (public read, authenticated write)
ALTER TABLE historical_sites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Historical sites are viewable by everyone" ON historical_sites;
CREATE POLICY "Historical sites are viewable by everyone" 
  ON historical_sites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Historical sites are editable by authenticated users" ON historical_sites;
CREATE POLICY "Historical sites are editable by authenticated users" 
  ON historical_sites FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Historical sites are updatable by owners" ON historical_sites;
CREATE POLICY "Historical sites are updatable by owners" 
  ON historical_sites FOR UPDATE 
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Historical sites are deletable by owners" ON historical_sites;
CREATE POLICY "Historical sites are deletable by owners" 
  ON historical_sites FOR DELETE 
  USING (auth.uid() = created_by);

-- User Profiles (users can only read/edit their own data)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Favorites (users can only access their own favorites)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own favorites" ON user_favorites;
CREATE POLICY "Users can view their own favorites" 
  ON user_favorites FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add their own favorites" ON user_favorites;
CREATE POLICY "Users can add their own favorites" 
  ON user_favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON user_favorites;
CREATE POLICY "Users can delete their own favorites" 
  ON user_favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to automatically set updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_historical_sites_updated_at ON historical_sites;
CREATE TRIGGER set_historical_sites_updated_at
  BEFORE UPDATE ON historical_sites
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- IMPROVED Function to create user profiles automatically when users are created
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  username_val TEXT;
  display_name_val TEXT;
BEGIN
  -- Set username with fallbacks
  username_val := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'User'
  );
  
  -- Set display_name with fallbacks, prioritizing the display_name from metadata
  display_name_val := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'User'
  );

  -- More robust insertion with explicit columns and avoiding constraint violations
  INSERT INTO public.user_profiles (
    id,
    username,
    display_name,
    email,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    username_val,
    display_name_val,
    COALESCE(NEW.email, ''),
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users creation
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_profile();

-- Default sites insertion remains unchanged
