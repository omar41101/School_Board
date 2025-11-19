import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { MoreHorizontal, Mail, Phone, Eye, Edit, Trash2 } from "lucide-react";

interface Student {
  id: string;
  matricule: string;
  name: string;
  email: string;
  phone?: string;
  level: string;
  className: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  attendance: number;
  lastLogin?: string;
}

interface StudentCardProps {
  student: Student;
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export function StudentCard({ student, onView, onEdit, onDelete }: StudentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback className="bg-[#3E92CC] text-white">
                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-[#0D1B2A]">{student.name}</h3>
              <p className="text-sm text-gray-600">ID: {student.matricule}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {student.level}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {student.className}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(student)}>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(student)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(student)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${getStatusColor(student.status)}`}
            >
              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
            </Badge>
            <span className={`text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
              {student.attendance}% Attendance
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-3 w-3" />
              <span>{student.email}</span>
            </div>
            {student.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{student.phone}</span>
              </div>
            )}
          </div>

          {student.lastLogin && (
            <p className="text-xs text-gray-400">
              Last login: {student.lastLogin}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}