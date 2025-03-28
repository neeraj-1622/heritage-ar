
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

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
