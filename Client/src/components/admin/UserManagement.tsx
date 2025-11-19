import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  Plus, 
  Search,
  Filter,
  Users,
  UserCheck,
  GraduationCap,
  User,
  Shield,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface UserAccount {
  id: string;
  matricule?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'direction';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  avatar?: string;
  createdDate: string;
  lastLogin?: string;
  permissions: string[];
  additionalInfo: {
    department?: string;
    className?: string;
    specialization?: string;
    children?: string[];
  };
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  // Mock data
  const mockUsers: UserAccount[] = [
    {
      id: '1',
      matricule: 'ADM2024001',
      name: 'John Smith',
      email: 'john.smith@school.edu',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      status: 'active',
      createdDate: '2024-01-15',
      lastLogin: '2 hours ago',
      permissions: ['user_management', 'system_settings', 'reports', 'analytics'],
      additionalInfo: {
        department: 'Administration'
      }
    },
    {
      id: '2',
      matricule: 'TCH2024001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '+1 (555) 987-6543',
      role: 'teacher',
      status: 'active',
      createdDate: '2024-09-01',
      lastLogin: '1 day ago',
      permissions: ['grade_management', 'course_content', 'student_communication'],
      additionalInfo: {
        department: 'Mathematics',
        specialization: 'Advanced Mathematics'
      }
    },
    {
      id: '3',
      matricule: 'STU2024001',
      name: 'Alice Johnson',
      email: 'alice.johnson@student.edu',
      role: 'student',
      status: 'active',
      createdDate: '2024-09-01',
      lastLogin: '30 minutes ago',
      permissions: ['view_grades', 'submit_assignments', 'access_materials'],
      additionalInfo: {
        className: '10-A'
      }
    },
    {
      id: '4',
      matricule: 'PAR2024001',
      name: 'Michael Johnson',
      email: 'michael.johnson@parent.edu',
      phone: '+1 (555) 456-7890',
      role: 'parent',
      status: 'active',
      createdDate: '2024-09-05',
      lastLogin: '3 days ago',
      permissions: ['view_child_progress', 'teacher_communication', 'payment_access'],
      additionalInfo: {
        children: ['Alice Johnson', 'Bob Johnson']
      }
    },
    {
      id: '5',
      matricule: 'DIR2024001',
      name: 'Dr. Emily White',
      email: 'emily.white@school.edu',
      phone: '+1 (555) 321-0987',
      role: 'direction',
      status: 'active',
      createdDate: '2024-01-01',
      lastLogin: '1 hour ago',
      permissions: ['full_access', 'policy_management', 'budget_oversight', 'staff_management'],
      additionalInfo: {
        department: 'School Administration'
      }
    },
    {
      id: '6',
      matricule: 'TCH2024002',
      name: 'Prof. Michael Chen',
      email: 'michael.chen@school.edu',
      role: 'teacher',
      status: 'pending',
      createdDate: '2024-10-01',
      permissions: [],
      additionalInfo: {
        department: 'Computer Science',
        specialization: 'Programming'
      }
    }
  ];

  const getRoleIcon = (role: UserAccount['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'teacher':
        return <UserCheck className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'parent':
        return <User className="h-4 w-4" />;
      case 'direction':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserAccount['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'parent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'direction':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: UserAccount['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.matricule && user.matricule.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || user.status === activeTab;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesTab && matchesRole;
  });

  const getUserStats = () => {
    return {
      total: mockUsers.length,
      active: mockUsers.filter(u => u.status === 'active').length,
      pending: mockUsers.filter(u => u.status === 'pending').length,
      suspended: mockUsers.filter(u => u.status === 'suspended').length,
      admins: mockUsers.filter(u => u.role === 'admin').length,
      teachers: mockUsers.filter(u => u.role === 'teacher').length,
      students: mockUsers.filter(u => u.role === 'student').length,
      parents: mockUsers.filter(u => u.role === 'parent').length
    };
  };

  const stats = getUserStats();

  const handleViewUser = (user: UserAccount) => {
    console.log('View user:', user.name);
  };

  const handleEditUser = (user: UserAccount) => {
    console.log('Edit user:', user.name);
  };

  const handleDeleteUser = (user: UserAccount) => {
    console.log('Delete user:', user.name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Users
          </Button>
          <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Suspended</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Admins</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.teachers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Teachers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.students}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.parents}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Parents</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92CC] focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="direction">Direction</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({stats.suspended})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A] hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-[#3E92CC] text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#0D1B2A] dark:text-white truncate">
                            {user.name}
                          </h3>
                          {user.matricule && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {user.matricule}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-xs px-2 py-1 ${getRoleColor(user.role)}`}>
                              <div className="flex items-center space-x-1">
                                {getRoleIcon(user.role)}
                                <span className="capitalize">{user.role}</span>
                              </div>
                            </Badge>
                            <Badge className={`text-xs px-2 py-1 ${getStatusColor(user.status)}`}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-[#3E92CC]" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="h-4 w-4 mr-2 text-[#3E92CC]" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2">
                      {user.additionalInfo.department && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Department:</span>
                          <span className="font-medium text-[#0D1B2A] dark:text-white">{user.additionalInfo.department}</span>
                        </div>
                      )}
                      {user.additionalInfo.className && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Class:</span>
                          <span className="font-medium text-[#0D1B2A] dark:text-white">{user.additionalInfo.className}</span>
                        </div>
                      )}
                      {user.additionalInfo.specialization && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Specialization:</span>
                          <span className="font-medium text-[#0D1B2A] dark:text-white">{user.additionalInfo.specialization}</span>
                        </div>
                      )}
                      {user.additionalInfo.children && (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Children:</span>
                          <div className="mt-1 space-y-1">
                            {user.additionalInfo.children.map((child, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                {child}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Permissions */}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 3).map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {user.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{user.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created {user.createdDate}
                        </div>
                        {user.lastLogin && (
                          <span>Last login: {user.lastLogin}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first user.'}
                </p>
                {!searchTerm && (
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}