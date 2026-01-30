import React, { useState } from 'react';
import { toast } from 'sonner';
import { useCreateStudentMutation, useDeleteStudentMutation, useGetStudentsQuery, useUpdateStudentMutation } from '../../services/api';
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
import type { Student } from '../../types';

export function StudentsManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const { data, isLoading } = useGetStudentsQuery({
    page,
    limit: 10,
    search,
  });


  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const students = data?.data?.students || [];

  const [form, setForm] = useState<{
    userId: string;
    matricule: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    level: string;
    className: string;
    section: string;
    parentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
  }>({
    userId: '',
    matricule: '',
    dateOfBirth: '',
    gender: 'male',
    level: '',
    className: '',
    section: '',
    parentId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const openCreate = () => {
    setSelectedStudent(null);
    setForm({
      userId: '',
      matricule: '',
      dateOfBirth: '',
      gender: 'male',
      level: '',
      className: '',
      section: '',
      parentId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      avatar: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (student: Student) => {
    setSelectedStudent(student);
    setForm({
      userId: String(student.userId ?? ''),
      matricule: student.matricule ?? '',
      dateOfBirth: student.dateOfBirth ? String(student.dateOfBirth).slice(0, 10) : '',
      gender: (student.gender as 'male' | 'female') ?? 'male',
      level: student.level ?? '',
      className: student.className ?? '',
      section: student.section ?? '',
      parentId: student.parentId ? String(student.parentId) : '',
      firstName: student.user?.firstName ?? '',
      lastName: student.user?.lastName ?? '',
      email: student.user?.email ?? '',
      phone: student.user?.phone ?? '',
      avatar: student.user?.avatar ?? '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedStudent) {
        await updateStudent({
          id: selectedStudent.id,
          data: {
            ...(form.firstName && { firstName: form.firstName }),
            ...(form.lastName && { lastName: form.lastName }),
            ...(form.email && { email: form.email }),
            ...(form.phone && { phone: form.phone }),
            ...(form.avatar && { avatar: form.avatar }),
            ...(form.level && { level: form.level }),
            ...(form.className && { className: form.className }),
            ...(form.section && { section: form.section }),
            ...(form.parentId && { parentId: Number(form.parentId) }),
          },
        }).unwrap();
        toast.success('Student updated successfully');
      } else {
        await createStudent({
          userId: Number(form.userId),
          matricule: form.matricule,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          level: form.level,
          className: form.className,
          ...(form.section && { section: form.section }),
          ...(form.parentId && { parentId: Number(form.parentId) }),
        }).unwrap();
        toast.success('Student created successfully');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const columns: Column<Student>[] = [
    {
      id: 'matricule',
      header: 'Matricule',
      accessorKey: 'matricule',
    },
    {
      id: 'name',
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            {row.user?.firstName?.[0]}{row.user?.lastName?.[0]}
          </div>
          <span>
            {row.user?.firstName} {row.user?.lastName}
          </span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      cell: (row) => row.user?.email || '-',
    },
    {
      id: 'level',
      header: 'Level',
      accessorKey: 'level',
    },
    {
      id: 'className',
      header: 'Class',
      accessorKey: 'className',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'active'
              ? 'default'
              : row.status === 'suspended'
                ? 'destructive'
                : 'secondary'
          }
        >
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
              setStudentToDelete(row);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all students in the system
          </p>
        </div>
        <Button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openCreate(); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={students}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No students found"
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
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isCreating || isUpdating || (!selectedStudent && !form.userId)}
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!selectedStudent && (
            <div className="space-y-2 md:col-span-2">
              <Label>User (role: student)</Label>
              <PaginatedSelect
                resource="users"
                role="student"
                value={form.userId}
                onValueChange={(v) => setForm((p) => ({ ...p, userId: v }))}
                placeholder="Select a student user..."
              />
              <p className="text-xs text-muted-foreground">
                Create the user first in “Users” if you don’t see it here.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Matricule</Label>
            <Input value={form.matricule} onChange={(e) => setForm((p) => ({ ...p, matricule: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Date of birth</Label>
            <Input type="date" value={form.dateOfBirth} onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm((p) => ({ ...p, gender: v as 'male' | 'female' }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">male</SelectItem>
                <SelectItem value="female">female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Input value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <Label>Class</Label>
            <Input value={form.className} onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Section (optional)</Label>
            <Input value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <Label>Parent (optional)</Label>
            <PaginatedSelect
              resource="parents"
              value={form.parentId}
              onValueChange={(v) => setForm((p) => ({ ...p, parentId: v }))}
              placeholder="Select a parent..."
            />
          </div>

          {selectedStudent && (
            <>
              <div className="space-y-2">
                <Label>First name</Label>
                <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Avatar URL</Label>
                <Input value={form.avatar} onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))} />
              </div>
            </>
          )}
        </div>
      </FormModal>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete student"
        itemName={studentToDelete ? `${studentToDelete.user?.firstName ?? ''} ${studentToDelete.user?.lastName ?? ''}`.trim() || studentToDelete.matricule : undefined}
        onConfirm={async () => {
          if (!studentToDelete) return;
          try {
            await deleteStudent(studentToDelete.id).unwrap();
            toast.success('Student deleted successfully');
            setStudentToDelete(null);
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
