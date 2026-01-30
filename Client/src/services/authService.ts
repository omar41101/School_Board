/**
 * Authentication Service
 * Handles all authentication-related API calls and business logic
 */

import { authApi, apiClient } from '../lib/api';

export type UserRole = 'admin' | 'student' | 'teacher' | 'parent' | 'direction';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: User;
  message?: string;
}

class AuthService {
  private static instance: AuthService;
  private readonly TOKEN_KEY = 'token';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authApi.login(credentials.email, credentials.password) as any;
      
      if (!response || !response.token || !response.data) {
        throw new Error('Invalid response from server');
      }

      const authResponse: AuthResponse = {
        success: response.success || true,
        token: response.token,
        data: response.data,
      };

      // Store token and user data
      this.setToken(authResponse.token);
      this.setUser(authResponse.data);

      return authResponse;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authApi.register(data) as any;
      
      if (!response || !response.token || !response.data) {
        throw new Error('Invalid response from server');
      }

      const authResponse: AuthResponse = {
        success: response.success || true,
        token: response.token,
        data: response.data,
      };

      // Store token and user data
      this.setToken(authResponse.token);
      this.setUser(authResponse.data);

      return authResponse;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await authApi.getCurrentUser() as any;
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      const user: User = response.data;

      // Update stored user data
      this.setUser(user);

      return user;
    } catch (error: any) {
      console.error('Get current user error:', error);
      // Clear invalid token
      this.clearAuth();
      throw new Error(error.response?.data?.message || error.message || 'Failed to get user');
    }
  }

  /**
   * Logout user and clear stored data
   */
  logout(): void {
    this.clearAuth();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Store token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    apiClient.setToken(token);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  }

  /**
   * Store user data
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    apiClient.setToken(null);
  }

  /**
   * Initialize authentication state. Uses refresh token to keep session 7 days.
   */
  async initialize(): Promise<User | null> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();

    if (!token) {
      return null;
    }

    apiClient.setToken(token);

    try {
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        try {
          const res = await authApi.refresh(refreshToken) as { token?: string; accessToken?: string; refreshToken?: string; data?: User };
          const newAccess = res?.accessToken ?? res?.token;
          if (newAccess) {
            this.setToken(newAccess);
            if (res?.refreshToken) this.setRefreshToken(res.refreshToken);
            const user = await this.getCurrentUser();
            return user;
          }
        } catch (refreshErr) {
          console.error('Refresh failed:', refreshErr);
        }
      }
      this.clearAuth();
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
