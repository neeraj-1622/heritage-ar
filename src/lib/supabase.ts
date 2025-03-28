import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
}

export type User = {
  id: string;
  username: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}
