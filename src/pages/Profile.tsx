import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { UserCircle, Mail, Key, AtSign, Check, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserProfile, createOrUpdateUserProfile } from '@/lib/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Form schemas
const profileFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  avatarUrl: z.string().nullable().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const emailFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required to change email'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type EmailFormValues = z.infer<typeof emailFormSchema>;

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || '',
      avatarUrl: null,
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('display_name, username')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setDisplayName(data.display_name || data.username);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Failed to load profile',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsUpdatingProfile(true);
      const result = await createOrUpdateUserProfile(
        user.id,
        data.username,
        user.email,
        data.avatarUrl
      );
      
      if (result.error) {
        toast({
          title: 'Update failed',
          description: result.error.message || 'Failed to update profile',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
      
      // Update the local user context
      // This is a simplified approach - in a full implementation,
      // you might want to refresh the user context more completely
      if (result.data && result.data[0]) {
        // Assuming the user context has a way to update these values
        // This would require extending the AuthContext functionality
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordReset = async () => {
    try {
      if (!user?.email) {
        toast({
          title: 'Error',
          description: 'No email address available for password reset',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast({
          title: 'Reset failed',
          description: error.message || 'Failed to send password reset email',
          variant: 'destructive',
        });
        return;
      }

      setResetPasswordSent(true);
      toast({
        title: 'Reset email sent',
        description: 'Check your email for a password reset link',
      });
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast({
        title: 'Reset failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const onEmailChange = async (data: EmailFormValues) => {
    try {
      if (data.email === user?.email) {
        toast({
          title: 'No change',
          description: 'The email address is the same as your current one',
          variant: 'destructive',
        });
        return;
      }

      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.password,
      });

      if (signInError) {
        toast({
          title: 'Authentication failed',
          description: 'Your current password is incorrect',
          variant: 'destructive',
        });
        return;
      }

      // Then update email
      const { error } = await supabase.auth.updateUser({
        email: data.email,
      });

      if (error) {
        toast({
          title: 'Update failed',
          description: error.message || 'Failed to update email address',
          variant: 'destructive',
        });
        return;
      }

      setResetEmailSent(true);
      toast({
        title: 'Verification email sent',
        description: 'Check your new email address for a verification link',
      });
    } catch (error) {
      console.error('Error changing email:', error);
      toast({
        title: 'Update failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!user?.id || !displayName.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          display_name: displayName.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on the username
  const getAvatarColor = (username: string) => {
    const colors = [
      'bg-purple-800', 'bg-indigo-800', 'bg-blue-800', 
      'bg-teal-800', 'bg-green-800', 'bg-amber-800', 
      'bg-red-800', 'bg-pink-800'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = ((hash << 5) - hash) + username.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header title="Profile" showBackButton />
      
      <main className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gradient-to-r from-accent to-accent-400 flex items-center justify-center">
              <Avatar className="h-8 w-8 text-white" fallback={<AvatarFallback className={`${getAvatarColor(displayName)} text-white text-xl font-medium`}>{getInitials(displayName)}</AvatarFallback>} />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-heritage-300">Manage your account settings and preferences</p>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-heritage-800 border border-heritage-700">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="bg-heritage-800 border-heritage-700">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-heritage-300">
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-heritage-200">Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your username"
                                className="bg-heritage-700 border-heritage-600 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-heritage-400">
                              This is your public display name
                            </FormDescription>
                            <FormMessage className="text-red-300" />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2">
                        <FormItem>
                          <FormLabel className="text-heritage-200">Email</FormLabel>
                          <Input
                            value={user.email}
                            disabled
                            className="bg-heritage-700 border-heritage-600 text-white opacity-70"
                          />
                          <FormDescription className="text-heritage-400">
                            To change your email, go to the Security tab
                          </FormDescription>
                        </FormItem>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="mt-4" 
                        disabled={isUpdatingProfile || !profileForm.formState.isDirty}
                      >
                        {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-6">
                {/* Password Reset Card */}
                <Card className="bg-heritage-800 border-heritage-700">
                  <CardHeader>
                    <CardTitle className="text-white">Password Reset</CardTitle>
                    <CardDescription className="text-heritage-300">
                      Change your password securely
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resetPasswordSent ? (
                      <Alert className="bg-green-900/50 text-green-100 border-green-700">
                        <Check className="h-4 w-4" />
                        <AlertTitle>Reset Email Sent!</AlertTitle>
                        <AlertDescription>
                          We've sent a password reset link to your email address.
                          Please check your inbox and follow the instructions to reset your password.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-heritage-300">
                          For security reasons, we'll send a password reset link to your registered email address.
                        </p>
                        <Button onClick={onPasswordReset}>
                          Send Password Reset Link
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Email Change Card */}
                <Card className="bg-heritage-800 border-heritage-700">
                  <CardHeader>
                    <CardTitle className="text-white">Change Email</CardTitle>
                    <CardDescription className="text-heritage-300">
                      Update your email address
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resetEmailSent ? (
                      <Alert className="bg-green-900/50 text-green-100 border-green-700">
                        <Check className="h-4 w-4" />
                        <AlertTitle>Verification Email Sent!</AlertTitle>
                        <AlertDescription>
                          We've sent a verification link to your new email address.
                          Please check your inbox and follow the instructions to confirm your new email.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(onEmailChange)} className="space-y-4">
                          <FormField
                            control={emailForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-heritage-200">New Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="your.new.email@example.com"
                                    className="bg-heritage-700 border-heritage-600 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-300" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={emailForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-heritage-200">Current Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-heritage-700 border-heritage-600 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-heritage-400">
                                  For security, please enter your current password
                                </FormDescription>
                                <FormMessage className="text-red-300" />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit">
                            Change Email
                          </Button>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
