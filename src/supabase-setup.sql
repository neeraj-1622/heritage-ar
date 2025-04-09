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
  mythology TEXT,
  cultural_aspects TEXT,
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

-- Add mythology and cultural_aspects columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'historical_sites' 
    AND column_name = 'mythology'
  ) THEN
    ALTER TABLE historical_sites ADD COLUMN mythology TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'historical_sites' 
    AND column_name = 'cultural_aspects'
  ) THEN
    ALTER TABLE historical_sites ADD COLUMN cultural_aspects TEXT;
  END IF;
END $$;

-- Clear existing data from historical_sites table
DELETE FROM historical_sites;

-- Insert sample historical sites with mythology and cultural aspects
INSERT INTO historical_sites (name, period, location, short_description, long_description, mythology, cultural_aspects, image_url, ar_enabled) VALUES
('Great Pyramid of Giza', 'Ancient Egyptian', 'Giza, Egypt', 
'One of the Seven Wonders of the Ancient World, built around 2560 BCE.',
'The Great Pyramid of Giza stands as the last surviving wonder of the ancient world. Built during the reign of Pharaoh Khufu, it served as both a tomb and a symbol of ancient Egyptian architectural mastery.',
'Rising majestically from the edge of the Sahara, the Great Pyramid of Giza is more than a tomb—it is an eternal beacon of the power and ingenuity of ancient Egypt. Constructed around 2560 BCE during the reign of Pharaoh Khufu, this colossal structure was built as a staircase to the divine, a monumental gateway guiding the fallen king into the afterlife.',
'Built during the Old Kingdom of Egypt (around 2580–2560 BCE), the Great Pyramid represents the pinnacle of ancient Egyptian civilization. The site reflects deep cultural traditions including elaborate funerary rituals, religious practices honoring gods like Ra and Osiris, and sophisticated architectural techniques. The ancient Egyptian language, with its hieroglyphs, was used for religious texts and monumental inscriptions. The pyramid''s construction showcases advanced understanding of mathematics and astronomy, while its artistic elements include tomb paintings and carvings that served both decorative and religious functions. Traditional Egyptian diet included bread, beer, and vegetables, while clothing was typically made from linen, with elaborate garments for nobility.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/pyramid.jpg', 
true),

('Machu Picchu', 'Inca', 'Cusco Region, Peru',
'15th-century Inca citadel located in southern Peru.',
'Machu Picchu is an ancient Inca city set high in the Andes Mountains. Built in the 15th century and later abandoned, it is renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar.',
'Perched high in the Andean mountains and shrouded in a perpetual mist, Machu Picchu is a dazzling testament to the ingenuity and spirituality of the Inca Empire.',
'Machu Picchu embodies the rich cultural heritage of the Inca civilization. The site preserves the Quechua language tradition, which remains widely spoken in Andean communities. Incan customs centered on ceremonies honoring natural deities, particularly the sun god Inti and earth goddess Pachamama. The site''s remarkable stonework demonstrates sophisticated masonry techniques, while textile traditions feature intricate patterns and symbolism. Traditional Andean cuisine includes staples like potatoes, maize, and quinoa. The location and design of Machu Picchu reflect the Incan worldview integrating astronomy, agriculture, and spirituality.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/machupicchu.jpg',
true),

('Parthenon', 'Ancient Greek', 'Athens, Greece',
'Ancient Greek temple dedicated to the goddess Athena.',
'The Parthenon is a former temple on the Athenian Acropolis, Greece, dedicated to the goddess Athena, whom the people of Athens considered their patron.',
'Dominating the skyline of ancient Athens, the Parthenon is the quintessential symbol of classical beauty, political power, and cultural refinement.',
'The Parthenon, built in the 5th century BCE, represents the pinnacle of Classical Greek civilization. Ancient Greek language and literature, including epic poetry and philosophical works, shaped Western intellectual traditions. Athenian society fostered democratic ideals and public discourse, while religious festivals like the Panathenaia celebrated civic and spiritual life. The Mediterranean diet featured olives, wine, and bread, while clothing included the chiton and himation. The site exemplifies Greek architectural precision and artistic achievement, influencing Western architecture and art for millennia.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/parthenon.jpg',
true),

('Stonehenge', 'Neolithic', 'Wiltshire, England',
'Prehistoric monument in Wiltshire, England.',
'Stonehenge is a prehistoric monument in Wiltshire, England, consisting of a ring of standing stones. Each stone is around 13 feet high, seven feet wide, and weighs around 25 tons.',
'Shrouded in mists of prehistoric mystery, Stonehenge is one of the world''s most enigmatic monuments.',
'Constructed during the late Neolithic to early Bronze Age (3000-2000 BCE), Stonehenge reflects prehistoric British cultural practices. While the builders'' language remains unknown, the site suggests sophisticated ceremonial and astronomical knowledge. The monument likely served for religious ceremonies and seasonal celebrations, particularly during solstices. Archaeological evidence indicates a society of farmers and hunters, with clothing made from natural fibers and animal hides. The precise stone arrangement demonstrates advanced understanding of astronomy and engineering, inspiring countless cultural interpretations through the ages.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/stonehenge.jpg',
true),

('Taj Mahal', 'Mughal', 'Agra, India',
'17th-century marble mausoleum built by Emperor Shah Jahan.',
'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, India. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.',
'In the heart of Agra, along the serene banks of the Yamuna River, the Taj Mahal rises as a beacon of love and artistic genius.',
'Built in the mid-17th century, the Taj Mahal exemplifies Mughal cultural synthesis. Persian was the court language, while Urdu flourished among the people. The monument reflects Islamic and Hindu architectural traditions, featuring intricate calligraphy and floral patterns. Mughal culture introduced rich culinary traditions combining Persian and Indian influences, particularly in dishes like biryani. Traditional dress included elaborate robes and jewelry, reflecting social status and artistic traditions. The site represents the height of Mughal architectural and engineering achievement.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/tajmahal.jpg',
true),

('The Colosseum', 'Ancient Roman', 'Rome, Italy',
'Ancient amphitheater in the heart of Rome.',
'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy. Built of travertine limestone, tuff, and brick-faced concrete, it is the largest amphitheatre ever built.',
'In the heart of ancient Rome, the Colosseum emerges as a monumental arena where grandeur, violence, and spectacle converged to define an entire civilization.',
'Built between 70-80 CE, the Colosseum embodies Roman cultural achievements. Latin, the empire''s language, influenced Western languages and legal systems. The venue hosted gladiatorial games and public spectacles that were central to Roman civic life. Roman cuisine featured Mediterranean ingredients and elaborate banquets, while clothing distinctions, particularly the toga, marked social status. The structure showcases Roman engineering excellence, using innovative architectural techniques that influenced Western building practices for centuries.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/colosseum.jpg',
true);
