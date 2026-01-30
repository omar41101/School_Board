import { useAppSelector } from '../store/hooks';
import { useGetMeQuery } from '../services/api';
import type { User } from '../types';

export type Role = User['role'];

/**
 * Current user and permission helpers. Keeps session via getMe (and refresh token).
 * Use skip: true when not needed (e.g. on login page).
 */
export function usePermission(options?: { skip?: boolean }) {
  const { data: meData, isLoading, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: options?.skip ?? false,
  });
  const authUser = useAppSelector((state) => state.auth.user);

  const user = (meData?.data ?? authUser) as User | null | undefined;
  const role = user?.role ?? null;

  const hasRole = (r: Role | Role[]) => {
    if (!role) return false;
    return Array.isArray(r) ? r.includes(role) : role === r;
  };

  return {
    user,
    role,
    isLoading,
    isAuthenticated: isSuccess && !!user,
    isError,
    hasRole,
    isAdmin: role === 'admin',
    isDirection: role === 'direction',
    isTeacher: role === 'teacher',
    isStudent: role === 'student',
    isParent: role === 'parent',
    canAdmin: hasRole(['admin', 'direction']),
  };
}
