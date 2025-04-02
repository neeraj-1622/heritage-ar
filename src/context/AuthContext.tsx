
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  email_confirmed_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, displayName?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  resendVerificationEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to ensure user profile exists
  const ensureUserProfileExists = async (userId: string, sessionData: any) => {
    try {
      // First check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // If profile exists, no need to create it
      if (existingProfile && !checkError) {
        console.log("User profile already exists for ID:", userId);
        return existingProfile;
      }
      
      // Extract data for profile creation
      const displayName = sessionData.user_metadata?.display_name || 
                          sessionData.user_metadata?.name || 
                          sessionData.email?.split('@')[0] || 
                          'User';
      const username = sessionData.user_metadata?.name || 
                      sessionData.email?.split('@')[0] || 
                      'User';
      const email = sessionData.email || '';
      
      console.log("Creating user profile for ID:", userId, {
        username,
        display_name: displayName,
        email
      });
      
      // Create profile
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert([{ 
          id: userId, 
          username, 
          display_name: displayName,
          email,
          avatar_url: null
        }])
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating user profile:', createError);
        throw createError;
      }
      
      console.log("User profile created successfully:", newProfile);
      return newProfile;
    } catch (error) {
      console.error('Profile creation/verification error:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (session && session.user) {
          try {
            // First try to get the user profile
            const { data: profile, error } = await supabase
              .from('user_profiles')
              .select('username, display_name, email')
              .eq('id', session.user.id)
              .single();
              
            if (!error && profile) {
              setUser({
                id: session.user.id,
                email: profile.email || session.user.email || '',
                username: profile.username || session.user.email?.split('@')[0] || 'User',
                display_name: profile.display_name || profile.username || session.user.email?.split('@')[0] || 'User',
                email_confirmed_at: session.user.email_confirmed_at
              });
            } else {
              // If getting the profile fails, try to create it
              console.log("Profile not found in auth state change, creating...");
              
              // Use setTimeout to avoid blocking the auth state change
              setTimeout(async () => {
                try {
                  const newProfile = await ensureUserProfileExists(session.user.id, session.user);
                  
                  if (newProfile) {
                    setUser({
                      id: session.user.id,
                      email: newProfile.email || session.user.email || '',
                      username: newProfile.username || session.user.email?.split('@')[0] || 'User',
                      display_name: newProfile.display_name || newProfile.username || session.user.email?.split('@')[0] || 'User',
                      email_confirmed_at: session.user.email_confirmed_at
                    });
                  } else {
                    // Fallback to user data from session if profile creation fails
                    const displayName = session.user.user_metadata?.display_name || 
                                      session.user.user_metadata?.name || 
                                      session.user.email?.split('@')[0] || 
                                      'User';
                    const username = session.user.user_metadata?.name || 
                                    session.user.email?.split('@')[0] || 
                                    'User';
                    
                    setUser({
                      id: session.user.id,
                      email: session.user.email || '',
                      username: username,
                      display_name: displayName,
                      email_confirmed_at: session.user.email_confirmed_at
                    });
                  }
                } catch (error) {
                  console.error("Failed to create profile in timeout:", error);
                }
              }, 0);
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            
            // Fallback to basic user data from session
            const displayName = session.user.user_metadata?.display_name || 
                               session.user.user_metadata?.name || 
                               session.user.email?.split('@')[0] || 
                               'User';
            const username = session.user.user_metadata?.name || 
                            session.user.email?.split('@')[0] || 
                            'User';
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              username: username,
              display_name: displayName,
              email_confirmed_at: session.user.email_confirmed_at
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        try {
          // First check if the user profile exists
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('username, display_name, email')
            .eq('id', session.user.id)
            .single();
            
          if (!error && profile) {
            setUser({
              id: session.user.id,
              email: profile.email || session.user.email || '',
              username: profile.username || session.user.email?.split('@')[0] || 'User',
              display_name: profile.display_name || profile.username || session.user.email?.split('@')[0] || 'User',
              email_confirmed_at: session.user.email_confirmed_at
            });
          } else {
            // If profile doesn't exist or error fetching it, try to create it
            console.log("Profile not found in initial check, creating...");
            const newProfile = await ensureUserProfileExists(session.user.id, session.user);
            
            if (newProfile) {
              setUser({
                id: session.user.id,
                email: newProfile.email || session.user.email || '',
                username: newProfile.username || session.user.email?.split('@')[0] || 'User',
                display_name: newProfile.display_name || newProfile.username || session.user.email?.split('@')[0] || 'User',
                email_confirmed_at: session.user.email_confirmed_at
              });
            } else {
              // Fallback to user data from session if profile creation fails
              const displayName = session.user.user_metadata?.display_name || 
                                 session.user.user_metadata?.name || 
                                 session.user.email?.split('@')[0] || 
                                 'User';
              const username = session.user.user_metadata?.name || 
                              session.user.email?.split('@')[0] || 
                              'User';
              
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                username: username,
                display_name: displayName,
                email_confirmed_at: session.user.email_confirmed_at
              });
            }
          }
        } catch (error) {
          console.error('Error in initial user check:', error);
          
          // Fallback to basic user data
          const displayName = session.user.user_metadata?.display_name || 
                             session.user.user_metadata?.name || 
                             session.user.email?.split('@')[0] || 
                             'User';
          const username = session.user.user_metadata?.name || 
                          session.user.email?.split('@')[0] || 
                          'User';
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: username,
            display_name: displayName,
            email_confirmed_at: session.user.email_confirmed_at
          });
        }
      }
      setLoading(false);
    };

    checkUser();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message || 'Invalid credentials',
          variant: 'destructive',
        });
        return false;
      }
      
      if (data.user) {
        if (!data.user.email_confirmed_at) {
          toast({
            title: 'Email not verified',
            description: 'Please verify your email before logging in',
            variant: 'destructive',
          });
          
          await supabase.auth.signOut();
          return false;
        }
        
        try {
          // Check for existing profile
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('username, display_name')
            .eq('id', data.user.id)
            .single();
          
          if (profileError || !profile) {
            // Create profile if it doesn't exist
            const username = data.user.email?.split('@')[0] || 'User';
            const displayName = data.user.user_metadata?.display_name || username;

            await ensureUserProfileExists(data.user.id, data.user);
            
            toast({
              title: 'Login successful',
              description: `Welcome, ${displayName}!`,
            });
          } else {
            const displayName = profile.display_name || profile.username;
            toast({
              title: 'Login successful',
              description: `Welcome back, ${displayName}!`,
            });
          }
        } catch (profileError) {
          console.error('Error handling profile during login:', profileError);
          const username = data.user.email?.split('@')[0] || 'User';
          toast({
            title: 'Login successful',
            description: `Welcome, ${username}!`,
          });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, displayName?: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const appUrl = window.location.origin;
      const redirectTo = `${appUrl}/login?verified=true`;
      
      const finalDisplayName = displayName || username;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            name: username,
            display_name: finalDisplayName,
          }
        }
      });
      
      if (error) {
        toast({
          title: 'Registration failed',
          description: error.message || 'Could not create account',
          variant: 'destructive',
        });
        return false;
      }
      
      if (data.user) {
        console.log('Creating user profile during registration:', {
          id: data.user.id,
          username,
          display_name: finalDisplayName,
          email
        });
        
        // Create user profile immediately upon registration
        try {
          // Direct insert approach - the trigger should handle this, but we do it explicitly as well
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{ 
              id: data.user.id, 
              username: username,
              display_name: finalDisplayName,
              email,
              avatar_url: null
            }]);
            
          if (profileError) {
            console.error('Error creating user profile during registration:', profileError);
            console.log('Will rely on database trigger to create profile');
          } else {
            console.log('User profile created successfully during registration');
          }
        } catch (profileError) {
          console.error('Exception creating profile during registration:', profileError);
          // Fall back to the database trigger
        }
        
        toast({
          title: 'Registration successful',
          description: 'Please check your email to verify your account. You must verify your email before logging in.',
          duration: 6000,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const appUrl = window.location.origin;
      const redirectTo = `${appUrl}/login?verified=true`;
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectTo,
        }
      });
      
      if (error) {
        toast({
          title: 'Failed to resend verification email',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox',
      });
      return true;
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        title: 'Failed to resend verification email',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  const isEmailVerified = user?.email_confirmed_at !== null && user?.email_confirmed_at !== undefined;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isEmailVerified,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
