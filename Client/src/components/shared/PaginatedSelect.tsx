import React, { useState, useEffect, useRef } from 'react';
import {
  useGetUsersQuery,
  useGetTeachersQuery,
  useGetParentsQuery,
  useGetCoursesQuery,
} from '../../services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2 } from 'lucide-react';
import type { User, Teacher, Parent, Course } from '../../types';

type Resource = 'users' | 'teachers' | 'parents' | 'courses';

interface PaginatedSelectProps {
  resource: Resource;
  role?: User['role'];
  value: string;
  onValueChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  /** When true, prepend an empty "No teacher" / "None" option */
  optional?: boolean;
  getItemLabel?: (item: User | Teacher | Parent | Course) => string;
  getItemValue?: (item: User | Teacher | Parent | Course) => string;
}

const PAGE_SIZE = 10;

export function PaginatedSelect({
  resource,
  role,
  value,
  onValueChange,
  placeholder = 'Select...',
  getItemLabel,
  getItemValue,
}: PaginatedSelectProps) {
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<(User | Teacher | Parent | Course)[]>([]);
  const [open, setOpen] = useState(false);
  const lastMergedPage = useRef(0);

  const usersQuery = useGetUsersQuery(
    { page, limit: PAGE_SIZE, role: role! },
    { skip: (resource !== 'users') || !open }
  );
  const teachersQuery = useGetTeachersQuery(
    { page, limit: PAGE_SIZE },
    { skip: resource !== 'teachers' || !open }
  );
  const parentsQuery = useGetParentsQuery(
    { page, limit: PAGE_SIZE },
    { skip: resource !== 'parents' || !open }
  );
  const coursesQuery = useGetCoursesQuery(
    { page, limit: PAGE_SIZE },
    { skip: resource !== 'courses' || !open }
  );

  const query = resource === 'users' ? usersQuery : resource === 'teachers' ? teachersQuery : resource === 'parents' ? parentsQuery : coursesQuery;
  const data = query.data as { data?: { users?: User[]; teachers?: Teacher[]; parents?: Parent[]; courses?: Course[] }; total?: number; totalPages?: number; currentPage?: number } | undefined;
  const items = data?.data?.users ?? data?.data?.teachers ?? data?.data?.parents ?? data?.data?.courses ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? page;
  const hasMore = page < totalPages;
  const isLoading = query.isLoading || query.isFetching;

  useEffect(() => {
    if (!open) return;
    if (items.length === 0 && currentPage !== 1) return;
    if (currentPage <= lastMergedPage.current) return;
    lastMergedPage.current = currentPage;
    if (currentPage === 1) setAccumulated(items);
    else setAccumulated((prev) => [...prev, ...items]);
  }, [items, currentPage, open]);

  useEffect(() => {
    if (open) {
      setPage(1);
      setAccumulated([]);
      lastMergedPage.current = 0;
    }
  }, [open]);

  const defaultLabel = (item: User | Teacher | Parent | Course) => {
    const u = (item as Teacher | Parent).user ?? item as User;
    if ('firstName' in u && 'lastName' in u) return `${u.firstName} ${u.lastName}`;
    if ('name' in item) return (item as Course).name;
    return String((item as User).email ?? (item as { id: number }).id);
  };
  const defaultValue = (item: User | Teacher | Parent | Course) => String((item as { id: number }).id);
  const labelFn = getItemLabel ?? defaultLabel;
  const valueFn = getItemValue ?? defaultValue;

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPage((p) => p + 1);
  };

  return (
    <Select value={value} onValueChange={onValueChange} open={open} onOpenChange={setOpen}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[240px]">
          {optional && (
            <SelectItem value="">None</SelectItem>
          )}
          {accumulated.map((item) => (
            <SelectItem key={valueFn(item)} value={valueFn(item)}>
              {resource === 'users' && (item as User).email ? `${labelFn(item)} (${(item as User).email})` : labelFn(item)}
            </SelectItem>
          ))}
          {hasMore && (
            <div className="p-2 flex justify-center border-t">
              <Button type="button" variant="ghost" size="sm" onClick={handleLoadMore} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load more'}
              </Button>
            </div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
