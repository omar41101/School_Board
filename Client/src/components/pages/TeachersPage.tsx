import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { TeacherCard, Teacher } from '../users/TeacherCard';
import { 
  Plus, 
  Filter, 
  Search,
  UserCheck,
  Users,
  Calendar,
  TrendingUp,
  Download,
  Upload
} from 'lucide-react';

export function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for teachers
  const mockTeachers: Teacher[] = [
    {
      id: '1',
      matricule: 'TCH2024001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '+1 (555) 123-4567',
      avatar: undefined,
      specialization: 'Mathematics',
      subjects: ['Algebra', 'Calculus', 'Statistics'],
      classes: ['10-A', '11-B', '12-C'],
      status: 'active',
      experience: 8,
      rating: 4.8,
      totalStudents: 75,
      joiningDate: 'Sep 2020',
      lastLogin: '2 hours ago',
      address: '123 Main St, City'
    },
    {
      id: '2',
      matricule: 'TCH2024002',
      name: 'Prof. Michael Chen',
      email: 'michael.chen@school.edu',
      phone: '+1 (555) 987-6543',
      specialization: 'Computer Science',
      subjects: ['Programming', 'Data Structures', 'Web Development'],
      classes: ['11-A', '12-A'],
      status: 'active',
      experience: 12,
      rating: 4.9,
      totalStudents: 60,
      joiningDate: 'Jan 2018',
      lastLogin: '1 day ago',
      address: '456 Tech Ave, City'
    },
    {
      id: '3',
      matricule: 'TCH2024003',
      name: 'Ms. Emily Rodriguez',
      email: 'emily.rodriguez@school.edu',
      phone: '+1 (555) 456-7890',
      specialization: 'Literature',
      subjects: ['English Literature', 'Creative Writing', 'Grammar'],
      classes: ['9-A', '10-B'],
      status: 'on_leave',
      experience: 6,
      rating: 4.7,
      totalStudents: 45,
      joiningDate: 'Mar 2021',
      lastLogin: '1 week ago',
      address: '789 Arts St, City'
    },
    {
      id: '4',
      matricule: 'TCH2024004',
      name: 'Dr. Ahmed Hassan',
      email: 'ahmed.hassan@school.edu',
      specialization: 'Physics',
      subjects: ['General Physics', 'Quantum Mechanics'],
      classes: ['11-C', '12-B'],
      status: 'inactive',
      experience: 15,
      rating: 4.6,
      totalStudents: 0,
      joiningDate: 'Aug 2015',
      lastLogin: '2 months ago',
      address: '321 Science Blvd, City'
    }
  ];

  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || teacher.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getTeacherStats = () => {
    return {
      total: mockTeachers.length,
      active: mockTeachers.filter(t => t.status === 'active').length,
      onLeave: mockTeachers.filter(t => t.status === 'on_leave').length,
      inactive: mockTeachers.filter(t => t.status === 'inactive').length,
      avgRating: (mockTeachers.reduce((sum, t) => sum + t.rating, 0) / mockTeachers.length).toFixed(1),
      totalStudents: mockTeachers.reduce((sum, t) => sum + t.totalStudents, 0)
    };
  };

  const stats = getTeacherStats();

  const handleViewTeacher = (teacher: Teacher) => {
    console.log('View teacher:', teacher.name);
    // Implementation for viewing teacher details
  };

  const handleEditTeacher = (teacher: Teacher) => {
    console.log('Edit teacher:', teacher.name);
    // Implementation for editing teacher
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    console.log('Delete teacher:', teacher.name);
    // Implementation for deleting teacher
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Teachers Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage teaching staff and monitor performance</p>
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
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Teachers</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.total}</p>
              </div>
              <UserCheck className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.onLeave}</p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</p>
                <p className="text-2xl font-bold text-[#3E92CC]">{stats.avgRating}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Students</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg Experience</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
                  {Math.round(mockTeachers.reduce((sum, t) => sum + t.experience, 0) / mockTeachers.length)}y
                </p>
              </div>
              <Calendar className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search teachers by name, email, or specialization..."
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

      {/* Teachers List */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="all">
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({stats.active})
          </TabsTrigger>
          <TabsTrigger value="on_leave">
            On Leave ({stats.onLeave})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({stats.inactive})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onView={handleViewTeacher}
                  onEdit={handleEditTeacher}
                  onDelete={handleDeleteTeacher}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardContent className="p-12 text-center">
                <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  No teachers found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first teacher.'}
                </p>
                {!searchTerm && (
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Teacher
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