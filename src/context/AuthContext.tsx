import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: {
    id: string | undefined;
    email: string | undefined;
    username: string | undefined;
    display_name: string | undefined;
  } | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  authLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{
    id: string | undefined;
    email: string | undefined;
    username: string | undefined;
    display_name: string | undefined;
  } | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Function to get or create user profile
  const ensureUserProfile = async (userId: string, userData: any) => {
    try {
      // First try to get the profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // If profile doesn't exist, create it
      if (error && error.code === 'PGRST116') { // No rows returned
        const username = userData.user_metadata?.username || 
                        userData.user_metadata?.name || 
                        userData.email?.split('@')[0] || 
                        'User';
                        
        const displayName = userData.user_metadata?.display_name || 
                           userData.user_metadata?.name || 
                           userData.email?.split('@')[0] || 
                           'User';
        
        console.log('Creating user profile for:', userId);
        
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([{
            id: userId,
            username,
            display_name: displayName,
            email: userData.email || '',
          }]);
          
        if (insertError) {
          console.error('Error creating profile in AuthContext:', insertError);
        }
      } else if (error) {
        console.error('Error fetching profile in AuthContext:', error);
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
    }
  };

  // Initialize auth state from session
  useEffect(() => {
    const initializeAuth = async () => {
      setAuthLoading(true);
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setSession(session);
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || session.user.user_metadata?.name || session.user.email?.split('@')[0],
            display_name: session.user.user_metadata?.display_name || session.user.user_metadata?.name,
          });
          setIsAuthenticated(true);
          
          // Ensure user profile exists
          await ensureUserProfile(session.user.id, session.user);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setAuthLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Subscribe to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || session.user.user_metadata?.name || session.user.email?.split('@')[0],
            display_name: session.user.user_metadata?.display_name || session.user.user_metadata?.name,
          });
          setIsAuthenticated(true);
          
          // Ensure user profile exists
          setTimeout(() => {
            ensureUserProfile(session.user.id, session.user);
          }, 0);
        } else if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    loading,
    authLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
