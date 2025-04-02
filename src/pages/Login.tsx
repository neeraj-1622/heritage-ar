import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Mail, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, loading, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [emailForResend, setEmailForResend] = useState<string>('');
  const [showVerificationAlert, setShowVerificationAlert] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is coming from email verification
    const searchParams = new URLSearchParams(location.search);
    const verified = searchParams.get('verified');
    
    if (verified === 'true') {
      setVerificationSuccess(true);
      toast({
        title: 'Email verified',
        description: 'Your email has been successfully verified. You can now log in.',
      });
    }
  }, [location.search]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setEmailForResend(data.email);
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/');
    } else {
      // If login fails, it might be due to email verification
      setShowVerificationAlert(true);
    }
  };

  const handleResendVerification = async () => {
    if (emailForResend) {
      await resendVerificationEmail(emailForResend);
    } else {
      toast({
        title: 'Email required',
        description: 'Please enter your email in the form above first',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Login" showBackButton />
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg glass-panel">
          <h1 className="text-2xl font-bold text-white mb-6">Login to HeritageAR</h1>
          
          {verificationSuccess && (
            <Alert className="mb-6 bg-green-900/50 text-green-100 border-green-700">
              <Mail className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your email has been verified. You can now log in.
              </AlertDescription>
            </Alert>
          )}
          
          {showVerificationAlert && (
            <Alert className="mb-6 bg-amber-900/50 text-amber-100 border-amber-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email verification required</AlertTitle>
              <AlertDescription>
                Please verify your email before logging in. 
                <Button 
                  variant="link" 
                  className="text-amber-200 p-0 h-auto font-semibold"
                  onClick={handleResendVerification}
                >
                  Resend verification email
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your.email@example.com" 
                        {...field} 
                        className="bg-heritage-800/70 text-white border-heritage-700 placeholder:text-heritage-400" 
                        onChange={(e) => {
                          field.onChange(e);
                          setEmailForResend(e.target.value);
                        }}
                      />
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
              
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent-600 text-white" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm text-white">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent font-medium hover:underline">
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
