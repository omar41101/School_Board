import { useState } from 'react';
import {
  useCreateParentMutation,
  useDeleteParentMutation,
  useGetParentsQuery,
  useGetUsersQuery,
  useUpdateParentMutation,
} from '../../services/api';
import { DataTable, type Column } from '../shared/DataTable';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Modal } from '../shared/Modal';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import type { Parent, User } from '../../types';

export function ParentsManagement() {
  const [search, setSearch] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetParentsQuery();
  const parents = data?.data?.parents ?? [];

  const { data: parentUsersData } = useGetUsersQuery({ page: 1, limit: 100, role: 'parent' });
  const parentUsers = parentUsersData?.data?.users ?? [];

  const [createParent, { isLoading: isCreating }] = useCreateParentMutation();
  const [updateParent, { isLoading: isUpdating }] = useUpdateParentMutation();
  const [deleteParent, { isLoading: isDeleting }] = useDeleteParentMutation();

  const [form, setForm] = useState<{
    userId: string;
    relationship: 'father' | 'mother' | 'guardian';
    occupation: string;
    emergencyContactName: string;
    emergencyContactRelationship: string;
    emergencyContactPhone: string;
  }>({
    userId: '',
    relationship: 'father',
    occupation: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
  });

  const openCreate = () => {
    setSelectedParent(null);
    setForm({
      userId: '',
      relationship: 'father',
      occupation: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (p: Parent) => {
    setSelectedParent(p);
    setForm({
      userId: String(p.userId ?? ''),
      relationship: (p.relationship as 'father' | 'mother' | 'guardian') ?? 'father',
      occupation: p.occupation ?? '',
      emergencyContactName: p.emergencyContactName ?? '',
      emergencyContactRelationship: p.emergencyContactRelationship ?? '',
      emergencyContactPhone: p.emergencyContactPhone ?? '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (selectedParent) {
      await updateParent({
        id: selectedParent.id,
        data: {
          relationship: form.relationship,
          occupation: form.occupation || undefined,
          emergencyContactName: form.emergencyContactName || undefined,
          emergencyContactRelationship: form.emergencyContactRelationship || undefined,
          emergencyContactPhone: form.emergencyContactPhone || undefined,
        },
      }).unwrap();
    } else {
      await createParent({
        userId: Number(form.userId),
        relationship: form.relationship,
        occupation: form.occupation || undefined,
        emergencyContactName: form.emergencyContactName || undefined,
        emergencyContactRelationship: form.emergencyContactRelationship || undefined,
        emergencyContactPhone: form.emergencyContactPhone || undefined,
      }).unwrap();
    }
    setIsModalOpen(false);
  };

  const filtered = parents.filter((p) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    const name = `${p.user?.firstName ?? ''} ${p.user?.lastName ?? ''}`.toLowerCase();
    const email = (p.user?.email ?? '').toLowerCase();
    return name.includes(needle) || email.includes(needle);
  });

  const columns: Column<Parent>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (row) => `${row.user?.firstName ?? ''} ${row.user?.lastName ?? ''}`.trim() || '-',
    },
    {
      id: 'email',
      header: 'Email',
      cell: (row) => row.user?.email ?? '-',
    },
    {
      id: 'relationship',
      header: 'Relationship',
      accessorKey: 'relationship',
    },
    {
      id: 'children',
      header: 'Children',
      cell: (row) => (Array.isArray((row as unknown as { children?: unknown[] }).children) ? (row as unknown as { children: unknown[] }).children.length : 0),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={(row.status ?? 'active') === 'active' ? 'default' : 'secondary'}>
          {row.status ?? 'active'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isDeleting}
            onClick={async () => {
              const ok = window.confirm('Delete this parent?');
              if (!ok) return;
              await deleteParent(row.id).unwrap();
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parents Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all parents in the system</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Parent
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search parents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable data={filtered} columns={columns} isLoading={isLoading} emptyMessage="No parents found" />

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedParent ? 'Edit Parent' : 'Add Parent'}
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating || (!selectedParent && !form.userId)}>
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!selectedParent && (
            <div className="space-y-2 md:col-span-2">
              <Label>User (role: parent)</Label>
              <Select value={form.userId} onValueChange={(v) => setForm((p) => ({ ...p, userId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent user..." />
                </SelectTrigger>
                <SelectContent>
                  {parentUsers.map((u: User) => (
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
            <Label>Relationship</Label>
            <Select value={form.relationship} onValueChange={(v) => setForm((p) => ({ ...p, relationship: v as 'father' | 'mother' | 'guardian' }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="father">father</SelectItem>
                <SelectItem value="mother">mother</SelectItem>
                <SelectItem value="guardian">guardian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Occupation</Label>
            <Input value={form.occupation} onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <Label>Emergency contact name</Label>
            <Input value={form.emergencyContactName} onChange={(e) => setForm((p) => ({ ...p, emergencyContactName: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Emergency contact relationship</Label>
            <Input value={form.emergencyContactRelationship} onChange={(e) => setForm((p) => ({ ...p, emergencyContactRelationship: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Emergency contact phone</Label>
            <Input value={form.emergencyContactPhone} onChange={(e) => setForm((p) => ({ ...p, emergencyContactPhone: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}