export interface Database {
  public: {
    Tables: {
      historical_sites: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['historical_sites']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['historical_sites']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          site_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_favorites']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_favorites']['Insert']>;
      };
    };
  };
} 