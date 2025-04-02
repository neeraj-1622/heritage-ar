
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email?: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // Added loading property
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true, // Initialize loading
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateProfile: async () => ({ success: false }),
  resendVerificationEmail: async () => ({ success: false }),
  deleteAccount: async () => ({ success: false }),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        if (supaUser) {
          const userMetadata = await fetchUserMetadata(supaUser.id);
          setUser({
            id: supaUser.id,
            email: supaUser.email || '',
            ...userMetadata,
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    getSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          const userMetadata = await fetchUserMetadata(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            ...userMetadata,
          });
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, []);

  const fetchUserMetadata = async (userId: string): Promise<Omit<User, 'id' | 'email'> | {}> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')  // Using correct table name 'user_profiles' instead of 'profiles'
        .select('username, display_name, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user metadata:", error);
        return {};
      }

      return data || {};
    } catch (error) {
      console.error("Error fetching user metadata:", error);
      return {};
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        const userMetadata = await fetchUserMetadata(data.user.id);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          ...userMetadata,
        });
        setIsAuthenticated(true);
        toast({
          title: "Login successful",
          description: "You have successfully logged in.",
        });
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Login error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    displayName: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName || username,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        // Create a profile for the user
        const { error: profileError } = await supabase
          .from('user_profiles')  // Using correct table name 'user_profiles'
          .insert([{ 
            id: data.user.id, 
            username, 
            display_name: displayName || username,
            email: data.user.email 
          }]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast({
            title: "Profile creation failed",
            description: profileError.message,
            variant: "destructive",
          });
          return false;
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          username: username,
          display_name: displayName || username,
        });
        setIsAuthenticated(true);
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Registration error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      const userId = user?.id;
      if (!userId) {
        return { success: false, error: "User not authenticated" };
      }

      const { error } = await supabase
        .from('user_profiles')  // Using correct table name 'user_profiles'
        .update(data)
        .eq('id', userId);

      if (error) {
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      // Optimistically update the user context
      setUser((prevUser) => ({ ...prevUser!, ...data }));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Profile update error",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const resendVerificationEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Fix the resend email type - using 'signup' instead of 'email'
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast({
          title: "Failed to resend verification email",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Verification email resent",
        description: "Please check your email to verify your account.",
      });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error resending verification email",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const userId = user?.id;
      if (!userId) {
        return { success: false, error: "User not authenticated" };
      }
      
      // Delete user profile from the database
      const { error: deleteProfileError } = await supabase
        .from('user_profiles')  // Using correct table name 'user_profiles'
        .delete()
        .eq('id', userId);

      if (deleteProfileError) {
        console.error("Error deleting profile:", deleteProfileError);
        toast({
          title: "Failed to delete profile",
          description: deleteProfileError.message,
          variant: "destructive",
        });
        return { success: false, error: deleteProfileError.message };
      }

      // Delete the user authentication account
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
      
      if (deleteAuthError) {
        toast({
          title: "Failed to delete account",
          description: deleteAuthError.message,
          variant: "destructive",
        });
        return { success: false, error: deleteAuthError.message };
      }
  
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resendVerificationEmail,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
