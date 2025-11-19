# Authentication System Documentation

## Overview
This refactored authentication system provides a clean, production-ready implementation with proper separation of concerns, type safety, and modern React patterns.

## Architecture

### 1. Service Layer (`services/authService.ts`)
- **Singleton Pattern**: Single instance manages all auth operations
- **Token Management**: Automatic localStorage handling
- **API Integration**: Clean interface to backend API
- **Error Handling**: Consistent error messages and logging

**Key Methods:**
```typescript
- login(credentials: LoginCredentials): Promise<AuthResponse>
- register(data: RegisterData): Promise<AuthResponse>
- getCurrentUser(): Promise<User>
- logout(): void
- isAuthenticated(): boolean
- initialize(): Promise<User | null>
```

### 2. Redux State Management (`store/slices/authSlice.v2.ts`)
- **Modern Redux Toolkit**: Uses createSlice and createAsyncThunk
- **Type Safety**: Full TypeScript support
- **Async Actions**: Handles loading and error states
- **Clean State**: Single source of truth for auth

**State Shape:**
```typescript
{
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  isInitialized: boolean
}
```

**Actions:**
```typescript
// Async Thunks
- initializeAuth(): Initialize from localStorage
- loginUser(credentials): Login user
- registerUser(data): Register new user
- getCurrentUser(): Refresh user data

// Sync Actions
- logoutUser(): Clear auth state
- clearAuthError(): Clear error messages
- updateUserData(user): Update user info
```

### 3. Custom Hook (`hooks/useAuth.ts`)
- **Easy Access**: Simple interface to auth state and actions
- **Navigation Integration**: Auto-redirect after login/logout
- **Type Safety**: Full TypeScript support

**Usage:**
```typescript
const { 
  user, 
  isAuthenticated, 
  isLoading, 
  error,
  login, 
  register, 
  logout 
} = useAuth();
```

### 4. UI Components

#### LoginModal (`components/auth/LoginModal.tsx`)
- **Modern Design**: Clean, accessible interface
- **Role-Based**: Support for all user roles
- **Form Validation**: Built-in validation
- **Loading States**: Visual feedback during auth
- **Error Display**: Clear error messages

#### ProtectedRoute (`components/auth/ProtectedRoute.tsx`)
- **Auth Guard**: Prevents unauthorized access
- **Role-Based Access**: Optional role restrictions
- **Loading State**: Shows spinner during initialization
- **Access Denied**: User-friendly error page

## Usage Examples

### 1. Login Component
```typescript
import { useState } from 'react';
import { LoginModal } from './components/auth/LoginModal';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      <button onClick={() => setShowLogin(true)}>
        Login
      </button>
      
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          console.log('Login successful!');
          setShowLogin(false);
        }}
      />
    </div>
  );
}
```

### 2. Protected Routes
```typescript
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Protected route - any authenticated user */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Protected route - specific roles only */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'direction']}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### 3. Using Auth Hook
```typescript
import { useAuth } from './hooks/useAuth';

function UserProfile() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 4. App Initialization
```typescript
// In App.tsx
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { initializeAuth } from './store/slices/authSlice.v2';

function App() {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Initialize auth from localStorage on app start
    dispatch(initializeAuth());
  }, [dispatch]);
  
  return (
    <Router>
      {/* Your routes */}
    </Router>
  );
}
```

## User Roles

The system supports five user roles:

1. **student**: Access to grades, homework, schedule
2. **teacher**: Manage classes, assignments, grades
3. **parent**: Monitor child progress, communicate with teachers
4. **direction**: School leadership, oversight
5. **admin**: Full system access and management

## Security Features

- **Token Storage**: Secure localStorage with automatic cleanup
- **Token Validation**: Server-side verification on each request
- **Protected Routes**: Client-side route guards
- **Role-Based Access**: Fine-grained permission control
- **Auto Logout**: Clears state on invalid token
- **Error Handling**: Prevents sensitive data exposure

## API Integration

The auth service integrates with the backend API at `/api/auth`:

- `POST /api/auth/login`: Login with email/password
- `POST /api/auth/register`: Create new account
- `GET /api/auth/me`: Get current user (requires token)

## Benefits

1. **Clean Code**: Separation of concerns, single responsibility
2. **Type Safety**: Full TypeScript support, fewer runtime errors
3. **Maintainability**: Modular structure, easy to extend
4. **User Experience**: Smooth transitions, loading states, error handling
5. **Security**: Token management, route protection, role-based access
6. **Testability**: Pure functions, dependency injection ready

## Migration from Old System

If migrating from the old AuthContext:

1. Replace `useContext(AuthContext)` with `useAuth()` hook
2. Update imports from `authSlice.ts` to `authSlice.v2.ts`
3. Replace `AuthModal` with `LoginModal`
4. Wrap protected routes with `<ProtectedRoute>` component
5. Initialize auth in App.tsx with `dispatch(initializeAuth())`

## Future Enhancements

- [ ] Remember me functionality
- [ ] Password reset flow
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Session timeout handling
- [ ] Social login (Google, Microsoft)
- [ ] Token refresh mechanism
- [ ] Offline mode support
