-- Create tables for the HeritageAR application

-- Historical Sites Table
CREATE TABLE historical_sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT NOT NULL,
  ar_model_url TEXT,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Profile Table (extends Auth users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Favorites Table
CREATE TABLE user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES historical_sites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);

-- Row Level Security Policies

-- Historical Sites (public read, admin write)
ALTER TABLE historical_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Historical sites are viewable by everyone" 
  ON historical_sites FOR SELECT USING (true);

CREATE POLICY "Historical sites are editable by admins" 
  ON historical_sites FOR INSERT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Historical sites are updatable by admins" 
  ON historical_sites FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Users (users can only read/edit their own data)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Favorites (users can only access their own favorites)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" 
  ON user_favorites FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
  ON user_favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON user_favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- Default sites insertion
INSERT INTO historical_sites (name, period, location, short_description, image_url) VALUES
('The Colosseum', 'Ancient Rome', 'Rome, Italy', 'An oval amphitheatre in the centre of Rome, built of travertine limestone, tuff, and brick-faced concrete.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop'),
('Machu Picchu', 'Inca Civilization', 'Cusco Region, Peru', 'A 15th-century Inca citadel situated on a mountain ridge above the Sacred Valley.', 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop'),
('Parthenon', 'Ancient Greece', 'Athens, Greece', 'A former temple dedicated to the goddess Athena, completed in 438 BC.', 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=2070&auto=format&fit=crop'),
('Taj Mahal', 'Mughal Empire', 'Agra, India', 'An ivory-white marble mausoleum commissioned in 1632 by the Mughal emperor Shah Jahan.', 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop'),
('Angkor Wat', 'Khmer Empire', 'Siem Reap, Cambodia', 'A temple complex and the largest religious monument in the world, built in the early 12th century.', 'https://images.unsplash.com/photo-1508159452718-d22f6734a00d?q=80&w=2070&auto=format&fit=crop'),
('Chichen Itza', 'Maya Civilization', 'Yucatán, Mexico', 'A pre-Columbian city built by the Maya people, known for its step pyramid El Castillo.', 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=2067&auto=format&fit=crop');

-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable Row Level Security (RLS) for users table
alter table public.users enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can read their own data" on public.users
  for select using (auth.uid() = id);

-- Create policy to allow users to update their own data
create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Create sites table
create table public.sites (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  location text,
  image_url text,
  created_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for sites table
alter table public.sites enable row level security;

-- Create policy to allow public read access to sites
create policy "Allow public read access" on public.sites
  for select using (true);

-- Create policy to allow authenticated users to create sites
create policy "Allow authenticated create access" on public.sites
  for insert with check (auth.role() = 'authenticated');

-- Create policy to allow site owners to update their sites
create policy "Allow owners to update sites" on public.sites
  for update using (auth.uid() = created_by);

-- Create policy to allow site owners to delete their sites
create policy "Allow owners to delete sites" on public.sites
  for delete using (auth.uid() = created_by);

-- Create function to automatically set updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger set_updated_at
  before update on public.sites
  for each row
  execute function public.handle_updated_at();
