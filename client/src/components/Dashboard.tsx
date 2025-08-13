import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Shield } from 'lucide-react';
// Note the correct path for importing from server
import type { User as UserType } from '../../../server/src/schema';

interface DashboardProps {
  user: UserType;
}

export function Dashboard({ user }: DashboardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full p-3">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user.username}! 🎉</h2>
            <p className="text-indigo-100 mt-1">
              You're successfully authenticated and ready to go.
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Your account details and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-lg font-semibold text-gray-900">{user.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-lg font-semibold text-gray-900">#{user.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <div className="mt-1">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-700 mt-1">
                  {formatDate(user.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center space-x-2">
            <span>🚀</span>
            <span>Demo Application</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-blue-800">
            <p>
              <strong>Congratulations!</strong> You've successfully logged into the demo application.
            </p>
            <div className="space-y-2">
              <p><strong>Authentication Flow:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Login form validation with email and password</li>
                <li>tRPC integration for API communication</li>
                <li>Session management with localStorage</li>
                <li>Protected routes and automatic session verification</li>
                <li>Responsive design with Tailwind CSS</li>
                <li>Radix UI components for accessibility</li>
              </ul>
            </div>
            <p className="text-sm">
              <strong>Note:</strong> The backend authentication handlers are currently stubs, 
              but the frontend demonstrates the complete authentication flow that would work 
              with a real implementation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}