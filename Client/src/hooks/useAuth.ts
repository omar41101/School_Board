/**
 * Custom Auth Hook
 * Provides easy access to authentication state and actions
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginUser,
  registerUser,
  logoutUser,
  clearAuthError,
  initializeAuth,
  getCurrentUser,
} from '../store/slices/authSlice.v2';
import { LoginCredentials, RegisterData } from '../services/authService';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard');
        return result.payload;
      }
      throw new Error(result.payload as string);
    },
    [dispatch, navigate]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        navigate('/dashboard');
        return result.payload;
      }
      throw new Error(result.payload as string);
    },
    [dispatch, navigate]
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
    navigate('/');
  }, [dispatch, navigate]);

  const initialize = useCallback(() => {
    return dispatch(initializeAuth());
  }, [dispatch]);

  const refresh = useCallback(() => {
    return dispatch(getCurrentUser());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    // State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.loading,
    error: authState.error,
    isInitialized: authState.isInitialized || false,
    
    // Actions
    login,
    register,
    logout,
    initialize,
    refresh,
    clearError,
  };
}
