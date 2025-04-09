import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseInstance } from '@/integrations/supabase/client';

// Export the supabase instance from the integrations directory
export const supabase = supabaseInstance;

// Test database connection and verify tables
export async function verifyDatabaseSetup() {
  try {
    // Test historical_sites table
    const { data: sites, error: sitesError } = await supabaseInstance
      .from('historical_sites')
      .select('*')
      .limit(1);

    if (sitesError) {
      console.error('Error accessing historical_sites:', sitesError);
      return false;
    }

    // Test user_profiles table
    const { data: profiles, error: profilesError } = await supabaseInstance
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('Error accessing user_profiles:', profilesError);
      return false;
    }

    // Test user_favorites table
    const { data: favorites, error: favoritesError } = await supabaseInstance
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

// Create or update user profile
export async function createOrUpdateUserProfile(userId: string, username: string, email: string, avatarUrl: string | null = null) {
  try {
    const { data: existingProfile, error: queryError } = await supabaseInstance
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error checking for existing profile:', queryError);
      return { data: null, error: queryError };
    }

    // If profile exists, update it
    if (existingProfile) {
      const { data, error } = await supabaseInstance
        .from('user_profiles')
        .update({
          username,
          email,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error updating user profile:', error);
      }
      return { data, error };
    }
    // If profile doesn't exist, create it
    else {
      const { data, error } = await supabaseInstance
        .from('user_profiles')
        .insert([
          {
            id: userId,
            username,
            email,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error creating user profile:', error);
      }
      return { data, error };
    }
  } catch (error) {
    console.error('Error in createOrUpdateUserProfile:', error);
    return { data: null, error };
  }
}

// Add site to favorites
export async function addToFavorites(userId: string, siteId: string) {
  try {
    // First check if it already exists
    const { data: existing } = await supabaseInstance
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('site_id', siteId)
      .single();

    if (existing) {
      return { data: existing, error: null }; // Already favorited
    }

    const { data, error } = await supabaseInstance
      .from('user_favorites')
      .insert([
        {
          user_id: userId,
          site_id: siteId,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    return { data, error };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return { data: null, error };
  }
}

// Remove from favorites
export async function removeFromFavorites(userId: string, siteId: string) {
  try {
    const { data, error } = await supabaseInstance
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('site_id', siteId)
      .select();

    return { data, error };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { data: null, error };
  }
}

// Check if a site is favorited by the user
export async function isSiteFavorited(userId: string, siteId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseInstance
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('site_id', siteId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error checking favorite status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isSiteFavorited:', error);
    return false;
  }
}

// Get user's favorite sites
export async function getUserFavorites(userId: string) {
  try {
    const { data, error } = await supabaseInstance
      .from('user_favorites')
      .select(`
        id,
        created_at,
        historical_sites (
          id, 
          name, 
          period, 
          location, 
          short_description, 
          image_url
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting user favorites:', error);
      return { data: null, error };
    }

    return { 
      data: data.map(item => ({
        id: item.id,
        created_at: item.created_at,
        site: item.historical_sites
      })), 
      error: null 
    };
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    return { data: null, error };
  }
}

export type HistoricalSite = {
  id: string;
  name: string;
  period: string;
  location: string;
  short_description: string;
  long_description: string | null;
  mythology: string | null;
  cultural_aspects: string | null;
  image_url: string;
  ar_model_url: string | null;
  coordinates: { lat: number; lng: number } | null;
  ar_enabled: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

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
