import { useState } from 'react';
import { toast } from 'sonner';
import {
  useCreateTeacherMutation,
  useDeleteTeacherMutation,
  useGetTeachersQuery,
  useUpdateTeacherMutation,
} from '../../services/api';
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
import type { Teacher } from '../../types';

export function TeachersManagement() {
  const [page, setPage] = useState(1);
  const [search, searchDebounced, setSearch] = useDebouncedSearch('', 1000);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const { data, isLoading } = useGetTeachersQuery({ page, limit: 10, search: searchDebounced });

  const [createTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const teachers = data?.data?.teachers || [];

  const [form, setForm] = useState<{
    userId: string;
    employeeId: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    qualification: string;
    specialization: string;
    salary: string;
    experience: string;
  }>({
    userId: '',
    employeeId: '',
    dateOfBirth: '',
    gender: 'male',
    qualification: '',
    specialization: '',
    salary: '',
    experience: '',
  });

  const openCreate = () => {
    setSelectedTeacher(null);
    setForm({
      userId: '',
      employeeId: '',
      dateOfBirth: '',
      gender: 'male',
      qualification: '',
      specialization: '',
      salary: '',
      experience: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setForm({
      userId: String(teacher.userId ?? ''),
      employeeId: teacher.employeeId ?? '',
      dateOfBirth: teacher.dateOfBirth ? String(teacher.dateOfBirth).slice(0, 10) : '',
      gender: (teacher.gender as 'male' | 'female') ?? 'male',
      qualification: teacher.qualification ?? '',
      specialization: teacher.specialization ?? '',
      salary: teacher.salary !== undefined ? String(teacher.salary) : '',
      experience: teacher.experience !== undefined ? String(teacher.experience) : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedTeacher) {
        await updateTeacher({
          id: selectedTeacher.id,
          data: {
            ...(form.qualification && { qualification: form.qualification }),
            ...(form.specialization && { specialization: form.specialization }),
            ...(form.salary && { salary: Number(form.salary) }),
            ...(form.experience && { experience: Number(form.experience) }),
          },
        }).unwrap();
        toast.success('Teacher updated successfully');
      } else {
        await createTeacher({
          userId: Number(form.userId),
          employeeId: form.employeeId,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          qualification: form.qualification,
          specialization: form.specialization,
          salary: Number(form.salary),
          ...(form.experience && { experience: Number(form.experience) }),
        }).unwrap();
        toast.success('Teacher created successfully');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const columns: Column<Teacher>[] = [
    {
      id: 'employeeId',
      header: 'Employee ID',
      accessorKey: 'employeeId',
    },
    {
      id: 'name',
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
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
      id: 'specialization',
      header: 'Specialization',
      accessorKey: 'specialization',
    },
    {
      id: 'qualification',
      header: 'Qualification',
      accessorKey: 'qualification',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'active'
              ? 'default'
              : row.status === 'on-leave'
                ? 'secondary'
                : 'destructive'
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
              setTeacherToDelete(row);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teachers Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all teachers in the system
          </p>
        </div>
        <Button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openCreate(); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No teachers found"
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
        title={selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isCreating || isUpdating || (!selectedTeacher && !form.userId)}
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!selectedTeacher && (
            <div className="space-y-2 md:col-span-2">
              <Label>User (role: teacher)</Label>
              <Select value={form.userId} onValueChange={(v) => setForm((p) => ({ ...p, userId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher user..." />
                </SelectTrigger>
                <SelectContent>
                  {teacherUsers.map((u: User) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.firstName} {u.lastName} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Create the user first in “Users” if you don’t see it here.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Employee ID</Label>
            <Input value={form.employeeId} onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))} />
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
            <Label>Qualification</Label>
            <Input value={form.qualification} onChange={(e) => setForm((p) => ({ ...p, qualification: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <Label>Specialization</Label>
            <Input value={form.specialization} onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Salary</Label>
            <Input type="number" value={form.salary} onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <Label>Experience (years)</Label>
            <Input type="number" value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className="text-xs text-muted-foreground">
              Note: name/email are managed in “Users”.
            </p>
          </div>
        </div>
      </FormModal>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete teacher"
        itemName={teacherToDelete ? `${(teacherToDelete.user as { firstName?: string })?.firstName ?? ''} ${(teacherToDelete.user as { lastName?: string })?.lastName ?? ''}`.trim() || teacherToDelete.employeeId : undefined}
        onConfirm={async () => {
          if (!teacherToDelete) return;
          try {
            await deleteTeacher(teacherToDelete.id).unwrap();
            toast.success('Teacher deleted successfully');
            setTeacherToDelete(null);
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
