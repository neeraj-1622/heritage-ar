
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (session && session.user) {
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
            // If profile doesn't exist yet, create it
            const displayName = session.user.user_metadata?.display_name || 
                               session.user.user_metadata?.name || 
                               session.user.email?.split('@')[0] || 
                               'User';
            const username = session.user.user_metadata?.name || 
                            session.user.email?.split('@')[0] || 
                            'User';
            const email = session.user.email || '';
            
            console.log('Creating user profile during auth state change:', {
              id: session.user.id,
              username,
              display_name: displayName,
              email
            });
            
            // Create profile if it doesn't exist
            const { error: insertError } = await supabase
              .from('user_profiles')
              .insert([{ 
                id: session.user.id, 
                username, 
                display_name: displayName,
                email,
                avatar_url: null
              }]);
              
            if (insertError) {
              console.error('Error creating user profile in auth state change:', insertError);
            }
            
            setUser({
              id: session.user.id,
              email: email,
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
          // If profile doesn't exist, create it
          const displayName = session.user.user_metadata?.display_name || 
                             session.user.user_metadata?.name || 
                             session.user.email?.split('@')[0] || 
                             'User';
          const username = session.user.user_metadata?.name || 
                          session.user.email?.split('@')[0] || 
                          'User';
          const email = session.user.email || '';
          
          console.log('Creating user profile during initial check:', {
            id: session.user.id,
            username,
            display_name: displayName,
            email
          });
          
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert([{ 
              id: session.user.id, 
              username, 
              display_name: displayName,
              email,
              avatar_url: null
            }]);
            
          if (insertError) {
            console.error('Error creating user profile in initial check:', insertError);
          }
          
          setUser({
            id: session.user.id,
            email: email,
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
        
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('username, display_name')
          .eq('id', data.user.id)
          .single();
        
        if (!profile) {
          const username = data.user.email?.split('@')[0] || 'User';
          const displayName = data.user.user_metadata?.display_name || username;

          // Create profile if it doesn't exist
          await supabase
            .from('user_profiles')
            .insert([{ 
              id: data.user.id, 
              username: username, 
              display_name: displayName,
              email: data.user.email || '',
              avatar_url: null
            }]);
            
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
        
        // Create user profile immediately upon registration with explicit RLS bypass
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
          toast({
            title: 'Registration incomplete',
            description: 'User created but profile setup failed. Please contact support.',
            variant: 'destructive',
          });
        } else {
          console.log('User profile created successfully during registration');
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
