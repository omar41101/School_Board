import { useState } from 'react';
import { toast } from 'sonner';
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
} from '../../services/api';
import { useDebouncedSearch } from '../../hooks/useDebounce';
import { DataTable, type Column } from '../shared/DataTable';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormModal } from '../shared/FormModal';
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog';
import { PaginatedSelect } from '../shared/PaginatedSelect';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Course } from '../../types';

export function CoursesManagement() {
  const [page, setPage] = useState(1);
  const [search, searchDebounced, setSearch] = useDebouncedSearch('', 1000);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const { data, isLoading } = useGetCoursesQuery({ page, limit: 10, search: searchDebounced });

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const courses = data?.data?.courses || [];

  const [form, setForm] = useState<{
    name: string;
    code: string;
    description: string;
    level: string;
    subject: string;
    teacherId: string;
    credits: string;
    maxStudents: string;
    academicYear: string;
    semester: 'S1' | 'S2' | 'Summer';
    status: string;
  }>({
    name: '',
    code: '',
    description: '',
    level: '',
    subject: '',
    teacherId: 'none',
    credits: '1',
    maxStudents: '30',
    academicYear: '',
    semester: 'S1',
    status: 'active',
  });

  const openCreate = () => {
    setSelectedCourse(null);
    setForm({
      name: '',
      code: '',
      description: '',
      level: '',
      subject: '',
      teacherId: 'none',
      credits: '1',
      maxStudents: '30',
      academicYear: '',
      semester: 'S1',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setSelectedCourse(course);
    setForm({
      name: course.name ?? '',
      code: course.code ?? '',
      description: course.description ?? '',
      level: course.level ?? '',
      subject: course.subject ?? '',
      teacherId: course.teacherId ? String(course.teacherId) : 'none',
      credits: course.credits !== undefined ? String(course.credits) : '1',
      maxStudents: course.maxStudents !== undefined ? String(course.maxStudents) : '30',
      academicYear: course.academicYear ?? '',
      semester: (course.semester as 'S1' | 'S2' | 'Summer') ?? 'S1',
      status: course.status ?? 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedCourse) {
        await updateCourse({
          id: selectedCourse.id,
          data: {
            ...(form.name && { name: form.name }),
            ...(form.code && { code: form.code }),
            description: form.description || undefined,
            ...(form.level && { level: form.level }),
            ...(form.subject && { subject: form.subject }),
            ...(form.teacherId !== 'none' && { teacherId: Number(form.teacherId) }),
            ...(form.credits && { credits: Number(form.credits) }),
            ...(form.maxStudents && { maxStudents: Number(form.maxStudents) }),
            ...(form.academicYear && { academicYear: form.academicYear }),
            ...(form.semester && { semester: form.semester }),
            ...(form.status && { status: form.status }),
          },
        }).unwrap();
        toast.success('Course updated successfully');
      } else {
        await createCourse({
          name: form.name,
          code: form.code,
          description: form.description || undefined,
          level: form.level,
          subject: form.subject,
          ...(form.teacherId !== 'none' && { teacherId: Number(form.teacherId) }),
          credits: Number(form.credits),
          maxStudents: Number(form.maxStudents),
          academicYear: form.academicYear,
          semester: form.semester,
        }).unwrap();
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const columns: Column<Course>[] = [
    {
      id: 'code',
      header: 'Code',
      accessorKey: 'code',
    },
    {
      id: 'name',
      header: 'Course Name',
      accessorKey: 'name',
    },
    {
      id: 'subject',
      header: 'Subject',
      accessorKey: 'subject',
    },
    {
      id: 'level',
      header: 'Level',
      accessorKey: 'level',
    },
    {
      id: 'teacher',
      header: 'Teacher',
      cell: (row) =>
        row.teacher
          ? `${row.teacher.user?.firstName} ${row.teacher.user?.lastName}`
          : '-',
    },
    {
      id: 'students',
      header: 'Enrolled',
      cell: (row) => (
        <span>
          {Array.isArray(row.enrolledStudents) ? row.enrolledStudents.length : 0} / {row.maxStudents}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isDeleting}
            onClick={() => {
              setCourseToDelete(row);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Courses Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all courses in the system
          </p>
        </div>
        <Button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openCreate(); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={courses}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No courses found"
        pagination={{
          page,
          pageSize: 10,
          total: data?.total ?? 0,
          onPageChange: setPage,
        }}
        onRowClick={(row) => {
          openEdit(row);
        }}
      />

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedCourse ? 'Edit Course' : 'Add New Course'}
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Code</Label>
            <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Input value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Teacher (optional)</Label>
            <PaginatedSelect
              resource="teachers"
              value={form.teacherId === 'none' ? '' : form.teacherId}
              onValueChange={(v) => setForm((p) => ({ ...p, teacherId: v || 'none' }))}
              placeholder="Select teacher..."
              optional
            />
          </div>
          <div className="space-y-2">
            <Label>Credits</Label>
            <Input type="number" value={form.credits} onChange={(e) => setForm((p) => ({ ...p, credits: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Max students</Label>
            <Input type="number" value={form.maxStudents} onChange={(e) => setForm((p) => ({ ...p, maxStudents: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Academic year</Label>
            <Input value={form.academicYear} onChange={(e) => setForm((p) => ({ ...p, academicYear: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Semester</Label>
            <Select value={form.semester} onValueChange={(v) => setForm((p) => ({ ...p, semester: v as 'S1' | 'S2' | 'Summer' }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S1">S1</SelectItem>
                <SelectItem value="S2">S2</SelectItem>
                <SelectItem value="Summer">Summer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedCourse && (
            <div className="space-y-2 md:col-span-2">
              <Label>Status</Label>
              <Input value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} />
            </div>
          )}
        </div>
      </FormModal>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete course"
        itemName={courseToDelete ? courseToDelete.name : undefined}
        onConfirm={async () => {
          if (!courseToDelete) return;
          try {
            await deleteCourse(courseToDelete.id).unwrap();
            toast.success('Course deleted successfully');
            setCourseToDelete(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Delete failed');
            throw err;
          }
        }}
        isLoading={isDeleting}
      />
    </div>
  );
}
