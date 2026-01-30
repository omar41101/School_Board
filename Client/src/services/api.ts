import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  User,
  Student,
  Teacher,
  Parent,
  Course,
  Grade,
  Assignment,
  Attendance,
  Payment,
  Event,
  Message,
  Cantine,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  FilterParams,
} from '../types';

function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.replace(/\/+$/, '');
  // If user sets http://localhost:3000/api, we need /api/v0 for Nest global prefix
  if (trimmed.endsWith('/api')) return `${trimmed}/v0`;
  return trimmed;
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v0');

const REFRESH_TOKEN_KEY = 'refreshToken';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

async function baseQueryWithReauth(args: Parameters<typeof baseQuery>[0], api: Parameters<Parameters<typeof baseQuery>[1]>[1], extraOptions: Parameters<typeof baseQuery>[2]) {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        const data = refreshResult.data as { token?: string; accessToken?: string; refreshToken?: string };
        const newAccess = data.accessToken ?? data.token;
        if (newAccess) localStorage.setItem('token', newAccess);
        if (data.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }
  return result;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Student',
    'Teacher',
    'Parent',
    'Course',
    'Grade',
    'Assignment',
    'Attendance',
    'Payment',
    'Event',
    'Message',
    'Cantine',
  ],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<AuthResponse, Record<string, unknown>>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Student', 'Teacher', 'Parent'],
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    getCurrent: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    // Profile /me endpoints for role-specific data
    getStudentMe: builder.query<ApiResponse<{ student: Student }>, void>({
      query: () => '/students/me',
      providesTags: ['Student'],
    }),
    getTeacherMe: builder.query<ApiResponse<{ teacher: Teacher }>, void>({
      query: () => '/teachers/me',
      providesTags: ['Teacher'],
    }),
    getParentMe: builder.query<ApiResponse<{ parent: Parent }>, void>({
      query: () => '/parents/me',
      providesTags: ['Parent'],
    }),
    updatePassword: builder.mutation<{ status: string; token: string; message: string }, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/update-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Users
    getUsers: builder.query<PaginatedResponse<User>, PaginationParams & FilterParams & { role?: User['role']; status?: 'active' | 'inactive' }>({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query<ApiResponse<{ user: User }>, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<ApiResponse<{ user: User }>, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    deactivateUser: builder.mutation<ApiResponse<{ user: User }>, number>({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Students
    getStudents: builder.query<PaginatedResponse<Student>, PaginationParams & FilterParams>({
      query: (params) => ({
        url: '/students',
        params,
      }),
      providesTags: ['Student'],
    }),
    getStudentById: builder.query<ApiResponse<{ student: Student }>, number>({
      query: (id) => `/students/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation<ApiResponse<{ student: Student }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/students',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Student'],
    }),
    updateStudent: builder.mutation<ApiResponse<{ student: Student }>, { id: number; data: Partial<Student> & Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Student', id }],
    }),
    deleteStudent: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),

    // Teachers
    getTeachers: builder.query<PaginatedResponse<Teacher>, PaginationParams & FilterParams>({
      query: (params) => ({
        url: '/teachers',
        params: { ...params, limit: params.limit ?? 10 },
      }),
      providesTags: ['Teacher'],
    }),
    getTeacherById: builder.query<ApiResponse<{ teacher: Teacher }>, number>({
      query: (id) => `/teachers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Teacher', id }],
    }),
    createTeacher: builder.mutation<ApiResponse<{ teacher: Teacher }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/teachers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Teacher'],
    }),
    updateTeacher: builder.mutation<ApiResponse<{ teacher: Teacher }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/teachers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Teacher', id }],
    }),
    deleteTeacher: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teacher'],
    }),

    // Parents
    getParents: builder.query<PaginatedResponse<Parent>, PaginationParams & FilterParams>({
      query: (params) => ({
        url: '/parents',
        params: { ...params, limit: params.limit ?? 10 },
      }),
      providesTags: ['Parent'],
    }),
    getParentById: builder.query<ApiResponse<{ parent: Parent }>, number>({
      query: (id) => `/parents/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Parent', id }],
    }),
    createParent: builder.mutation<ApiResponse<{ parent: Parent }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/parents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Parent'],
    }),
    updateParent: builder.mutation<ApiResponse<{ parent: Parent }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/parents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Parent', id }],
    }),
    deleteParent: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/parents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Parent'],
    }),

    // Courses
    getCourses: builder.query<
      ApiResponse<{ courses: Course[] }> & { total?: number; totalPages?: number; currentPage?: number },
      FilterParams & PaginationParams & { student?: number; teacher?: number }
    >({
      query: (params) => ({
        url: '/courses',
        params: { ...params, limit: params.limit ?? 10 },
      }),
      providesTags: ['Course'],
    }),
    getCourseById: builder.query<ApiResponse<{ course: Course }>, number>({
      query: (id) => `/courses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Course', id }],
    }),
    createCourse: builder.mutation<ApiResponse<{ course: Course }>, Record<string, unknown>>({
      query: (data) => ({
        url: `/courses`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation<ApiResponse<{ course: Course }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Course', id }],
    }),
    deleteCourse: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
    enrollStudent: builder.mutation<ApiResponse<{ course: Course }>, { courseId: number; studentId: number }>({
      query: ({ courseId, studentId }) => ({
        url: `/courses/${courseId}/enroll`,
        method: 'POST',
        body: { studentId },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    // Grades
    getGrades: builder.query<ApiResponse<{ grades: Grade[] }>, FilterParams>({
      query: (params) => ({
        url: '/grades',
        params,
      }),
      providesTags: ['Grade'],
    }),
    createGrade: builder.mutation<ApiResponse<{ grade: Grade }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/grades',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Grade'],
    }),
    updateGrade: builder.mutation<ApiResponse<{ grade: Grade }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/grades/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Grade', id }],
    }),
    deleteGrade: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/grades/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Grade'],
    }),

    // Assignments
    getAssignments: builder.query<ApiResponse<{ assignments: Assignment[] }>, FilterParams & { course?: number; courseIds?: string }>({
      query: (params) => ({
        url: '/assignments',
        params: params?.course ? { course: String(params.course) } : params?.courseIds ? { courseIds: params.courseIds } : {},
      }),
      providesTags: ['Assignment'],
    }),
    createAssignment: builder.mutation<ApiResponse<{ assignment: Assignment }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/assignments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assignment'],
    }),
    updateAssignment: builder.mutation<ApiResponse<{ assignment: Assignment }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/assignments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Assignment', id }],
    }),
    deleteAssignment: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Attendance
    getAttendance: builder.query<ApiResponse<{ attendance: Attendance[] }>, FilterParams>({
      query: (params) => ({
        url: '/attendance',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    createAttendance: builder.mutation<ApiResponse<{ attendance: Attendance }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/attendance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    updateAttendance: builder.mutation<ApiResponse<{ attendance: Attendance }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/attendance/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Attendance', id }],
    }),
    deleteAttendance: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Payments
    getPayments: builder.query<
      ApiResponse<{ payments: Payment[] }>,
      FilterParams & { student?: number; parent?: number }
    >({
      query: (params) => ({
        url: '/payments',
        params,
      }),
      providesTags: ['Payment'],
    }),
    createPayment: builder.mutation<ApiResponse<{ payment: Payment }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    updatePayment: builder.mutation<ApiResponse<{ payment: Payment }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Payment', id }],
    }),
    deletePayment: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payment'],
    }),

    // Events
    getEvents: builder.query<ApiResponse<{ events: Event[] }>, FilterParams & { organizerId?: number }>({
      query: (params) => ({
        url: '/events',
        params: {
          ...params,
          ...(params.organizerId && { organizerId: String(params.organizerId) }),
        },
      }),
      providesTags: ['Event'],
    }),
    createEvent: builder.mutation<ApiResponse<{ event: Event }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/events',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation<ApiResponse<{ event: Event }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Event', id }],
    }),
    deleteEvent: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),

    // Messages - with infinite query support
    getMessages: builder.query<ApiResponse<{ messages: Message[] }>, { inbox?: boolean; sent?: boolean; page?: number; limit?: number }>({
      query: (params) => ({
        url: '/messages',
        params: {
          ...(params.inbox !== undefined && { inbox: String(params.inbox) }),
          ...(params.sent !== undefined && { sent: String(params.sent) }),
          ...(params.page !== undefined && { page: String(params.page) }),
          ...(params.limit !== undefined && { limit: String(params.limit) }),
        },
      }),
      providesTags: ['Message'],
    }),
    // NOTE: RTK Query "infinite scroll" pattern (merge pages into one cache entry)
    getMessagesInfinite: builder.query<
      ApiResponse<{ messages: Message[] }>,
      { inbox?: boolean; sent?: boolean; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: '/messages',
        params: {
          ...(params.inbox !== undefined && { inbox: String(params.inbox) }),
          ...(params.sent !== undefined && { sent: String(params.sent) }),
          page: String(params.page ?? 1),
          limit: String(params.limit ?? 10),
        },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.inbox ? 'inbox' : queryArgs.sent ? 'sent' : 'all'}`,
      merge: (currentCache, newItems) => {
        if (!currentCache?.data?.messages?.length) return newItems;
        return {
          ...newItems,
          data: {
            ...newItems.data,
            messages: [...currentCache.data.messages, ...(newItems.data?.messages ?? [])],
          },
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.inbox !== previousArg?.inbox ||
          currentArg?.sent !== previousArg?.sent
        );
      },
      providesTags: ['Message'],
    }),
    createMessage: builder.mutation<ApiResponse<{ message: Message }>, { recipientId: number; subject: string; content: string }>({
      query: (data) => ({
        url: '/messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message'],
    }),
    deleteMessage: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),

    // Cantine
    getCantine: builder.query<ApiResponse<{ orders: Cantine[] }>, FilterParams>({
      query: (params) => ({
        url: '/cantine',
        params,
      }),
      providesTags: ['Cantine'],
    }),
    createCantineOrder: builder.mutation<ApiResponse<{ order: Cantine }>, Record<string, unknown>>({
      query: (data) => ({
        url: '/cantine',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cantine'],
    }),
    updateCantineOrder: builder.mutation<ApiResponse<{ order: Cantine }>, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/cantine/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Cantine', id }],
    }),
    deleteCantineOrder: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/cantine/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cantine'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetCurrentQuery,
  useRefreshTokenMutation,
  useGetStudentMeQuery,
  useGetTeacherMeQuery,
  useGetParentMeQuery,
  useUpdatePasswordMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useGetParentsQuery,
  useGetParentByIdQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useEnrollStudentMutation,
  useGetGradesQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAttendanceQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetMessagesQuery,
  useGetMessagesInfiniteQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useGetCantineQuery,
  useCreateCantineOrderMutation,
  useUpdateCantineOrderMutation,
  useDeleteCantineOrderMutation,
} = api;
