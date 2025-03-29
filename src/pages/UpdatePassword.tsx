
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Loader2 } from 'lucide-react';

const passwordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Check if there's a hash parameter in the URL
  useEffect(() => {
    const checkRecoveryMode = async () => {
      try {
        // Extract hash and type from URL
        const fragment = window.location.hash;
        if (!fragment || !fragment.includes('type=recovery')) {
          setError('Invalid or missing recovery link parameters');
          return;
        }
      } catch (err) {
        console.error('Error checking recovery mode:', err);
        setError('An error occurred while processing the recovery link');
      }
    };

    checkRecoveryMode();
  }, []);

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update password');
        return;
      }

      setIsComplete(true);
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated',
      });

      // Redirect after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error updating password:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Update Password" showBackButton />

      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-md mx-auto mt-10">
          <Card className="bg-heritage-800 border-heritage-700">
            <CardHeader className="space-y-1">
              <div className="mx-auto bg-accent/20 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                <Key className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl text-center text-white">Update Password</CardTitle>
              <CardDescription className="text-center text-heritage-300">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-2 rounded-md mb-4">
                  {error}
                </div>
              )}

              {isComplete ? (
                <div className="bg-green-900/20 border border-green-800 text-green-200 px-4 py-2 rounded-md text-center">
                  <p>Password updated successfully!</p>
                  <p className="text-sm mt-1">Redirecting to login...</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heritage-200">New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="bg-heritage-700 border-heritage-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-heritage-200">Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="bg-heritage-700 border-heritage-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Password
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UpdatePassword;
