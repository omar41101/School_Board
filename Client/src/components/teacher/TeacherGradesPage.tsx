import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useGetTeacherMeQuery,
  useGetCoursesQuery,
  useGetAssignmentsQuery,
  useGetGradesQuery,
  useGetStudentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} from '../../services/api';
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog';
import { FormModal } from '../shared/FormModal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import type { Assignment as ApiAssignment, Grade as ApiGrade, Course } from '../../types';

export function TeacherGradesPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    type: 'homework',
    totalPoints: '100',
    dueDate: '',
    description: '',
    courseId: '',
    subject: '',
    level: '',
    className: '',
  });

  const { data: teacherMeData } = useGetTeacherMeQuery();
  const teacherId = teacherMeData?.data?.teacher?.id;

  const { data: coursesData } = useGetCoursesQuery(
    { teacher: teacherId!, limit: 10 },
    { skip: !teacherId }
  );
  const courses: Course[] = coursesData?.data?.courses ?? [];

  const courseIds = courses.map((c) => c.id).join(',');
  const { data: assignmentsData, isLoading: assignmentsLoading } = useGetAssignmentsQuery(
    { courseIds: courseIds || undefined },
    { skip: !courseIds }
  );
  const assignments: ApiAssignment[] = assignmentsData?.data?.assignments ?? [];

  const { data: gradesData, isLoading: gradesLoading } = useGetGradesQuery(
    { teacher: teacherId! },
    { skip: !teacherId }
  );
  const grades: ApiGrade[] = gradesData?.data?.grades ?? [];

  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: isUpdatingAssignment }] = useUpdateAssignmentMutation();
  const [deleteAssignment, { isLoading: isDeletingAssignment }] = useDeleteAssignmentMutation();
  const [createGrade, { isLoading: isCreatingGrade }] = useCreateGradeMutation();
  const [updateGrade, { isLoading: isUpdatingGrade }] = useUpdateGradeMutation();
  const [deleteGrade, { isLoading: isDeletingGrade }] = useDeleteGradeMutation();

  const { data: studentsData } = useGetStudentsQuery({ page: 1, limit: 500 }, { skip: !teacherId });
  const allStudents = studentsData?.data?.students ?? [];
  const studentsInSelectedCourse = newAssignment.courseId
    ? allStudents.filter((s) => {
        const c = courses.find((c) => String(c.id) === newAssignment.courseId);
        const enrolled = (c?.enrolledStudents as number[] | null) ?? [];
        return enrolled.includes(s.id);
      })
    : [];
  const studentsForNewGrade = newGradeForm.courseId
    ? allStudents.filter((s) => {
        const c = courses.find((c) => String(c.id) === newGradeForm.courseId);
        const enrolled = (c?.enrolledStudents as number[] | null) ?? [];
        return enrolled.includes(s.id);
      })
    : [];

  const [assignmentToEdit, setAssignmentToEdit] = useState<ApiAssignment | null>(null);
  const [gradeToEdit, setGradeToEdit] = useState<ApiGrade | null>(null);
  const [gradeToDelete, setGradeToDelete] = useState<ApiGrade | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<ApiAssignment | null>(null);
  const [editGradeForm, setEditGradeForm] = useState({ marks: '', totalMarks: '', remarks: '' });
  const [showCreateGrade, setShowCreateGrade] = useState(false);
  const [newGradeForm, setNewGradeForm] = useState({
    courseId: '',
    studentId: '',
    subject: '',
    marks: '',
    totalMarks: '100',
    examType: 'quiz' as 'quiz' | 'midterm' | 'final' | 'assignment' | 'project' | 'practical',
    examDate: new Date().toISOString().slice(0, 10),
    academicYear: '2024-2025',
    semester: 'S1' as 'S1' | 'S2' | 'Summer',
    remarks: '',
  });

  const filteredAssignments = useMemo(() => {
    let list = assignments;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(s) ||
          (a.subject || '').toLowerCase().includes(s) ||
          (a.course?.name || '').toLowerCase().includes(s)
      );
    }
    if (selectedClass !== 'all') {
      list = list.filter((a) => a.className === selectedClass || a.course?.name === selectedClass);
    }
    return list;
  }, [assignments, searchTerm, selectedClass]);

  const filteredGrades = useMemo(() => {
    let list = grades;
    if (selectedAssignment !== 'all') {
      list = list.filter((g) => String(g.courseId) === selectedAssignment || String(g.id) === selectedAssignment);
    }
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter((g) => {
        const name = g.student?.user
          ? `${(g.student.user as { firstName?: string }).firstName} ${(g.student.user as { lastName?: string }).lastName}`
          : '';
        return name.toLowerCase().includes(s);
      });
    }
    return list;
  }, [grades, selectedAssignment, searchTerm]);

  const classOptions = useMemo(() => {
    const set = new Set<string>();
    assignments.forEach((a) => {
      if (a.className) set.add(a.className);
      if (a.course?.name) set.add(a.course.name);
    });
    return Array.from(set);
  }, [assignments]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-green-100 text-green-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'project':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number, total: number) => {
    if (total === 0) return 'text-gray-600';
    const percentage = (grade / total) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.courseId || !newAssignment.dueDate || !teacherId) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createAssignment({
        title: newAssignment.title,
        description: newAssignment.description,
        courseId: Number(newAssignment.courseId),
        teacherId,
        subject: newAssignment.subject || 'General',
        level: newAssignment.level || 'All',
        className: newAssignment.className || 'All',
        dueDate: newAssignment.dueDate,
        totalMarks: Number(newAssignment.totalPoints) || 100,
      }).unwrap();
      toast.success('Assignment created successfully');
      setNewAssignment({
        title: '',
        type: 'homework',
        totalPoints: '100',
        dueDate: '',
        description: '',
        courseId: '',
        subject: '',
        level: '',
        className: '',
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create assignment');
    }
  };

  const handleCreateGrade = async () => {
    if (!teacherId || !newGradeForm.courseId || !newGradeForm.studentId || !newGradeForm.subject || newGradeForm.marks === '' || !newGradeForm.totalMarks || !newGradeForm.examDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createGrade({
        teacherId,
        studentId: Number(newGradeForm.studentId),
        courseId: Number(newGradeForm.courseId),
        subject: newGradeForm.subject,
        marks: Number(newGradeForm.marks),
        totalMarks: Number(newGradeForm.totalMarks),
        examType: newGradeForm.examType,
        examDate: newGradeForm.examDate,
        academicYear: newGradeForm.academicYear,
        semester: newGradeForm.semester,
        remarks: newGradeForm.remarks || undefined,
      }).unwrap();
      toast.success('Grade created successfully');
      setShowCreateGrade(false);
      setNewGradeForm({
        courseId: '',
        studentId: '',
        subject: '',
        marks: '',
        totalMarks: '100',
        examType: 'quiz',
        examDate: new Date().toISOString().slice(0, 10),
        academicYear: '2024-2025',
        semester: 'S1',
        remarks: '',
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create grade');
    }
  };

  const avgGrade = grades.length > 0
    ? grades.reduce((sum, g) => sum + Number(g.marks), 0) / grades.length
    : 0;
  const totalMarksSum = grades.reduce((sum, g) => sum + Number(g.totalMarks), 0);
  const avgPercentage = totalMarksSum > 0 ? (grades.reduce((sum, g) => sum + Number(g.marks), 0) / totalMarksSum) * 100 : 0;
  const pendingCount = grades.filter((g) => Number(g.marks) === 0).length;

  if (assignmentsLoading || gradesLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#3E92CC]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Grades & Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage assignments and track student performance</p>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grade Book</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="create">Create Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredAssignments.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No assignments found</p>
              ) : (
                filteredAssignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-[#3E92CC]/10 rounded-lg">
                            <FileText className="h-6 w-6 text-[#3E92CC]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{assignment.title}</h3>
                              <Badge className={getTypeColor('homework')}>{assignment.subject || 'Assignment'}</Badge>
                              <Badge variant="outline">{assignment.className || assignment.course?.name || '-'}</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div className="flex items-center space-x-2 text-sm">
                                <Award className="h-4 w-4 text-gray-400" />
                                <span>{assignment.totalMarks} points</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>Due: {assignment.dueDate?.slice(0, 10)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setAssignmentToEdit(assignment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => setAssignmentToDelete(assignment)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="mt-6">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] max-w-md">
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  {assignments.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setShowCreateGrade(true)} className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Grade
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredGrades.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No grades found</p>
              ) : (
                filteredGrades.map((grade) => {
                  const studentName = grade.student?.user
                    ? `${(grade.student.user as { firstName?: string }).firstName} ${(grade.student.user as { lastName?: string }).lastName}`
                    : `Student ${grade.studentId}`;
                  const marks = Number(grade.marks);
                  const total = Number(grade.totalMarks);
                  const status = marks > 0 ? 'graded' : 'pending';
                  return (
                    <Card key={grade.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{studentName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{studentName}</h3>
                                <Badge className={getStatusColor(status)}>{status}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Subject: {grade.subject}
                              </p>
                              <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">Grade:</span>
                                  <span className={`text-lg font-bold ${getGradeColor(marks, total)}`}>
                                    {marks}/{total}
                                  </span>
                                  {total > 0 && (
                                    <span className="text-sm text-gray-500">
                                      ({Math.round((marks / total) * 100)}%)
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span>Date: {grade.examDate?.slice(0, 10)}</span>
                                </div>
                              </div>
                              {grade.remarks && (
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <p className="text-sm">
                                    <span className="font-medium">Feedback:</span> {grade.remarks}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setGradeToEdit(grade);
                                setEditGradeForm({
                                  marks: String(grade.marks),
                                  totalMarks: String(grade.totalMarks),
                                  remarks: grade.remarks ?? '',
                                });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive"
                              onClick={() => setGradeToDelete(grade)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-[#3E92CC]" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{assignments.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Assignments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{grades.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Grades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-[#3E92CC]" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{avgPercentage.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Class Average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{pendingCount}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Grades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Create New Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter assignment title"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select
                      value={newAssignment.courseId}
                      onValueChange={(v) => setNewAssignment({ ...newAssignment, courseId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name} ({c.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g. Mathematics"
                      value={newAssignment.subject}
                      onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Total Points</Label>
                    <Input
                      id="points"
                      type="number"
                      placeholder="100"
                      value={newAssignment.totalPoints}
                      onChange={(e) => setNewAssignment({ ...newAssignment, totalPoints: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Assignment instructions and details..."
                    rows={4}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  />
                </div>
                <Separator />
                <div className="flex justify-end space-x-4">
                  <Button
                    className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white"
                    onClick={handleCreateAssignment}
                    disabled={isCreating}
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isCreating ? ' Creating...' : 'Create Assignment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmDeleteDialog
        open={!!assignmentToDelete}
        onOpenChange={(open) => !open && setAssignmentToDelete(null)}
        title="Delete assignment"
        itemName={assignmentToDelete?.title}
        onConfirm={async () => {
          if (!assignmentToDelete) return;
          try {
            await deleteAssignment(assignmentToDelete.id).unwrap();
            toast.success('Assignment deleted');
            setAssignmentToDelete(null);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Delete failed');
            throw e;
          }
        }}
        isLoading={isDeletingAssignment}
      />
      <ConfirmDeleteDialog
        open={!!gradeToDelete}
        onOpenChange={(open) => !open && setGradeToDelete(null)}
        title="Delete grade"
        itemName={gradeToDelete ? `${gradeToDelete.subject} - ${gradeToDelete.marks}/${gradeToDelete.totalMarks}` : undefined}
        onConfirm={async () => {
          if (!gradeToDelete) return;
          try {
            await deleteGrade(gradeToDelete.id).unwrap();
            toast.success('Grade deleted');
            setGradeToDelete(null);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Delete failed');
            throw e;
          }
        }}
        isLoading={isDeletingGrade}
      />
      {gradeToEdit && (
        <FormModal
          open={!!gradeToEdit}
          onOpenChange={(open) => !open && setGradeToEdit(null)}
          title="Update grade"
          size="md"
          footer={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setGradeToEdit(null)}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (!gradeToEdit) return;
                  try {
                    await updateGrade({
                      id: gradeToEdit.id,
                      data: {
                        marks: Number(editGradeForm.marks),
                        totalMarks: Number(editGradeForm.totalMarks),
                        remarks: editGradeForm.remarks || undefined,
                      },
                    }).unwrap();
                    toast.success('Grade updated');
                    setGradeToEdit(null);
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : 'Update failed');
                  }
                }}
                disabled={isUpdatingGrade}
              >
                {isUpdatingGrade ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <Label>Marks</Label>
              <Input
                type="number"
                value={editGradeForm.marks}
                onChange={(e) => setEditGradeForm((p) => ({ ...p, marks: e.target.value }))}
              />
            </div>
            <div>
              <Label>Total marks</Label>
              <Input
                type="number"
                value={editGradeForm.totalMarks}
                onChange={(e) => setEditGradeForm((p) => ({ ...p, totalMarks: e.target.value }))}
              />
            </div>
            <div>
              <Label>Remarks (optional)</Label>
              <Textarea
                value={editGradeForm.remarks}
                onChange={(e) => setEditGradeForm((p) => ({ ...p, remarks: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
        </FormModal>
      )}

      <FormModal
        open={showCreateGrade}
        onOpenChange={setShowCreateGrade}
        title="Add Grade"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCreateGrade(false)}>Cancel</Button>
            <Button onClick={handleCreateGrade} disabled={isCreatingGrade} className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
              {isCreatingGrade ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Grade
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Course</Label>
            <Select value={newGradeForm.courseId} onValueChange={(v) => setNewGradeForm((p) => ({ ...p, courseId: v, studentId: '' }))}>
              <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Student</Label>
            <Select value={newGradeForm.studentId} onValueChange={(v) => setNewGradeForm((p) => ({ ...p, studentId: v }))} disabled={!newGradeForm.courseId}>
              <SelectTrigger><SelectValue placeholder={newGradeForm.courseId ? 'Select student' : 'Select course first'} /></SelectTrigger>
              <SelectContent>
                {studentsForNewGrade.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.user ? `${(s.user as { firstName?: string }).firstName} ${(s.user as { lastName?: string }).lastName}` : `Student ${s.id}`}
                  </SelectItem>
                ))}
                {newGradeForm.courseId && studentsForNewGrade.length === 0 && (
                  <SelectItem value="_none" disabled>No enrolled students</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subject</Label>
            <Input value={newGradeForm.subject} onChange={(e) => setNewGradeForm((p) => ({ ...p, subject: e.target.value }))} placeholder="e.g. Mathematics" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Marks</Label>
              <Input type="number" value={newGradeForm.marks} onChange={(e) => setNewGradeForm((p) => ({ ...p, marks: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <Label>Total marks</Label>
              <Input type="number" value={newGradeForm.totalMarks} onChange={(e) => setNewGradeForm((p) => ({ ...p, totalMarks: e.target.value }))} placeholder="100" />
            </div>
          </div>
          <div>
            <Label>Exam type</Label>
            <Select value={newGradeForm.examType} onValueChange={(v) => setNewGradeForm((p) => ({ ...p, examType: v as typeof p.examType }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="midterm">Midterm</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="practical">Practical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Exam date</Label>
            <Input type="date" value={newGradeForm.examDate} onChange={(e) => setNewGradeForm((p) => ({ ...p, examDate: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Academic year</Label>
              <Input value={newGradeForm.academicYear} onChange={(e) => setNewGradeForm((p) => ({ ...p, academicYear: e.target.value }))} placeholder="2024-2025" />
            </div>
            <div>
              <Label>Semester</Label>
              <Select value={newGradeForm.semester} onValueChange={(v) => setNewGradeForm((p) => ({ ...p, semester: v as 'S1' | 'S2' | 'Summer' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1">S1</SelectItem>
                  <SelectItem value="S2">S2</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Remarks (optional)</Label>
            <Textarea value={newGradeForm.remarks} onChange={(e) => setNewGradeForm((p) => ({ ...p, remarks: e.target.value }))} rows={2} placeholder="Optional feedback" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
