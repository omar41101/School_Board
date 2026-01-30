import { SetMetadata } from '@nestjs/common';

export enum Role {
  Admin = 'admin',
  Student = 'student',
  Teacher = 'teacher',
  Parent = 'parent',
  Direction = 'direction',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
