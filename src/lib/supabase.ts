
import { createClient } from '@supabase/supabase-js';

// For Vite, we use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
