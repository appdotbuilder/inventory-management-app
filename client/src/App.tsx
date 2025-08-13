import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Using type-only imports for better TypeScript compliance
import type { User, LoginInput, LoginResponse } from '../../server/src/schema';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(
    localStorage.getItem('sessionToken')
  );

  // Check for existing session on app load
  const checkSession = useCallback(async () => {
    if (!sessionToken) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await trpc.getCurrentUser.query({ sessionToken });
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Invalid session, clear it
        localStorage.removeItem('sessionToken');
        setSessionToken(null);
      }
    } catch (error) {
      console.error('Failed to verify session:', error);
      localStorage.removeItem('sessionToken');
      setSessionToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogin = async (credentials: LoginInput): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await trpc.login.mutate(credentials);
      
      if (response.success && response.user) {
        // For this demo, we'll simulate a session token since the backend is a stub
        const mockSessionToken = `session_${response.user.id}_${Date.now()}`;
        setSessionToken(mockSessionToken);
        localStorage.setItem('sessionToken', mockSessionToken);
        setUser(response.user as User);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
        user: undefined
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        await trpc.logout.mutate({ sessionToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('sessionToken');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 rounded-lg p-2">
                <span className="text-white font-bold text-lg">📱</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.username}!</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard user={user} />
      </main>
    </div>
  );
}

export default App;