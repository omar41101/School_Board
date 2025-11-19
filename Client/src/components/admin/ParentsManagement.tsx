import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Plus, 
  Search,
  Filter,
  Users,
  User,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  MapPin,
  Heart,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Parent {
  id: string;
  parentId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  occupation?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  children: {
    id: string;
    name: string;
    matricule: string;
    className: string;
    grade: number;
    attendance: number;
    status: 'active' | 'inactive';
  }[];
  status: 'active' | 'inactive' | 'pending';
  relationshipType: 'father' | 'mother' | 'guardian' | 'other';
  registrationDate: string;
  lastLogin?: string;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
  paymentStatus: 'up_to_date' | 'pending' | 'overdue';
  pendingAmount?: number;
  meetingsAttended: number;
  totalMeetings: number;
}

export function ParentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const mockParents: Parent[] = [
    {
      id: '1',
      parentId: 'PAR2024001',
      name: 'Michael Johnson',
      email: 'michael.johnson@email.com',
      phone: '+1 (555) 123-4567',
      occupation: 'Software Engineer',
      address: '123 Oak Street, Springfield, IL',
      emergencyContact: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 987-6543',
        relationship: 'Spouse'
      },
      children: [
        {
          id: '1',
          name: 'Alice Johnson',
          matricule: 'STU2024001',
          className: '10-A',
          grade: 87.5,
          attendance: 95,
          status: 'active'
        },
        {
          id: '2',
          name: 'Bob Johnson',
          matricule: 'STU2024015',
          className: '8-B',
          grade: 91.2,
          attendance: 98,
          status: 'active'
        }
      ],
      status: 'active',
      relationshipType: 'father',
      registrationDate: '2024-08-15',
      lastLogin: '2 hours ago',
      communicationPreferences: {
        email: true,
        sms: true,
        app: true
      },
      paymentStatus: 'up_to_date',
      meetingsAttended: 8,
      totalMeetings: 10
    },
    {
      id: '2',
      parentId: 'PAR2024002',
      name: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      phone: '+1 (555) 456-7890',
      occupation: 'Physician',
      address: '456 Maple Avenue, Springfield, IL',
      children: [
        {
          id: '3',
          name: 'Emily Smith',
          matricule: 'STU2024032',
          className: '11-A',
          grade: 93.8,
          attendance: 97,
          status: 'active'
        }
      ],
      status: 'active',
      relationshipType: 'mother',
      registrationDate: '2024-09-01',
      lastLogin: '1 day ago',
      communicationPreferences: {
        email: true,
        sms: false,
        app: true
      },
      paymentStatus: 'pending',
      pendingAmount: 250.00,
      meetingsAttended: 5,
      totalMeetings: 6
    },
    {
      id: '3',
      parentId: 'PAR2024003',
      name: 'Robert Davis',
      email: 'robert.davis@email.com',
      phone: '+1 (555) 789-0123',
      occupation: 'Teacher',
      address: '789 Pine Road, Springfield, IL',
      children: [
        {
          id: '4',
          name: 'David Davis',
          matricule: 'STU2024055',
          className: '12-C',
          grade: 78.3,
          attendance: 88,
          status: 'active'
        }
      ],
      status: 'active',
      relationshipType: 'father',
      registrationDate: '2024-07-20',
      lastLogin: '3 days ago',
      communicationPreferences: {
        email: true,
        sms: true,
        app: false
      },
      paymentStatus: 'overdue',
      pendingAmount: 450.00,
      meetingsAttended: 3,
      totalMeetings: 8
    },
    {
      id: '4',
      parentId: 'PAR2024004',
      name: 'Lisa Wilson',
      email: 'lisa.wilson@email.com',
      occupation: 'Nurse',
      children: [
        {
          id: '5',
          name: 'James Wilson',
          matricule: 'STU2024067',
          className: '9-B',
          grade: 85.1,
          attendance: 92,
          status: 'active'
        }
      ],
      status: 'pending',
      relationshipType: 'mother',
      registrationDate: '2024-10-01',
      communicationPreferences: {
        email: true,
        sms: true,
        app: true
      },
      paymentStatus: 'up_to_date',
      meetingsAttended: 0,
      totalMeetings: 1
    }
  ];

  const getStatusColor = (status: Parent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: Parent['paymentStatus']) => {
    switch (status) {
      case 'up_to_date':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status: Parent['paymentStatus']) => {
    switch (status) {
      case 'up_to_date':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRelationshipColor = (type: Parent['relationshipType']) => {
    switch (type) {
      case 'father':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mother':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'guardian':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredParents = mockParents.filter(parent => {
    const matchesSearch = parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.parentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.children.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || parent.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getParentStats = () => {
    return {
      total: mockParents.length,
      active: mockParents.filter(p => p.status === 'active').length,
      pending: mockParents.filter(p => p.status === 'pending').length,
      totalChildren: mockParents.reduce((sum, p) => sum + p.children.length, 0),
      upToDate: mockParents.filter(p => p.paymentStatus === 'up_to_date').length,
      overdue: mockParents.filter(p => p.paymentStatus === 'overdue').length,
      avgMeetingAttendance: Math.round(
        (mockParents.reduce((sum, p) => sum + (p.meetingsAttended / p.totalMeetings * 100), 0) / mockParents.length)
      )
    };
  };

  const stats = getParentStats();

  const handleViewParent = (parent: Parent) => {
    console.log('View parent:', parent.name);
  };

  const handleEditParent = (parent: Parent) => {
    console.log('Edit parent:', parent.name);
  };

  const handleDeleteParent = (parent: Parent) => {
    console.log('Delete parent:', parent.name);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Parents Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage parent accounts and track student progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
            <Plus className="mr-2 h-4 w-4" />
            Add Parent
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Parents</p>
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
              <p className="text-2xl font-bold text-[#3E92CC]">{stats.totalChildren}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Children</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.upToDate}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Payments OK</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Overdue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.avgMeetingAttendance}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Meeting Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search parents by name, email, or child name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      {/* Parents List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredParents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredParents.map((parent) => (
                <Card key={parent.id} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A] hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={parent.avatar} />
                          <AvatarFallback className="bg-[#3E92CC] text-white">
                            {parent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                            {parent.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {parent.parentId}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-xs px-2 py-1 ${getStatusColor(parent.status)}`}>
                              {parent.status.charAt(0).toUpperCase() + parent.status.slice(1)}
                            </Badge>
                            <Badge className={`text-xs px-2 py-1 ${getRelationshipColor(parent.relationshipType)}`}>
                              {parent.relationshipType.charAt(0).toUpperCase() + parent.relationshipType.slice(1)}
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
                          <DropdownMenuItem onClick={() => handleViewParent(parent)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditParent(parent)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteParent(parent)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
                        <span className="truncate">{parent.email}</span>
                      </div>
                      {parent.phone && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="h-4 w-4 mr-2 text-[#3E92CC]" />
                          <span>{parent.phone}</span>
                        </div>
                      )}
                      {parent.occupation && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <User className="h-4 w-4 mr-2 text-[#3E92CC]" />
                          <span>{parent.occupation}</span>
                        </div>
                      )}
                      {parent.address && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 text-[#3E92CC]" />
                          <span className="truncate">{parent.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Payment Status */}
                    <div className="p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#0D1B2A] dark:text-white">Payment Status</span>
                        <Badge className={`text-xs px-2 py-1 ${getPaymentStatusColor(parent.paymentStatus)}`}>
                          <div className="flex items-center space-x-1">
                            {getPaymentStatusIcon(parent.paymentStatus)}
                            <span className="capitalize">{parent.paymentStatus.replace('_', ' ')}</span>
                          </div>
                        </Badge>
                      </div>
                      {parent.pendingAmount && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Pending: {formatCurrency(parent.pendingAmount)}
                        </p>
                      )}
                    </div>

                    {/* Children */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#0D1B2A] dark:text-white">Children ({parent.children.length})</span>
                        <GraduationCap className="h-4 w-4 text-[#3E92CC]" />
                      </div>
                      <div className="space-y-2">
                        {parent.children.map((child) => (
                          <div key={child.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-[#0D1B2A] rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#0D1B2A] dark:text-white">
                                {child.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {child.matricule} • {child.className}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-[#0D1B2A] dark:text-white">
                                {child.grade.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {child.attendance}% attendance
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meeting Attendance */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Meeting Attendance</span>
                        <span className="font-medium text-[#0D1B2A] dark:text-white">
                          {parent.meetingsAttended}/{parent.totalMeetings}
                        </span>
                      </div>
                      <Progress 
                        value={(parent.meetingsAttended / parent.totalMeetings) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Communication Preferences */}
                    <div>
                      <p className="text-sm font-medium text-[#0D1B2A] dark:text-white mb-2">
                        Communication Preferences:
                      </p>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className={`flex items-center space-x-1 ${
                          parent.communicationPreferences.email ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          parent.communicationPreferences.sms ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <MessageSquare className="h-4 w-4" />
                          <span>SMS</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          parent.communicationPreferences.app ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <Heart className="h-4 w-4" />
                          <span>App</span>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    {parent.emergencyContact && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
                          Emergency Contact:
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          {parent.emergencyContact.name} ({parent.emergencyContact.relationship})
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          {parent.emergencyContact.phone}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        Registered {parent.registrationDate}
                      </div>
                      {parent.lastLogin && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Last login: {parent.lastLogin}
                        </span>
                      )}
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
                  No parents found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first parent.'}
                </p>
                {!searchTerm && (
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Parent
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