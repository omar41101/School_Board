import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  Users,
  BookOpen,
  MapPin,
  Edit,
  Eye,
  Trash2,
  Star
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface Teacher {
  id: string;
  matricule: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  specialization: string;
  subjects: string[];
  classes: string[];
  status: 'active' | 'inactive' | 'on_leave';
  experience: number;
  rating: number;
  totalStudents: number;
  joiningDate: string;
  lastLogin?: string;
  address?: string;
}

interface TeacherCardProps {
  teacher: Teacher;
  onView: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export function TeacherCard({ teacher, onView, onEdit, onDelete }: TeacherCardProps) {
  const getStatusColor = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'on_leave':
        return 'On Leave';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-[#1B2B3A] shadow-md hover:shadow-[#3E92CC]/20 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-[#3E92CC]/20">
              <AvatarImage src={teacher.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-[#0D1B2A] to-[#3E92CC] text-white">
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#0D1B2A] dark:text-white truncate">
                {teacher.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {teacher.matricule}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs px-2 py-1 ${getStatusColor(teacher.status)}`}>
                  {getStatusText(teacher.status)}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  {teacher.rating}
                </div>
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
              <DropdownMenuItem onClick={() => onView(teacher)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(teacher)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(teacher)}
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
            <span className="truncate">{teacher.email}</span>
          </div>
          {teacher.phone && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Phone className="h-4 w-4 mr-2 text-[#3E92CC]" />
              <span>{teacher.phone}</span>
            </div>
          )}
          {teacher.address && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-2 text-[#3E92CC]" />
              <span className="truncate">{teacher.address}</span>
            </div>
          )}
        </div>

        {/* Professional Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Specialization:</span>
            <span className="font-medium text-[#0D1B2A] dark:text-white">{teacher.specialization}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Experience:</span>
            <span className="font-medium text-[#0D1B2A] dark:text-white">{teacher.experience} years</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Students:</span>
            <span className="font-medium text-[#0D1B2A] dark:text-white">{teacher.totalStudents}</span>
          </div>
        </div>

        {/* Subjects */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Subjects:</p>
          <div className="flex flex-wrap gap-1">
            {teacher.subjects.slice(0, 3).map((subject, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-[#3E92CC]/10 text-[#3E92CC] border-[#3E92CC]/20">
                {subject}
              </Badge>
            ))}
            {teacher.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-100 text-gray-600 border-gray-200">
                +{teacher.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Classes */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Classes:</p>
          <div className="flex flex-wrap gap-1">
            {teacher.classes.slice(0, 4).map((className, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                {className}
              </Badge>
            ))}
            {teacher.classes.length > 4 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{teacher.classes.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Joined {teacher.joiningDate}
            </div>
            {teacher.lastLogin && (
              <span>Last login: {teacher.lastLogin}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}