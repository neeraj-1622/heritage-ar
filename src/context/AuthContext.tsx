
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
  register: (username: string, email: string, password: string) => Promise<boolean>;
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
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username, display_name')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: profile?.username || session.user.email?.split('@')[0] || 'User',
            display_name: profile?.display_name || profile?.username || session.user.email?.split('@')[0] || 'User',
            email_confirmed_at: session.user.email_confirmed_at
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('username, display_name')
          .eq('id', session.user.id)
          .single();
          
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: profile?.username || session.user.email?.split('@')[0] || 'User',
          display_name: profile?.display_name || profile?.username || session.user.email?.split('@')[0] || 'User',
          email_confirmed_at: session.user.email_confirmed_at
        });
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
          // Create a new profile entry if it doesn't exist
          const username = data.user.email?.split('@')[0] || 'User';
          await supabase
            .from('user_profiles')
            .insert([{ 
              id: data.user.id, 
              username: username, 
              display_name: username,
              email: data.user.email || '',
              avatar_url: null
            }]);
            
          toast({
            title: 'Login successful',
            description: `Welcome, ${username}!`,
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

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const appUrl = window.location.origin;
      const redirectTo = `${appUrl}/login?verified=true`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            name: username,
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
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{ 
            id: data.user.id, 
            username: username,
            display_name: username,
            email,
            avatar_url: null
          }]);
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          toast({
            title: 'Registration incomplete',
            description: 'User created but profile setup failed',
            variant: 'destructive',
          });
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
