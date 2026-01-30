// Core Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'student' | 'teacher' | 'parent' | 'direction';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  userId: number;
  matricule: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  level: string;
  className: string;
  section?: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  parentId?: number;
  user?: User;
  parent?: Parent;
}

export interface Teacher {
  id: number;
  userId: number;
  employeeId: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  qualification: string;
  specialization: string;
  salary: number;
  subjects?: string[];
  experience: number;
  status: 'active' | 'inactive' | 'on-leave';
  user?: User;
}

export interface Parent {
  id: number;
  userId: number;
  relationship: 'father' | 'mother' | 'guardian';
  occupation?: string;
  status: 'active' | 'inactive';
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  addressCountry?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  user?: User;
  children?: Student[];
}

export interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  level: string;
  subject: string;
  teacherId?: number;
  credits: number;
  maxStudents: number;
  enrolledStudents?: number[];
  schedule?: ScheduleSlot[];
  syllabus?: SyllabusItem[];
  status: string;
  academicYear: string;
  semester: 'S1' | 'S2' | 'Summer';
  teacher?: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleSlot {
  day: string;
  time: string;
}

export interface SyllabusItem {
  topic: string;
  description?: string;
  week?: number;
}

export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  examType: 'quiz' | 'midterm' | 'final' | 'assignment' | 'project' | 'practical';
  subject: string;
  marks: number;
  totalMarks: number;
  percentage?: number;
  grade?: 'A_PLUS' | 'A' | 'B_PLUS' | 'B' | 'C_PLUS' | 'C' | 'D' | 'F';
  remarks?: string;
  teacherId: number;
  academicYear: string;
  semester: 'S1' | 'S2' | 'Summer';
  examDate: string;
  student?: Student;
  course?: Course;
  teacher?: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  courseId: number;
  teacherId: number;
  subject: string;
  level: string;
  className: string;
  dueDate: string;
  totalMarks: number;
  attachments?: Attachment[];
  submissions?: Submission[];
  status: 'active' | 'closed' | 'draft';
  course?: Course;
  teacher?: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  name: string;
  url: string;
  type?: string;
  size?: number;
}

export interface Submission {
  studentId: number;
  submittedAt: string;
  attachments?: Attachment[];
  marks?: number;
  feedback?: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  courseId?: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject?: string;
  teacherId?: number;
  remarks?: string;
  academicYear: string;
  semester: 'S1' | 'S2' | 'Summer';
  student?: Student;
  course?: Course;
  teacher?: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  studentId: number;
  type: 'tuition' | 'transport' | 'library' | 'sports' | 'exam' | 'hostel' | 'other';
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'cheque' | 'online';
  transactionId?: string;
  remarks?: string;
  academicYear: string;
  semester?: 'S1' | 'S2' | 'Summer';
  receiptNumber?: string;
  invoiceUrl?: string;
  student?: Student;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  type: 'academic' | 'sports' | 'cultural' | 'holiday' | 'exam' | 'meeting' | 'other';
  startDate: string;
  endDate: string;
  location?: string;
  organizerId?: number;
  participants?: number[];
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'staff';
  levels?: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  attachments?: Attachment[];
  maxParticipants?: number;
  organizer?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  subject: string;
  content: string;
  attachments?: Attachment[];
  isRead: boolean;
  readAt?: string;
  priority: 'low' | 'normal' | 'high';
  category: 'academic' | 'administrative' | 'general' | 'urgent';
  sender?: User;
  recipient?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Cantine {
  id: number;
  studentId: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  items: CantineItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'served' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  specialInstructions?: string;
  student?: Student;
  createdAt: string;
  updatedAt: string;
}

export interface CantineItem {
  name: string;
  price: number;
  quantity: number;
}

// API Response Types
export interface ApiResponse<T> {
  status: string;
  data: T;
  results?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface PaginatedResponse<T> {
  status: string;
  results: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: {
    [key: string]: T[];
  };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  data: User;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  role?: string;
  level?: string;
  className?: string;
  student?: number;
  course?: number;
  teacher?: number;
  academicYear?: string;
  semester?: 'S1' | 'S2' | 'Summer';
  date?: string;
  type?: string;
}
