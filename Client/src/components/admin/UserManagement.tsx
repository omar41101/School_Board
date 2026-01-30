import { useState } from 'react';
import { toast } from 'sonner';
import {
  useDeactivateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useRegisterMutation,
  useUpdateUserMutation,
} from '../../services/api';
import { useDebouncedSearch } from '../../hooks/useDebounce';
import { DataTable, type Column } from '../shared/DataTable';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormModal } from '../shared/FormModal';
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog';
import { Edit, Plus, Search, Trash2, UserCheck, UserX } from 'lucide-react';
import type { User } from '../../types';

export function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, searchDebounced, setSearch] = useDebouncedSearch('', 1000);
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data, isLoading } = useGetUsersQuery({
    page,
    limit: 10,
    ...(searchDebounced && { search: searchDebounced }),
    ...(roleFilter !== 'all' && { role: roleFilter }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
  });

  const users = data?.data?.users ?? [];

  const [register, { isLoading: isCreating }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [deactivateUser, { isLoading: isDeactivating }] = useDeactivateUserMutation();

  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: User['role'];
    phone: string;
    avatar: string;
    isActive: boolean;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    avatar: '',
    isActive: true,
  });

  const openCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'student',
      phone: '',
      avatar: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (u: User) => {
    setModalMode('edit');
    setSelectedUser(u);
    setForm({
      firstName: u.firstName ?? '',
      lastName: u.lastName ?? '',
      email: u.email ?? '',
      password: '',
      role: u.role,
      phone: u.phone ?? '',
      avatar: u.avatar ?? '',
      isActive: u.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === 'create') {
        await register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          role: form.role,
        }).unwrap();
        toast.success('User created successfully');
      } else if (selectedUser) {
        await updateUser({
          id: selectedUser.id,
          data: {
            ...(form.firstName && { firstName: form.firstName }),
            ...(form.lastName && { lastName: form.lastName }),
            ...(form.email && { email: form.email }),
            ...(form.phone && { phone: form.phone }),
            ...(form.avatar && { avatar: form.avatar }),
            isActive: form.isActive,
          },
        }).unwrap();
        toast.success('User updated successfully');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const columns: Column<User>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
    },
    {
      id: 'name',
      header: 'Name',
      cell: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: 'role',
      header: 'Role',
      cell: (row) => (
        <Badge variant="secondary" className="capitalize">
          {row.role}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isActive ? 'default' : 'secondary'}>
          {row.isActive ? 'active' : 'inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button type="button" variant="ghost" size="sm" onClick={(ev) => { ev.stopPropagation(); openEdit(row); }}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isDeactivating || isUpdating}
            onClick={async (ev) => {
              ev.stopPropagation();
              try {
                if (row.isActive) {
                  await deactivateUser(row.id).unwrap();
                  toast.success('User deactivated');
                } else {
                  await updateUser({ id: row.id, data: { isActive: true } }).unwrap();
                  toast.success('User activated');
                }
              } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Operation failed');
              }
            }}
            title={row.isActive ? 'Deactivate' : 'Activate'}
          >
            {row.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isDeleting}
            onClick={(ev) => {
              ev.stopPropagation();
              setUserToDelete(row);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user accounts</p>
        </div>
        <Button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openCreate(); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as User['role'] | 'all')}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
              <SelectItem value="direction">direction</SelectItem>
              <SelectItem value="teacher">teacher</SelectItem>
              <SelectItem value="student">student</SelectItem>
              <SelectItem value="parent">parent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'active' | 'inactive')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">active</SelectItem>
              <SelectItem value="inactive">inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No users found"
        pagination={{
          page,
          pageSize: 10,
          total: data?.total ?? 0,
          onPageChange: setPage,
        }}
      />

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={modalMode === 'create' ? 'Add User' : 'Edit User'}
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isCreating ||
                isUpdating ||
                (modalMode === 'create' && (!form.firstName || !form.lastName || !form.email || !form.password))
              }
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
                    </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
            <Label>First name</Label>
            <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
            <Label>Last name</Label>
            <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
                        </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                    </div>

          {modalMode === 'create' ? (
            <>
              <div className="space-y-2 md:col-span-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} 
                />
                      </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v as User['role'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">admin</SelectItem>
                    <SelectItem value="direction">direction</SelectItem>
                    <SelectItem value="teacher">teacher</SelectItem>
                    <SelectItem value="student">student</SelectItem>
                    <SelectItem value="parent">parent</SelectItem>
                  </SelectContent>
                </Select>
                    </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.isActive ? 'active' : 'inactive'} onValueChange={(v) => setForm((p) => ({ ...p, isActive: v === 'active' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="inactive">inactive</SelectItem>
                  </SelectContent>
                </Select>
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
        title="Delete user"
        itemName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : undefined}
        onConfirm={async () => {
          if (!userToDelete) return;
          try {
            await deleteUser(userToDelete.id).unwrap();
            toast.success('User deleted');
            setUserToDelete(null);
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