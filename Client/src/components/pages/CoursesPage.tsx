import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CourseCard, Course } from '../courses/CourseCard';
import { 
  Plus, 
  Filter, 
  Search,
  BookOpen,
  Calendar,
  Users,
  Clock,
  Download,
  Upload
} from 'lucide-react';

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for courses
  const mockCourses: Course[] = [
    {
      id: '1',
      code: 'MATH101',
      name: 'Advanced Mathematics',
      description: 'Comprehensive course covering algebra, calculus, and statistical analysis for advanced students.',
      subject: 'Mathematics',
      level: 'Grade 11',
      teacher: {
        id: '1',
        name: 'Dr. Sarah Johnson',
        avatar: undefined
      },
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '09:00',
        endTime: '10:30'
      },
      duration: 16,
      currentWeek: 8,
      totalStudents: 28,
      maxCapacity: 30,
      status: 'active',
      startDate: '2024-09-15',
      endDate: '2024-12-20',
      materials: 15,
      assignments: 8,
      completedAssignments: 5
    },
    {
      id: '2',
      code: 'CS201',
      name: 'Programming Fundamentals',
      description: 'Introduction to programming concepts using Python and JavaScript.',
      subject: 'Computer Science',
      level: 'Grade 10',
      teacher: {
        id: '2',
        name: 'Prof. Michael Chen'
      },
      schedule: {
        days: ['Tuesday', 'Thursday'],
        startTime: '10:45',
        endTime: '12:15'
      },
      duration: 20,
      currentWeek: 12,
      totalStudents: 25,
      maxCapacity: 25,
      status: 'active',
      startDate: '2024-09-01',
      endDate: '2025-01-15',
      materials: 22,
      assignments: 12,
      completedAssignments: 8
    },
    {
      id: '3',
      code: 'ENG102',
      name: 'Creative Writing Workshop',
      description: 'Develop creative writing skills through poetry, short stories, and narrative techniques.',
      subject: 'Literature',
      level: 'Grade 12',
      teacher: {
        id: '3',
        name: 'Ms. Emily Rodriguez'
      },
      schedule: {
        days: ['Monday', 'Thursday'],
        startTime: '14:00',
        endTime: '15:30'
      },
      duration: 12,
      currentWeek: 0,
      totalStudents: 0,
      maxCapacity: 20,
      status: 'upcoming',
      startDate: '2025-01-20',
      endDate: '2025-04-10',
      materials: 0,
      assignments: 0,
      completedAssignments: 0
    },
    {
      id: '4',
      code: 'PHY301',
      name: 'Quantum Physics',
      description: 'Advanced physics course exploring quantum mechanics and modern physics concepts.',
      subject: 'Physics',
      level: 'Grade 12',
      teacher: {
        id: '4',
        name: 'Dr. Ahmed Hassan'
      },
      schedule: {
        days: ['Wednesday', 'Friday'],
        startTime: '08:00',
        endTime: '09:30'
      },
      duration: 18,
      currentWeek: 18,
      totalStudents: 15,
      maxCapacity: 20,
      status: 'completed',
      startDate: '2024-05-01',
      endDate: '2024-08-30',
      materials: 25,
      assignments: 15,
      completedAssignments: 15
    }
  ];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || course.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getCourseStats = () => {
    return {
      total: mockCourses.length,
      active: mockCourses.filter(c => c.status === 'active').length,
      upcoming: mockCourses.filter(c => c.status === 'upcoming').length,
      completed: mockCourses.filter(c => c.status === 'completed').length,
      totalStudents: mockCourses.reduce((sum, c) => sum + c.totalStudents, 0),
      avgProgress: Math.round(mockCourses
        .filter(c => c.status === 'active')
        .reduce((sum, c) => sum + (c.currentWeek / c.duration * 100), 0) / 
        mockCourses.filter(c => c.status === 'active').length)
    };
  };

  const stats = getCourseStats();

  const handleViewCourse = (course: Course) => {
    console.log('View course:', course.name);
    // Implementation for viewing course details
  };

  const handleEditCourse = (course: Course) => {
    console.log('Edit course:', course.name);
    // Implementation for editing course
  };

  const handleDeleteCourse = (course: Course) => {
    console.log('Delete course:', course.name);
    // Implementation for deleting course
  };

  const handleStartCourse = (course: Course) => {
    console.log('Start course:', course.name);
    // Implementation for starting course
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Courses & Classes</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage curriculum and track course progress</p>
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
            Create Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Courses</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-[#3E92CC]" />
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
                <p className="text-sm text-gray-600 dark:text-gray-300">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Enrolled Students</p>
                <p className="text-2xl font-bold text-[#3E92CC]">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg Progress</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.avgProgress || 0}%</p>
              </div>
              <Clock className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses by name, code, or teacher..."
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

      {/* Courses List */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="all">
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({stats.active})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({stats.upcoming})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onView={handleViewCourse}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onStart={handleStartCourse}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first course.'}
                </p>
                {!searchTerm && (
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
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