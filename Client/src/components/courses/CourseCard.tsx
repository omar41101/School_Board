import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Clock, 
  Users, 
  BookOpen,
  Calendar,
  User,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Play
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  subject: string;
  level: string;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
  };
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  duration: number; // in weeks
  currentWeek: number;
  totalStudents: number;
  maxCapacity: number;
  status: 'active' | 'inactive' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  materials: number;
  assignments: number;
  completedAssignments: number;
}

interface CourseCardProps {
  course: Course;
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onStart?: (course: Course) => void;
}

export function CourseCard({ course, onView, onEdit, onDelete, onStart }: CourseCardProps) {
  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const progressPercentage = (course.currentWeek / course.duration) * 100;
  const enrollmentPercentage = (course.totalStudents / course.maxCapacity) * 100;
  const assignmentProgress = course.assignments > 0 ? (course.completedAssignments / course.assignments) * 100 : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-[#1B2B3A] shadow-md hover:shadow-[#3E92CC]/20 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`text-xs px-2 py-1 ${getStatusColor(course.status)}`}>
                {getStatusText(course.status)}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1">
                {course.subject}
              </Badge>
            </div>
            <h3 className="font-semibold text-[#0D1B2A] dark:text-white mb-1">
              {course.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {course.code} • {course.level}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {course.description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(course)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {onStart && course.status === 'upcoming' && (
                <DropdownMenuItem onClick={() => onStart(course)}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Course
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(course)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(course)}
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
        {/* Teacher */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={course.teacher.avatar} />
            <AvatarFallback className="bg-[#3E92CC] text-white text-xs">
              {course.teacher.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0D1B2A] dark:text-white truncate">
              {course.teacher.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#0D1B2A] dark:text-white">Schedule</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-[#3E92CC]" />
              <span>{course.schedule.days.join(', ')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-[#3E92CC]" />
              <span>{course.schedule.startTime} - {course.schedule.endTime}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Course Progress</span>
              <span className="font-medium text-[#0D1B2A] dark:text-white">
                Week {course.currentWeek} of {course.duration}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Enrollment</span>
              <span className="font-medium text-[#0D1B2A] dark:text-white">
                {course.totalStudents}/{course.maxCapacity}
              </span>
            </div>
            <Progress value={enrollmentPercentage} className="h-2" />
          </div>

          {course.assignments > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Assignments</span>
                <span className="font-medium text-[#0D1B2A] dark:text-white">
                  {course.completedAssignments}/{course.assignments}
                </span>
              </div>
              <Progress value={assignmentProgress} className="h-2" />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-[#3E92CC]" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
            <p className="font-semibold text-[#0D1B2A] dark:text-white">{course.totalStudents}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="h-4 w-4 text-[#3E92CC]" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Materials</p>
            <p className="font-semibold text-[#0D1B2A] dark:text-white">{course.materials}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-[#3E92CC]" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
            <p className="font-semibold text-[#0D1B2A] dark:text-white">{course.duration}w</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Start: {course.startDate}</span>
            <span>End: {course.endDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}