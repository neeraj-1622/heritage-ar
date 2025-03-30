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
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create policies for historical_sites
BEGIN;
  -- Drop existing policies if they exist
  DELETE FROM pg_policies WHERE tablename = 'historical_sites';
  
  -- Create new policies
  INSERT INTO pg_policies (schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check)
  VALUES 
    ('public', 'historical_sites', 'Historical sites are viewable by everyone', true, ARRAY[0], 'SELECT', 'true', NULL),
    ('public', 'historical_sites', 'Historical sites are editable by authenticated users', true, ARRAY[0], 'INSERT', NULL, 'auth.role() = ''authenticated'''),
    ('public', 'historical_sites', 'Historical sites are updatable by owners', true, ARRAY[0], 'UPDATE', 'auth.uid() = created_by', NULL),
    ('public', 'historical_sites', 'Historical sites are deletable by owners', true, ARRAY[0], 'DELETE', 'auth.uid() = created_by', NULL);
COMMIT;

-- User Profiles (users can only read/edit their own data)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
BEGIN;
  -- Drop existing policies if they exist
  DELETE FROM pg_policies WHERE tablename = 'user_profiles';
  
  -- Create new policies
  INSERT INTO pg_policies (schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check)
  VALUES 
    ('public', 'user_profiles', 'Users can view their own profile', true, ARRAY[0], 'SELECT', 'auth.uid() = id', NULL),
    ('public', 'user_profiles', 'Users can update their own profile', true, ARRAY[0], 'UPDATE', 'auth.uid() = id', NULL);
COMMIT;

-- Favorites (users can only access their own favorites)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
BEGIN;
  -- Drop existing policies if they exist
  DELETE FROM pg_policies WHERE tablename = 'user_favorites';
  
  -- Create new policies
  INSERT INTO pg_policies (schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check)
  VALUES 
    ('public', 'user_favorites', 'Users can view their own favorites', true, ARRAY[0], 'SELECT', 'auth.uid() = user_id', NULL),
    ('public', 'user_favorites', 'Users can add their own favorites', true, ARRAY[0], 'INSERT', NULL, 'auth.uid() = user_id'),
    ('public', 'user_favorites', 'Users can delete their own favorites', true, ARRAY[0], 'DELETE', 'auth.uid() = user_id', NULL);
COMMIT;

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

-- Clear existing data (optional)
TRUNCATE TABLE historical_sites CASCADE;

-- Default sites insertion
INSERT INTO historical_sites (name, period, location, short_description, long_description, image_url, coordinates) VALUES
('The Colosseum', 'Ancient Rome', 'Rome, Italy', 
'An oval amphitheatre in the centre of Rome, built of travertine limestone, tuff, and brick-faced concrete.',
'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, despite its age.',
'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop',
'{"lat": 41.8902, "lng": 12.4922}'),

('Machu Picchu', 'Inca Civilization', 'Cusco Region, Peru',
'A 15th-century Inca citadel situated on a mountain ridge above the Sacred Valley.',
'Machu Picchu is a 15th-century Inca citadel, located in the Eastern Cordillera of southern Peru, on a 2,430-meter (7,970 ft) mountain ridge. It was built as an estate for the Inca emperor Pachacuti (1438–1472).',
'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
'{"lat": -13.1631, "lng": -72.5450}'),

('Parthenon', 'Ancient Greece', 'Athens, Greece',
'A former temple dedicated to the goddess Athena, completed in 438 BC.',
'The Parthenon is a former temple on the Athenian Acropolis, Greece, dedicated to the goddess Athena, whom the people of Athens considered their patron. Construction began in 447 BC when the Athenian Empire was at the peak of its power.',
'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=2070&auto=format&fit=crop',
'{"lat": 37.9715, "lng": 23.7267}'),

('Taj Mahal', 'Mughal Empire', 'Agra, India',
'An ivory-white marble mausoleum commissioned in 1632 by the Mughal emperor Shah Jahan.',
'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favourite wife, Mumtaz Mahal.',
'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop',
'{"lat": 27.1751, "lng": 78.0421}'),

('Angkor Wat', 'Khmer Empire', 'Siem Reap, Cambodia',
'A temple complex and the largest religious monument in the world, built in the early 12th century.',
'Angkor Wat is a temple complex in Cambodia and is the largest religious monument in the world, on a site measuring 162.6 hectares. Originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire, it was gradually transformed into a Buddhist temple.',
'https://images.unsplash.com/photo-1508159452718-d22f6734a00d?q=80&w=2070&auto=format&fit=crop',
'{"lat": 13.4125, "lng": 103.8670}'),

('Chichen Itza', 'Maya Civilization', 'Yucatán, Mexico',
'A pre-Columbian city built by the Maya people, known for its step pyramid El Castillo.',
'Chichen Itza was a large pre-Columbian city built by the Maya people of the Terminal Classic period. The archaeological site is located in Tinúm Municipality, Yucatán State, Mexico. It was a major focal point of the Northern Maya Lowlands from the Late Classic through the Terminal Classic and into the early portion of the Postclassic period.',
'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=2067&auto=format&fit=crop',
'{"lat": 20.6843, "lng": -88.5699}');
