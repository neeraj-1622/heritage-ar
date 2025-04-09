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
  ar_enabled BOOLEAN DEFAULT false,
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

-- Enable Row Level Security
ALTER TABLE historical_sites ENABLE ROW LEVEL SECURITY;

-- Create policies for historical_sites
DROP POLICY IF EXISTS "Historical sites are viewable by everyone" ON historical_sites;
CREATE POLICY "Historical sites are viewable by everyone" 
  ON historical_sites 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Historical sites are editable by authenticated users" ON historical_sites;
CREATE POLICY "Historical sites are editable by authenticated users" 
  ON historical_sites 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Historical sites are updatable by owners" ON historical_sites;
CREATE POLICY "Historical sites are updatable by owners" 
  ON historical_sites 
  FOR UPDATE 
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Historical sites are deletable by owners" ON historical_sites;
CREATE POLICY "Historical sites are deletable by owners" 
  ON historical_sites 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- User Profiles (users can only read/edit their own data)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" 
  ON user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" 
  ON user_profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id);

-- Favorites (users can only access their own favorites)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON user_favorites;
CREATE POLICY "Users can view their own favorites" 
  ON user_favorites 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add their own favorites" ON user_favorites;
CREATE POLICY "Users can add their own favorites" 
  ON user_favorites 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON user_favorites;
CREATE POLICY "Users can delete their own favorites" 
  ON user_favorites 
  FOR DELETE 
  TO authenticated
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

-- Clear existing data from historical_sites table
TRUNCATE TABLE historical_sites CASCADE;

-- Insert historical sites data
INSERT INTO historical_sites (
  name,
  period,
  location,
  short_description,
  long_description,
  image_url,
  ar_model_url,
  coordinates,
  ar_enabled
) VALUES
(
  'Stonehenge',
  'Neolithic',
  'Wiltshire, England',
  'A prehistoric monument consisting of a ring of standing stones.',
  'Stonehenge is a prehistoric monument in Wiltshire, England, consisting of a ring of standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons. The stones are set within earthworks in the middle of the most dense complex of Neolithic and Bronze Age monuments in England.',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/stonehenge.jpg',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-models/stonehenge.glb',
  '{"lat": 51.1789, "lng": -1.8262}',
  false
),
(
  'The Colosseum',
  'Ancient Rome',
  'Rome, Italy',
  'An oval amphitheatre in the centre of Rome, built of travertine limestone, tuff, and brick-faced concrete.',
  'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, despite its age.',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/colosseum.jpg',
  'https://raw.githubusercontent.com/neerajreddy1622/heritage-ar/main/public/models/colosseum.glb',
  '{"lat": 41.8902, "lng": 12.4922}',
  false
),
(
  'Parthenon',
  'Ancient Greece',
  'Athens, Greece',
  'A former temple dedicated to the goddess Athena, completed in 438 BC.',
  'The Parthenon is a former temple on the Athenian Acropolis, Greece, dedicated to the goddess Athena, whom the people of Athens considered their patron. Construction began in 447 BC when the Athenian Empire was at the peak of its power.',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/parthenon.jpg',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-models/parthenon.glb',
  '{"lat": 37.9715, "lng": 23.7267}',
  false
),
(
  'Taj Mahal',
  'Mughal Empire',
  'Agra, India',
  'An ivory-white marble mausoleum commissioned in 1632 by the Mughal emperor Shah Jahan.',
  'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favourite wife, Mumtaz Mahal.',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/tajmahal.jpg',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-models/taj_mahal.glb',
  '{"lat": 27.1751, "lng": 78.0421}',
  false
),
(
  'Great Pyramid of Giza',
  'Ancient Egypt',
  'Giza, Egypt',
  'The oldest and largest of the three pyramids in the Giza pyramid complex.',
  'The Great Pyramid of Giza is the oldest and largest of the three pyramids in the Giza pyramid complex bordering present-day Giza in Greater Cairo, Egypt. It is the oldest of the Seven Wonders of the Ancient World, and the only one to remain largely intact.',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/pyramid.jpg',
  'https://raw.githubusercontent.com/neerajreddy1622/heritage-ar/main/public/models/pyramid.glb',
  '{"lat": 29.9792, "lng": 31.1342}',
  false
),
(
  'Machu Picchu',
  'Inca Empire',
  'Cusco Region, Peru',
  'A 15th-century Inca citadel located in the Eastern Cordillera of southern Peru.',
  'Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-meter mountain ridge. It is located in the Machupicchu District within Urubamba Province above the Sacred Valley.',
  'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/machupicchu.jpg',
  'https://raw.githubusercontent.com/neerajreddy1622/heritage-ar/main/public/models/machupicchu.glb',
  '{"lat": -13.1631, "lng": -72.5450}',
  false
);
