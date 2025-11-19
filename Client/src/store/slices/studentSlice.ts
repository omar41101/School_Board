import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { studentApi, courseApi, gradeApi, assignmentApi, attendanceApi, normalizeArrayResponse } from '../../lib/api';

// Minimal domain type definitions for the slice (only required fields)
interface IdObject { _id: string }
type IdRef<T extends string = string> = string | { _id: T }

interface Student {
  _id: string;
  user?: string | {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  level?: string;
  currentClass?: string;
  [key: string]: any;
}

interface Course {
  _id: string;
  teacher?: string | {
    _id?: string;
    firstName?: string;
    lastName?: string;
    user?: {
      firstName?: string;
      lastName?: string;
    };
  };
  enrolledStudents?: string[]; // array of student _id strings
  name?: string;
  subject?: string;
  schedule?: any[]; // UI consumes schedule items
  [key: string]: any;
}

interface Grade {
  _id: string;
  student?: string | { _id?: string };
  course?: string | { _id?: string };
  percentage?: number;
  examDate?: string;
  examType?: string;
  subject?: string;
  assignment?: string | { _id?: string };
  grade?: number; // some dashboard logic uses grade.grade
  [key: string]: any;
}

interface Assignment {
  _id: string;
  course?: string | { _id?: string; name?: string };
  dueDate?: string;
  subject?: string;
  title?: string;
  [key: string]: any;
}

interface AttendanceRecord {
  _id: string;
  student?: string | { _id?: string };
  status?: 'present' | 'late' | 'absent';
  [key: string]: any;
}

interface StudentDataPayload {
  studentData: Student;
  courses: Course[];
  grades: Grade[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
}

interface StudentState {
  studentData: Student | null;
  courses: Course[];
  grades: Grade[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  studentData: null,
  courses: [],
  grades: [],
  assignments: [],
  attendance: [],
  loading: false,
  error: null,
};

// Helper to extract an _id from a string or object reference
const getId = (value: any): string | undefined => {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value._id;
};

export const fetchStudentData = createAsyncThunk<
  StudentDataPayload,
  string,
  { rejectValue: string }
>(
  'student/fetchData',
  async (userId, { rejectWithValue }) => {
    try {
      const [studentsResponse, coursesResponse, gradesResponse, assignmentsResponse, attendanceResponse] = await Promise.all([
        studentApi.getAll(),
        courseApi.getAll(),
        gradeApi.getAll(),
        assignmentApi.getAll(),
        attendanceApi.getAll(),
      ]);

      const students = normalizeArrayResponse(studentsResponse) as Student[];
      const allCourses = normalizeArrayResponse(coursesResponse) as Course[];
      const allGrades = normalizeArrayResponse(gradesResponse) as Grade[];
      const allAssignments = normalizeArrayResponse(assignmentsResponse) as Assignment[];
      const allAttendance = normalizeArrayResponse(attendanceResponse) as AttendanceRecord[];

      const myStudent = students.find((s) => getId(s.user) === userId);
      if (!myStudent) throw new Error('Student profile not found');

      const myCourses = allCourses.filter((c) =>
        (c.enrolledStudents || []).some((sid) => sid === myStudent._id)
      );

      const myGrades = allGrades.filter((g) => getId(g.student) === myStudent._id);

      const myAssignments = allAssignments.filter((a) =>
        myCourses.some((c) => c._id === getId(a.course))
      );

      const myAttendance = allAttendance.filter((a) => getId(a.student) === myStudent._id);

      return {
        studentData: myStudent,
        courses: myCourses,
        grades: myGrades,
        assignments: myAssignments,
        attendance: myAttendance,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch student data');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearStudentData: (state) => {
      state.studentData = null;
      state.courses = [];
      state.grades = [];
      state.assignments = [];
      state.attendance = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentData.fulfilled, (state, action: PayloadAction<StudentDataPayload>) => {
        state.loading = false;
        state.studentData = action.payload.studentData;
        state.courses = action.payload.courses;
        state.grades = action.payload.grades;
        state.assignments = action.payload.assignments;
        state.attendance = action.payload.attendance;
      })
      .addCase(fetchStudentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStudentData } = studentSlice.actions;
export default studentSlice.reducer;
