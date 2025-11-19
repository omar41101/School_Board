import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  GraduationCap,
  UserCheck,
  DollarSign,
  Calendar,
  BookOpen,
  Clock,
  BarChart3,
  PieChart,
  Download,
  Filter,
  CheckCircle,
  MapPin,
  Coffee
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');

  // Mock data
  const enrollmentData = [
    { month: 'Jan', students: 1200, teachers: 85, revenue: 120000 },
    { month: 'Feb', students: 1250, teachers: 87, revenue: 125000 },
    { month: 'Mar', students: 1300, teachers: 90, revenue: 130000 },
    { month: 'Apr', students: 1350, teachers: 92, revenue: 135000 },
    { month: 'May', students: 1400, teachers: 95, revenue: 140000 },
    { month: 'Jun', students: 1450, teachers: 98, revenue: 145000 }
  ];

  const performanceData = [
    { grade: 'Grade 8', average: 85.2, students: 180 },
    { grade: 'Grade 9', average: 82.8, students: 195 },
    { grade: 'Grade 10', average: 84.5, students: 210 },
    { grade: 'Grade 11', average: 87.1, students: 200 },
    { grade: 'Grade 12', average: 89.3, students: 185 }
  ];

  const attendanceData = [
    { month: 'Jan', rate: 94.5 },
    { month: 'Feb', rate: 93.2 },
    { month: 'Mar', rate: 95.1 },
    { month: 'Apr', rate: 92.8 },
    { month: 'May', rate: 94.7 },
    { month: 'Jun', rate: 96.2 }
  ];

  const departmentData = [
    { name: 'Mathematics', students: 350, value: 25 },
    { name: 'Sciences', students: 320, value: 23 },
    { name: 'Languages', students: 280, value: 20 },
    { name: 'Arts', students: 200, value: 14 },
    { name: 'Sports', students: 180, value: 13 },
    { name: 'Others', students: 120, value: 5 }
  ];

  const revenueData = [
    { month: 'Jan', tuition: 85000, transport: 15000, meals: 12000, materials: 8000 },
    { month: 'Feb', tuition: 88000, transport: 16000, meals: 13000, materials: 8500 },
    { month: 'Mar', tuition: 92000, transport: 17000, meals: 13500, materials: 7500 },
    { month: 'Apr', tuition: 95000, transport: 18000, meals: 14000, materials: 8000 },
    { month: 'May', tuition: 98000, transport: 19000, meals: 14500, materials: 8500 },
    { month: 'Jun', tuition: 102000, transport: 20000, meals: 15000, materials: 8000 }
  ];

  const COLORS = ['#0D1B2A', '#3E92CC', '#5EB2EC', '#7ED2FF', '#A8E6CF', '#FFD93D'];

  const kpiData = [
    {
      title: 'Total Students',
      value: '1,450',
      change: '+8.2% from last month',
      changeType: 'positive' as const,
      icon: GraduationCap
    },
    {
      title: 'Active Teachers',
      value: '98',
      change: '+3 new this month',
      changeType: 'positive' as const,
      icon: UserCheck
    },
    {
      title: 'Average Performance',
      value: '85.8%',
      change: '+2.1% from last month',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      title: 'Monthly Revenue',
      value: '$145,000',
      change: '+7.4% from last month',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      title: 'Attendance Rate',
      value: '96.2%',
      change: '+1.5% from last month',
      changeType: 'positive' as const,
      icon: Clock
    },
    {
      title: 'Completion Rate',
      value: '94.7%',
      change: '-0.3% from last month',
      changeType: 'negative' as const,
      icon: CheckCircle
    }
  ];

  const getTrendIcon = (changeType: 'positive' | 'negative' | 'neutral') => {
    if (changeType === 'positive') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (changeType === 'negative') {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Comprehensive insights into school performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92CC] focus:border-transparent"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-8 w-8 text-[#3E92CC]" />
                {getTrendIcon(kpi.changeType)}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{kpi.title}</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{kpi.value}</p>
                <p className={`text-xs mt-1 ${
                  kpi.changeType === 'positive' ? 'text-green-600' :
                  kpi.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {kpi.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Enrollment Trends */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-[#3E92CC]" />
                  Enrollment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#3E92CC" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-[#3E92CC]" />
                  Student Distribution by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollment" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Enrollment */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle>Monthly Enrollment Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="students" stroke="#3E92CC" fill="#3E92CC" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Enrollment Statistics */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle>Enrollment Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">New Enrollments (This Month)</span>
                      <Badge className="bg-green-100 text-green-800">+15.2%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-[#0D1B2A] dark:text-white">127</div>
                    <Progress value={85} className="mt-2" />
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Retention Rate</span>
                      <Badge className="bg-blue-100 text-blue-800">Excellent</Badge>
                    </div>
                    <div className="text-2xl font-bold text-[#0D1B2A] dark:text-white">96.8%</div>
                    <Progress value={96.8} className="mt-2" />
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Capacity Utilization</span>
                      <Badge className="bg-yellow-100 text-yellow-800">High</Badge>
                    </div>
                    <div className="text-2xl font-bold text-[#0D1B2A] dark:text-white">89.3%</div>
                    <Progress value={89.3} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Grade Performance */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle>Average Performance by Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#3E92CC" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-[#0D1B2A] dark:text-white">{grade.grade}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{grade.students} students</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#3E92CC]">{grade.average}%</div>
                        <div className="w-20">
                          <Progress value={grade.average} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <div className="space-y-6">
            {/* Revenue Breakdown */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle>Revenue Breakdown by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tuition" stackId="a" fill="#0D1B2A" />
                    <Bar dataKey="transport" stackId="a" fill="#3E92CC" />
                    <Bar dataKey="meals" stackId="a" fill="#5EB2EC" />
                    <Bar dataKey="materials" stackId="a" fill="#7ED2FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                <CardContent className="p-4">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">$102,000</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tuition Revenue</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                <CardContent className="p-4">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">$20,000</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Transport Revenue</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Coffee className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">$15,000</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Meals Revenue</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                <CardContent className="p-4">
                  <div className="text-center">
                    <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">$8,000</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Materials Revenue</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Attendance Trends */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle>Monthly Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#3E92CC" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Excellent Attendance (95%+)</span>
                      <Badge className="bg-green-100 text-green-800">850 students</Badge>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Good Attendance (85-94%)</span>
                      <Badge className="bg-yellow-100 text-yellow-800">420 students</Badge>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">Needs Attention (&lt;85%)</span>
                      <Badge className="bg-red-100 text-red-800">180 students</Badge>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}