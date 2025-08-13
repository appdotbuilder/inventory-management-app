import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// Note the correct path for importing from server
import type { LoginInput, LoginResponse } from '../../../server/src/schema';

interface LoginFormProps {
  onLogin: (credentials: LoginInput) => Promise<LoginResponse>;
  isLoading?: boolean;
}

export function LoginForm({ onLogin, isLoading = false }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await onLogin(formData);
      
      if (!response.success) {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
      // Success case is handled by parent component
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: LoginInput) => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';
  const isFormLoading = isLoading || isSubmitting;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                disabled={isFormLoading}
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                disabled={isFormLoading}
                className="pl-10 pr-10"
                required
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isFormLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Demo credentials info since backend is stubbed */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> Since the backend authentication is not yet implemented, 
              you can use any email format and password to see the login flow.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isFormValid || isFormLoading}
          >
            {isFormLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}