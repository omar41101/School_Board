import { useState } from 'react';
import { motion } from 'motion/react';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { DashboardHeader } from '../layout/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { MessagesPage } from '../pages/MessagesPage';
import { EventsPage } from '../pages/EventsPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Award,
  MessageSquare,
  GraduationCap,
  DollarSign,
  Heart
} from 'lucide-react';

interface ParentDashboardProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'parent';
  };
  onNavigate: (path: string) => void;
  currentView: string;
  onLogout?: () => void;
}

export function ParentDashboard({ currentUser, onNavigate, currentView, onLogout }: ParentDashboardProps) {
  // Mock parent data
  const parentData = {
    children: [
      {
        id: '1',
        name: 'Alice Johnson',
        matricule: 'STU2024001',
        grade: '10-A',
        avatar: undefined,
        overallGrade: 87.5,
        attendance: 95,
        rank: 3,
        totalStudents: 28
      },
      {
        id: '2',
        name: 'Bob Johnson',
        matricule: 'STU2024015',
        grade: '8-B',
        avatar: undefined,
        overallGrade: 91.2,
        attendance: 98,
        rank: 1,
        totalStudents: 25
      }
    ],
    upcomingEvents: [
      { event: 'Parent-Teacher Conference', date: '2024-10-15', time: '2:00 PM', child: 'Alice Johnson' },
      { event: 'Science Fair', date: '2024-10-20', time: '10:00 AM', child: 'Both' },
      { event: 'Mathematics Competition', date: '2024-10-25', time: '9:00 AM', child: 'Bob Johnson' }
    ],
    pendingPayments: [
      { description: 'Monthly Tuition - October', amount: 1200, dueDate: '2024-10-15', child: 'Alice Johnson' },
      { description: 'Transport Fee - October', amount: 150, dueDate: '2024-10-10', child: 'Bob Johnson' }
    ],
    recentMessages: [
      { from: 'Dr. Sarah Johnson', subject: 'Alice\'s Mathematics Progress', date: '2024-10-05', read: false },
      { from: 'Prof. Michael Chen', subject: 'Bob\'s Computer Science Project', date: '2024-10-03', read: true },
      { from: 'School Administration', subject: 'Science Fair Participation', date: '2024-10-01', read: true }
    ]
  };

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#0D1B2A] to-[#3E92CC] rounded-2xl p-6 text-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold mb-2">Welcome, {currentUser.name}!</h1>
          <p className="text-white/80 mb-4">Stay connected with your children's education journey</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">{parentData.children.length}</div>
              <div className="text-sm text-white/70">Children</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {Math.round(parentData.children.reduce((sum, child) => sum + child.overallGrade, 0) / parentData.children.length)}%
              </div>
              <div className="text-sm text-white/70">Avg Grade</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {Math.round(parentData.children.reduce((sum, child) => sum + child.attendance, 0) / parentData.children.length)}%
              </div>
              <div className="text-sm text-white/70">Avg Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{parentData.recentMessages.filter(m => !m.read).length}</div>
              <div className="text-sm text-white/70">New Messages</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0D1B2A] dark:text-white mb-2">{parentData.upcomingEvents.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">This month</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{parentData.pendingPayments.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  ${parentData.pendingPayments.reduce((sum, payment) => sum + payment.amount, 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {parentData.recentMessages.filter(m => !m.read).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Unread messages</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Award className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 mb-1">
                  {parentData.children.reduce((top, child) => 
                    child.overallGrade > top.overallGrade ? child : top
                  ).name.split(' ')[0]}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {Math.max(...parentData.children.map(c => c.overallGrade))}% avg
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Children Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-[#3E92CC]" />
              Children's Academic Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {parentData.children.map((child, index) => (
                <div key={child.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback className="bg-[#3E92CC] text-white">
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{child.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{child.matricule} • {child.grade}</p>
                    </div>
                    <Badge className="bg-[#3E92CC] text-white">
                      Rank #{child.rank}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Grade</span>
                        <span className="font-medium">{child.overallGrade}%</span>
                      </div>
                      <Progress value={child.overallGrade} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Attendance</span>
                        <span className="font-medium">{child.attendance}%</span>
                      </div>
                      <Progress value={child.attendance} className="h-2" />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Class rank: {child.rank}/{child.totalStudents}</span>
                      <span>Excellent performance!</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parentData.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-[#3E92CC] rounded-full" />
                      <div>
                        <h4 className="font-medium text-[#0D1B2A] dark:text-white">{event.event}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">For: {event.child}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{event.date}</div>
                      <div className="text-xs text-gray-500">{event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parentData.recentMessages.map((message, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    !message.read 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-[#0D1B2A] dark:text-white">{message.from}</h4>
                          {!message.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{message.subject}</p>
                      </div>
                      <div className="text-xs text-gray-500">{message.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pending Payments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-[#3E92CC]" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {parentData.pendingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-[#0D1B2A] dark:text-white">{payment.description}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">For: {payment.child}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">${payment.amount}</div>
                    <div className="text-xs text-orange-500">Due: {payment.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'child-progress':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Children's Progress</h1>
            <div className="text-center py-12">
              <p className="text-gray-500">Detailed children progress view will be implemented here</p>
            </div>
          </div>
        );
      case 'payments':
        return <PaymentsPage />;
      case 'teacher-chat':
        return <MessagesPage />;
      case 'events':
        return <EventsPage />;
      case 'psychology':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Psychology Reports</h1>
            <div className="text-center py-12">
              <p className="text-gray-500">Psychology reports view will be implemented here</p>
            </div>
          </div>
        );
      case 'messages':
        return <MessagesPage />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#1B2B3A]">
      <DashboardSidebar 
        userRole="parent"
        currentPath={`/${currentView}`}
        onNavigate={onNavigate}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userRole="parent"
          userName={currentUser.name}
          userAvatar={currentUser.avatar}
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}