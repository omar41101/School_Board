# Redux State Management Implementation

## Overview
This project now uses **Redux Toolkit** for centralized state management across the application.

## Store Structure

```
src/store/
├── index.ts              # Main store configuration
├── hooks.ts              # Typed Redux hooks (useAppDispatch, useAppSelector)
└── slices/
    ├── authSlice.ts      # Authentication state
    ├── studentSlice.ts   # Student data state
    ├── teacherSlice.ts   # Teacher data state
    └── adminSlice.ts     # Admin data state
```

## Slices

### 1. **authSlice**
Manages user authentication state.

**State:**
- `user`: Current user object
- `token`: JWT authentication token
- `isAuthenticated`: Boolean flag
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `login(email, password)` - User login
- `register(userData)` - User registration
- `loadUser()` - Load current user from token
- `logout()` - Clear user session
- `clearError()` - Clear error state

**Usage:**
```typescript
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, logout } from '../../store/slices/authSlice';

const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
const dispatch = useAppDispatch();

// Login
dispatch(login({ email, password }));

// Logout
dispatch(logout());
```

### 2. **studentSlice**
Manages student-specific data.

**State:**
- `studentData`: Student profile
- `courses`: Enrolled courses
- `grades`: Student grades
- `assignments`: Assignments
- `attendance`: Attendance records
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `fetchStudentData(userId)` - Fetch all student data
- `clearStudentData()` - Clear student state

**Usage:**
```typescript
import { fetchStudentData } from '../../store/slices/studentSlice';

const { studentData, courses, grades, loading } = useAppSelector((state) => state.student);

useEffect(() => {
  if (user?._id) {
    dispatch(fetchStudentData(user._id));
  }
}, [user?._id, dispatch]);
```

### 3. **teacherSlice**
Manages teacher-specific data.

**State:**
- `teacherData`: Teacher profile
- `courses`: Taught courses
- `assignments`: Created assignments
- `students`: Enrolled students
- `grades`: Student grades
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `fetchTeacherData(userId)` - Fetch all teacher data
- `clearTeacherData()` - Clear teacher state

**Usage:**
```typescript
import { fetchTeacherData } from '../../store/slices/teacherSlice';

const { teacherData, courses, students, loading } = useAppSelector((state) => state.teacher);

useEffect(() => {
  if (user?._id) {
    dispatch(fetchTeacherData(user._id));
  }
}, [user?._id, dispatch]);
```

### 4. **adminSlice**
Manages admin dashboard data.

**State:**
- `students`: All students
- `courses`: All courses
- `teachers`: All teachers
- `payments`: All payments
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `fetchAdminData()` - Fetch all admin data
- `clearAdminData()` - Clear admin state

**Usage:**
```typescript
import { fetchAdminData } from '../../store/slices/adminSlice';

const { students, courses, teachers, loading } = useAppSelector((state) => state.admin);

useEffect(() => {
  dispatch(fetchAdminData());
}, [dispatch]);
```

## Custom Hooks

### useAppDispatch
Type-safe dispatch hook.

```typescript
import { useAppDispatch } from '../../store/hooks';

const dispatch = useAppDispatch();
dispatch(login({ email, password }));
```

### useAppSelector
Type-safe selector hook.

```typescript
import { useAppSelector } from '../../store/hooks';

const user = useAppSelector((state) => state.auth.user);
const loading = useAppSelector((state) => state.student.loading);
```

## Benefits

1. **Centralized State**: All application state in one place
2. **Type Safety**: Full TypeScript support with typed hooks
3. **DevTools**: Redux DevTools integration for debugging
4. **Performance**: Automatic memoization and optimizations
5. **Scalability**: Easy to add new slices for new features
6. **Predictability**: Predictable state changes through actions
7. **Testing**: Easy to test with Redux Toolkit Testing Library

## API Integration

All slices use the centralized API client (`src/lib/api.ts`) with the `normalizeArrayResponse` helper to handle different API response formats.

## Example: Complete Flow

```typescript
// Component
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchStudentData } from '../../store/slices/studentSlice';
import { useAuth } from '../../contexts/AuthContext';

function StudentDashboard() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { studentData, courses, grades, loading, error } = useAppSelector(
    (state) => state.student
  );

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchStudentData(user._id));
    }
  }, [user?._id, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {studentData?.user?.firstName}!</h1>
      <p>Courses: {courses.length}</p>
      <p>Grades: {grades.length}</p>
    </div>
  );
}
```

## Migration Guide

### Before (Component State)
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const response = await api.getData();
    setData(response);
    setLoading(false);
  };
  fetchData();
}, []);
```

### After (Redux)
```typescript
const { data, loading } = useAppSelector((state) => state.feature);
const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchData());
}, [dispatch]);
```

## Future Enhancements

1. Add RTK Query for advanced API caching
2. Add persistence middleware for offline support
3. Add analytics tracking middleware
4. Add optimistic updates for better UX
5. Add entity adapters for normalized state

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
