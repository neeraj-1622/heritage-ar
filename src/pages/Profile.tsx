
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle, Mail, ChevronLeft, Loader2, LogOut, Settings, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Form schemas
const profileFormSchema = z.object({
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Define the form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
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
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('display_name, username, email')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUsername(data?.username || '');
        setEmail(data?.email || user.email || '');
        setDisplayName(data?.display_name || data?.username || '');
        
        profileForm.setValue('displayName', data?.display_name || data?.username || '');
        emailForm.setValue('email', data?.email || user.email || '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Failed to load profile',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id, user?.email, profileForm, emailForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsUpdatingProfile(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          display_name: data.displayName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: 'Update failed',
          description: error.message || 'Failed to update profile',
          variant: 'destructive',
        });
        return;
      }
      
      setDisplayName(data.displayName);
      
      toast({
        title: 'Profile updated',
        description: 'Your display name has been successfully updated',
      });
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

      // Update profile table as well
      await supabase
        .from('user_profiles')
        .update({ 
          email: data.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-heritage-300 border-t-heritage-800 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800/90">
      <header className="fixed w-full top-0 left-0 z-50 py-4 bg-slate-900/90 backdrop-blur-lg">
        <div className="container mx-auto px-4 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-3 p-2 rounded-full text-white hover:text-accent hover:bg-slate-800/50 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          
          <div className="ml-auto">
            <Link 
              to="/ar" 
              className="px-4 py-1.5 rounded-full bg-accent text-sm font-medium text-white"
            >
              AR View
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8 mt-4">
            <div className="mr-5">
              <Avatar className="h-20 w-20 border-2 border-accent/30">
                <AvatarFallback className={`${getAvatarColor(displayName)} text-white text-2xl font-medium`}>
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-slate-300">Manage your account settings and preferences</p>
            </div>
            
            <div className="ml-auto mr-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-9 w-9 p-0 overflow-hidden border border-slate-600">
                    <Avatar className="h-8 w-8 border border-accent/30">
                      <AvatarFallback className={`${getAvatarColor(displayName)} text-white font-medium`}>
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-blue-800/90 backdrop-blur-sm border-blue-700 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-blue-300/90">{email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-blue-700/50" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-blue-700 cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white hover:bg-blue-700 cursor-pointer"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-blue-700/50" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-blue-700 cursor-pointer"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-slate-300">
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-200 mb-1.5">Username</h3>
                        <Input
                          value={username}
                          disabled
                          className="bg-slate-700/70 border-slate-600 text-white opacity-70"
                        />
                        <p className="text-xs text-slate-400 mt-1">This is your unique username and cannot be changed</p>
                      </div>
                      
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                          <FormField
                            control={profileForm.control}
                            name="displayName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-200">Display Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your display name"
                                    className="bg-slate-700/70 border-slate-600 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-slate-400">
                                  This is your public display name visible throughout the app
                                </FormDescription>
                                <FormMessage className="text-red-300" />
                              </FormItem>
                            )}
                          />
                          
                          <div>
                            <h3 className="text-sm font-medium text-slate-200 mb-1.5">Email</h3>
                            <Input
                              value={email}
                              disabled
                              className="bg-slate-700/70 border-slate-600 text-white opacity-70"
                            />
                            <p className="text-xs text-slate-400 mt-1">To change your email, go to the Security tab</p>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-6">
                {/* Password Reset Card */}
                <Card className="bg-slate-800/80 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Password Reset</CardTitle>
                    <CardDescription className="text-slate-300">
                      Change your password securely
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resetPasswordSent ? (
                      <Alert className="bg-green-900/50 text-green-100 border-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Reset Email Sent!</AlertTitle>
                        <AlertDescription>
                          We've sent a password reset link to your email address.
                          Please check your inbox and follow the instructions to reset your password.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-slate-300">
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
                <Card className="bg-slate-800/80 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Change Email</CardTitle>
                    <CardDescription className="text-slate-300">
                      Update your email address
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resetEmailSent ? (
                      <Alert className="bg-green-900/50 text-green-100 border-green-700">
                        <CheckCircle className="h-4 w-4" />
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
                                <FormLabel className="text-slate-200">New Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="your.new.email@example.com"
                                    className="bg-slate-700/70 border-slate-600 text-white"
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
                                <FormLabel className="text-slate-200">Current Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-slate-700/70 border-slate-600 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-slate-400">
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
