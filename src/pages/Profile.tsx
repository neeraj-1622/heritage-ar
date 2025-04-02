
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
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
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserCircle } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

const profileSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  display_name: z.string().min(2, { message: 'Display name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarColor, setAvatarColor] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      display_name: '',
      email: '',
    },
  });

  // Function to generate avatar color based on username
  const getAvatarColor = (username: string) => {
    const blueColors = [
      'bg-blue-800', 'bg-blue-700', 'bg-indigo-800', 
      'bg-indigo-700', 'bg-blue-900'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = ((hash << 5) - hash) + username.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % blueColors.length;
    return blueColors[index];
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        
        // If we haven't hit max retries, try to create profile
        if (retryCount < 3) {
          await createUserProfile();
          setRetryCount(retryCount + 1);
          return;
        }
        
        toast({
          title: 'Error loading profile',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        form.reset({
          username: data.username || '',
          display_name: data.display_name || '',
          email: data.email || '',
        });
        
        if (!avatarColor) {
          setAvatarColor(getAvatarColor(data.display_name || data.username || 'User'));
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Create user profile if it doesn't exist
  const createUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert([{
          id: user.id,
          username: user.username || user.email?.split('@')[0] || 'User',
          display_name: user.display_name || user.username || user.email?.split('@')[0] || 'User',
          email: user.email || '',
        }]);
        
      if (error && error.code !== '23505') { // Not a duplicate key error
        console.error('Error creating profile:', error);
        toast({
          title: 'Error creating profile',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user?.id]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          username: values.username,
          display_name: values.display_name,
          // Not updating email as it's now read-only
        })
        .eq('id', user?.id);

      if (error) {
        toast({
          title: 'Error saving profile',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user?.id) return;

      // First delete user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) {
        console.error('Error deleting profile:', profileError);
        toast({
          title: 'Error deleting profile',
          description: profileError.message,
          variant: 'destructive',
        });
        return;
      }

      // Then delete user authentication data
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        console.error('Error deleting account:', authError);
        toast({
          title: 'Error deleting account',
          description: authError.message,
          variant: 'destructive',
        });
        return;
      }

      // Logout and redirect to homepage
      await logout();
      toast({ title: 'Account deleted', description: 'Your account has been deleted successfully' });
      navigate('/');
      
    } catch (error) {
      console.error('Error in handleDeleteAccount:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      });
    }
  };

  // Calculate avatar initials from display name
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-heritage-900 to-heritage-800 animate-fade-in scrollbar-none">
      <Header title="Profile" showBackButton hideArView={true} />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className={`h-24 w-24 rounded-full flex items-center justify-center text-xl font-medium text-white ${avatarColor || 'bg-blue-800'}`}>
              {loading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                getInitials(form.watch('display_name') || 'User')
              )}
            </div>
            <h1 className="text-2xl font-bold mt-4 text-heritage-100">
              {loading ? 'Loading...' : form.watch('display_name') || 'User Profile'}
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-heritage-600" />
            </div>
          ) : (
            <Card className="border border-white/10 backdrop-blur-xl bg-white/5">
              <CardHeader>
                <CardTitle className="text-heritage-100">Edit Profile</CardTitle>
                <CardDescription className="text-heritage-300">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heritage-200">Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} className="bg-white/10 border-white/20 text-heritage-100" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="display_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heritage-200">Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Display Name" {...field} className="bg-white/10 border-white/20 text-heritage-100" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heritage-200">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="email@example.com" 
                              {...field} 
                              readOnly 
                              className="bg-white/10 border-white/20 text-heritage-100 opacity-75 cursor-not-allowed" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={saving}
                        className="bg-accent hover:bg-accent/90"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-white/10 pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="border-white/20 text-heritage-200 hover:bg-white/10"
                >
                  Cancel
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount}>
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
