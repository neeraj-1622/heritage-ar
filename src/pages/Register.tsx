import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Header from '@/components/Header';
import { Mail } from 'lucide-react';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const success = await register(data.username, data.email, data.password, data.displayName);
    if (success) {
      setRegistrationSuccess(true);
      setRegisteredEmail(data.email);
      form.reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Register" showBackButton />
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg glass-panel">
          <h1 className="text-2xl font-bold text-white mb-6">Create an Account</h1>
          
          {registrationSuccess && (
            <Alert className="mb-6 bg-green-900/50 text-green-100 border-green-700">
              <Mail className="h-4 w-4" />
              <AlertTitle>Registration Successful!</AlertTitle>
              <AlertDescription>
                A verification link has been sent to {registeredEmail}.
                Please check your email and click the link to verify your account before logging in.
              </AlertDescription>
            </Alert>
          )}
          
          {!registrationSuccess && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} className="bg-heritage-800/70 text-white border-heritage-700 placeholder:text-heritage-400" />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="How you'll be seen by others" {...field} className="bg-heritage-800/70 text-white border-heritage-700 placeholder:text-heritage-400" />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} className="bg-heritage-800/70 text-white border-heritage-700 placeholder:text-heritage-400" />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="bg-heritage-800/70 text-white border-heritage-700 placeholder:text-heritage-400" />
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
                      <FormLabel className="text-white">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="bg-heritage-800/70 text-white border-heritage-700 placeholder:text-heritage-400" />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent-600 text-white" 
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Register'}
                </Button>
              </form>
            </Form>
          )}
          
          <div className="mt-6 text-center text-sm text-white">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
