import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation } from '../../services/api';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice.v2';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AuthResponse, User } from '../../types';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login(formData).unwrap() as AuthResponse;
      
      if (response.success && response.token) {
        // Transform user data if needed (handle _id vs id)
        const userData = {
          ...response.data,
          id: response.data.id || (response.data as unknown as { _id: string })._id || (response.data as unknown as { id: number }).id,
        };
        
        // Update Redux state
        dispatch(setCredentials({
          user: userData as User,
          token: response.token,
        }));

        toast.success('Login successful!');
        navigate(from, { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1B2A] via-[#1B2B3A] to-[#3E92CC] px-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-lg border border-white/20 dark:border-[#3E92CC]/20 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-[#0D1B2A] to-[#3E92CC] rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Sign In</CardTitle>
          <CardDescription className="text-center">
            Join the platform and access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0D1B2A] to-[#3E92CC] hover:from-[#1B2B3A] hover:to-[#4EA2DC]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p className="mt-1">
              <span className="font-medium">Admin:</span> admin@school.com / admin123
            </p>
            <p>
              <span className="font-medium">Teacher:</span> teacher1@school.com / teacher123
            </p>
            <p>
              <span className="font-medium">Student:</span> student1@school.com / student123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
