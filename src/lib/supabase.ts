import { createClient } from '@supabase/supabase-js';

// For Vite, we use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test database connection and verify tables
export async function verifyDatabaseSetup() {
  try {
    // Test historical_sites table
    const { data: sites, error: sitesError } = await supabase
      .from('historical_sites')
      .select('*')
      .limit(1);

    if (sitesError) {
      console.error('Error accessing historical_sites:', sitesError);
      return false;
    }

    // Test user_profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('Error accessing user_profiles:', profilesError);
      return false;
    }

    // Test user_favorites table
    const { data: favorites, error: favoritesError } = await supabase
      .from('user_favorites')
      .select('*')
      .limit(1);

    if (favoritesError) {
      console.error('Error accessing user_favorites:', favoritesError);
      return false;
    }

    console.log('Database setup verified successfully!');
    return true;
  } catch (error) {
    console.error('Error verifying database setup:', error);
    return false;
  }
}

export type HistoricalSite = {
  id: string;
  name: string;
  period: string;
  location: string;
  short_description: string;
  long_description?: string;
  image_url: string;
  ar_model_url?: string;
  coordinates?: { lat: number; lng: number };
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export type HistoricalSiteInput = Omit<HistoricalSite, 'id' | 'created_at' | 'updated_at' | 'created_by'>;

export type User = {
  id: string;
  username: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  site_id: string;
  created_at: string;
}
