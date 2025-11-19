import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentApi, courseApi, teacherApi, paymentApi, normalizeArrayResponse } from '../../lib/api';

interface AdminState {
  students: any[];
  courses: any[];
  teachers: any[];
  payments: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  students: [],
  courses: [],
  teachers: [],
  payments: [],
  loading: false,
  error: null,
};

export const fetchAdminData = createAsyncThunk(
  'admin/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const [studentsResponse, coursesResponse, teachersResponse, paymentsResponse] = await Promise.all([
        studentApi.getAll(),
        courseApi.getAll(),
        teacherApi.getAll(),
        paymentApi.getAll()
      ]);

      return {
        students: normalizeArrayResponse(studentsResponse),
        courses: normalizeArrayResponse(coursesResponse),
        teachers: normalizeArrayResponse(teachersResponse),
        payments: normalizeArrayResponse(paymentsResponse),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch admin data');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminData: (state) => {
      state.students = [];
      state.courses = [];
      state.teachers = [];
      state.payments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.courses = action.payload.courses;
        state.teachers = action.payload.teachers;
        state.payments = action.payload.payments;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;
