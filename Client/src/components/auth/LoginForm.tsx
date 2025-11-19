import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  UserCheck, 
  Users, 
  Settings,
  Crown
} from 'lucide-react';

type UserRole = 'admin' | 'student' | 'teacher' | 'parent' | 'direction';

interface LoginFormProps {
  onLogin: (role: UserRole, userData: any) => void;
  onClose: () => void;
}

export function LoginForm({ onLogin, onClose }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data for demonstration
  const mockUsers = {
    admin: {
      id: 'ADM001',
      name: 'Administrator',
      email: 'admin@school.com',
      avatar: '/api/placeholder/40/40',
      role: 'admin' as const
    },
    student: {
      id: 'STU001',
      name: 'Emma Johnson',
      email: 'emma.johnson@student.school.com',
      avatar: '/api/placeholder/40/40',
      role: 'student' as const,
      class: '10-A',
      studentId: 'STU001'
    },
    teacher: {
      id: 'TCH001',
      name: 'Dr. Marie Dubois',
      email: 'marie.dubois@school.com',
      avatar: '/api/placeholder/40/40',
      role: 'teacher' as const,
      subject: 'Mathematics',
      employeeId: 'TCH001'
    },
    parent: {
      id: 'PAR001',
      name: 'Robert Johnson',
      email: 'robert.johnson@email.com',
      avatar: '/api/placeholder/40/40',
      role: 'parent' as const,
      children: [
        {
          id: 'STU001',
          name: 'Emma Johnson',
          class: '10-A'
        },
        {
          id: 'STU004',
          name: 'James Johnson',
          class: '8-B'
        }
      ]
    },
    direction: {
      id: 'DIR001',
      name: 'Principal Anderson',
      email: 'principal@school.com',
      avatar: '/api/placeholder/40/40',
      role: 'direction' as const,
      title: 'School Principal'
    }
  };

  const roleConfig = {
    admin: {
      icon: Settings,
      label: 'Administrator',
      color: 'bg-purple-100 text-purple-800',
      description: 'Full system access and management'
    },
    student: {
      icon: GraduationCap,
      label: 'Student',
      color: 'bg-blue-100 text-blue-800',
      description: 'Access grades, homework, and schedule'
    },
    teacher: {
      icon: UserCheck,
      label: 'Teacher',
      color: 'bg-green-100 text-green-800',
      description: 'Manage classes and student progress'
    },
    parent: {
      icon: Users,
      label: 'Parent',
      color: 'bg-orange-100 text-orange-800',
      description: 'Monitor child progress and communicate'
    },
    direction: {
      icon: Crown,
      label: 'School Direction',
      color: 'bg-red-100 text-red-800',
      description: 'School leadership and oversight'
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = mockUsers[selectedRole];
      onLogin(selectedRole, userData);
      setIsLoading(false);
    }, 1500);
  };

  const handleDemoLogin = (role: UserRole) => {
    setSelectedRole(role);
    const userData = mockUsers[role];
    onLogin(role, userData);
  };

  const currentRoleConfig = roleConfig[selectedRole];
  const RoleIcon = currentRoleConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#0D1B2A] dark:text-white">Login to SchoolERP</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Choose your role and sign in</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label>Select Your Role</Label>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                const config = roleConfig[role];
                const Icon = config.icon;
                
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 border rounded-lg text-left transition-all duration-200 ${
                      selectedRole === role 
                        ? 'border-[#3E92CC] bg-[#3E92CC]/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{config.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {config.description}
                        </div>
                      </div>
                      {selectedRole === role && (
                        <Badge className="bg-[#3E92CC] text-white">Selected</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={`Enter your ${selectedRole} email`}
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Demo Access */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Demo Access</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                className="text-xs"
              >
                <Settings className="mr-1 h-3 w-3" />
                Admin Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('teacher')}
                className="text-xs"
              >
                <UserCheck className="mr-1 h-3 w-3" />
                Teacher Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('student')}
                className="text-xs"
              >
                <GraduationCap className="mr-1 h-3 w-3" />
                Student Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('parent')}
                className="text-xs"
              >
                <Users className="mr-1 h-3 w-3" />
                Parent Demo
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              For demo purposes, you can use any email/password combination or click the demo buttons above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}