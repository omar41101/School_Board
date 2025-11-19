import { useState } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  UserCheck, 
  Users, 
  Settings,
  Crown,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface LoginFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewLoginForm({ onClose, onSuccess }: LoginFormProps) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student' as UserRole,
  });

  const roleOptions = [
    {
      value: 'student' as UserRole,
      label: 'Student',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-800',
      description: 'Access grades, homework, and schedule',
    },
    {
      value: 'teacher' as UserRole,
      label: 'Teacher',
      icon: UserCheck,
      color: 'bg-green-100 text-green-800',
      description: 'Manage classes and student progress',
    },
    {
      value: 'parent' as UserRole,
      label: 'Parent',
      icon: Users,
      color: 'bg-orange-100 text-orange-800',
      description: 'Monitor child progress',
    },
    {
      value: 'direction' as UserRole,
      label: 'Direction',
      icon: Crown,
      color: 'bg-red-100 text-red-800',
      description: 'School leadership',
    },
    {
      value: 'admin' as UserRole,
      label: 'Admin',
      icon: Settings,
      color: 'bg-purple-100 text-purple-800',
      description: 'Full system access',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Sign in to access your school dashboard' 
              : 'Register to get started with SchoolERP'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select Your Role</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                          className={`p-3 border rounded-lg text-left transition-all ${
                            formData.role === role.value
                              ? 'border-[#3E92CC] bg-[#3E92CC]/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          disabled={isLoading}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${role.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{role.label}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {role.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#3E92CC] hover:bg-[#2d6fa3]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-950 text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            disabled={isLoading}
          >
            {isLogin ? 'Create an account' : 'Sign in instead'}
          </Button>

          <div className="flex justify-between text-sm">
            <Button
              type="button"
              variant="link"
              className="text-[#3E92CC] p-0"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {isLogin && (
              <Button
                type="button"
                variant="link"
                className="text-[#3E92CC] p-0"
                disabled={isLoading}
              >
                Forgot Password?
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
