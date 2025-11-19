// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to normalize API responses that might have nested data
export function normalizeArrayResponse<T>(response: any): T[] {
  // Direct array
  if (Array.isArray(response)) {
    return response;
  }
  
  // response.data is array
  if (response?.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // response.data.data is array
  if (response?.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  // response.data is an object with a resource key (e.g., {assignments: [], courses: [], students: []})
  if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    // Find the first array property in response.data
    const keys = Object.keys(response.data);
    for (const key of keys) {
      if (Array.isArray(response.data[key])) {
        return response.data[key];
      }
    }
  }
  
  console.warn('Unexpected response format:', response);
  return [];
}

// API Client Class
class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authApi = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }) => apiClient.post('/auth/register', data),

  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  logout: () => apiClient.post('/auth/logout'),

  getCurrentUser: () => apiClient.get('/auth/me'),

  updatePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put('/auth/update-password', { currentPassword, newPassword }),
};

// User API
export const userApi = {
  getAll: (params?: any) => apiClient.get(`/users?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/users/${id}`),
  update: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
  deactivate: (id: string) => apiClient.patch(`/users/${id}/deactivate`),
};

// Student API
export const studentApi = {
  getAll: (params?: any) => apiClient.get(`/students?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/students/${id}`),
  create: (data: any) => apiClient.post('/students', data),
  update: (id: string, data: any) => apiClient.put(`/students/${id}`, data),
  delete: (id: string) => apiClient.delete(`/students/${id}`),
};

// Teacher API
export const teacherApi = {
  getAll: (params?: any) => apiClient.get(`/teachers?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/teachers/${id}`),
  create: (data: any) => apiClient.post('/teachers', data),
  update: (id: string, data: any) => apiClient.put(`/teachers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/teachers/${id}`),
};

// Parent API
export const parentApi = {
  getAll: (params?: any) => apiClient.get(`/parents?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/parents/${id}`),
  create: (data: any) => apiClient.post('/parents', data),
  update: (id: string, data: any) => apiClient.put(`/parents/${id}`, data),
  delete: (id: string) => apiClient.delete(`/parents/${id}`),
};

// Course API
export const courseApi = {
  getAll: (params?: any) => apiClient.get(`/courses?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/courses/${id}`),
  create: (data: any) => apiClient.post('/courses', data),
  update: (id: string, data: any) => apiClient.put(`/courses/${id}`, data),
  delete: (id: string) => apiClient.delete(`/courses/${id}`),
  enroll: (id: string, studentId: string) =>
    apiClient.post(`/courses/${id}/enroll`, { studentId }),
};

// Grade API
export const gradeApi = {
  getAll: (params?: any) => apiClient.get(`/grades?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/grades/${id}`),
  create: (data: any) => apiClient.post('/grades', data),
  update: (id: string, data: any) => apiClient.put(`/grades/${id}`, data),
  delete: (id: string) => apiClient.delete(`/grades/${id}`),
};

// Assignment API
export const assignmentApi = {
  getAll: (params?: any) => apiClient.get(`/assignments?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/assignments/${id}`),
  create: (data: any) => apiClient.post('/assignments', data),
  update: (id: string, data: any) => apiClient.put(`/assignments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/assignments/${id}`),
  submit: (id: string, data: any) => apiClient.post(`/assignments/${id}/submit`, data),
};

// Attendance API
export const attendanceApi = {
  getAll: (params?: any) => apiClient.get(`/attendance?${new URLSearchParams(params)}`),
  create: (data: any) => apiClient.post('/attendance', data),
  update: (id: string, data: any) => apiClient.put(`/attendance/${id}`, data),
  delete: (id: string) => apiClient.delete(`/attendance/${id}`),
};

// Payment API
export const paymentApi = {
  getAll: (params?: any) => apiClient.get(`/payments?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/payments/${id}`),
  create: (data: any) => apiClient.post('/payments', data),
  update: (id: string, data: any) => apiClient.put(`/payments/${id}`, data),
  markAsPaid: (id: string, data?: any) => apiClient.patch(`/payments/${id}/mark-paid`, data),
};

// Message API
export const messageApi = {
  getAll: (params?: any) => apiClient.get(`/messages?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/messages/${id}`),
  send: (data: any) => apiClient.post('/messages', data),
  markAsRead: (id: string) => apiClient.patch(`/messages/${id}/read`),
  delete: (id: string) => apiClient.delete(`/messages/${id}`),
};

// Event API
export const eventApi = {
  getAll: (params?: any) => apiClient.get(`/events?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/events/${id}`),
  create: (data: any) => apiClient.post('/events', data),
  update: (id: string, data: any) => apiClient.put(`/events/${id}`, data),
  delete: (id: string) => apiClient.delete(`/events/${id}`),
  join: (id: string) => apiClient.post(`/events/${id}/join`),
};

// Cantine API
export const cantineApi = {
  getAll: (params?: any) => apiClient.get(`/cantine?${new URLSearchParams(params)}`),
  getById: (id: string) => apiClient.get(`/cantine/${id}`),
  create: (data: any) => apiClient.post('/cantine', data),
  update: (id: string, data: any) => apiClient.put(`/cantine/${id}`, data),
  cancel: (id: string) => apiClient.patch(`/cantine/${id}/cancel`),
};

export default apiClient;
