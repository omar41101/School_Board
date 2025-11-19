/**
 * Simple Demo Login Component
 * Quick demo access for testing
 */

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  GraduationCap,
  UserCheck,
  Users,
  Settings,
  Crown,
} from 'lucide-react';

interface DemoLoginProps {
  onClose?: () => void;
}

export function DemoLogin({ onClose }: DemoLoginProps) {
  const { login } = useAuth();

  const demoAccounts = [
    {
      role: 'student',
      email: 'emma.wilson@student.school.com',
      password: 'student123',
      name: 'Emma Wilson',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      role: 'teacher',
      email: 'john.smith@school.com',
      password: 'teacher123',
      name: 'John Smith',
      icon: UserCheck,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    {
      role: 'parent',
      email: 'sarah.wilson@email.com',
      password: 'parent123',
      name: 'Sarah Wilson',
      icon: Users,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    },
    {
      role: 'direction',
      email: 'director@school.com',
      password: 'direction123',
      name: 'School Director',
      icon: Crown,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    },
    {
      role: 'admin',
      email: 'admin@school.com',
      password: 'admin123',
      name: 'Admin User',
      icon: Settings,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    },
  ];

  const handleDemoLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      onClose?.();
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center">Demo Access</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Click any account below to try the platform
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-3">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            
            return (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account.email, account.password)}
                className="p-4 border rounded-lg text-left transition-all hover:border-[#3E92CC] hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${account.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{account.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {account.role} Account
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {account.email}
                    </div>
                  </div>
                  <div className="text-sm text-[#3E92CC] font-medium">
                    Login →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            <strong>Note:</strong> These are demo accounts with pre-populated data for testing purposes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
